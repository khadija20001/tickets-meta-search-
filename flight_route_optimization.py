%pyspark
from pyspark.sql.functions import col, to_date, datediff, avg, trim, regexp_replace, lit, month, dayofweek, \
    monotonically_increasing_id
from pyspark.sql import functions as F

# Load and preprocess itineraries dataset
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")
itineraries_df = spark.sql("""
    SELECT 
        startingAirport, 
        destinationAirport, 
        totalFare, 
        travelDuration, 
        flightDate,
        segmentsArrivalAirportCode,
        segmentsDepartureAirportCode,
        isNonStop
    FROM fitineraries
    WHERE legId != 'legId'
""").na.drop(subset=["startingAirport", "destinationAirport", "totalFare", "travelDuration", "flightDate"])

# Convert flightDate to a proper date format
itineraries_df = itineraries_df.withColumn("flightDate", to_date(col("flightDate"), "MM/dd/yyyy"))

# Load airport metadata and clean data
airports_df = spark.sql("""
    SELECT 
        COALESCE(iata_code, ident) AS airportCode,
        name AS airportName,
        municipality AS city,
        iso_country AS countryCode,
        latitude_deg AS latitude,
        longitude_deg AS longitude
    FROM airports
""").withColumn("airportCode", trim(regexp_replace("airportCode", '"', ''))) \
    .withColumn("countryCode", trim(regexp_replace("countryCode", '"', '')))

# Load country metadata and clean data
countries_df = spark.sql("""
    SELECT 
        TRIM(REGEXP_REPLACE(code, '"', '')) AS countryCode,
        TRIM(REGEXP_REPLACE(name, '"', '')) AS countryName,
        TRIM(REGEXP_REPLACE(continent, '"', '')) AS continent
    FROM countries
""").withColumn("countryCode", trim(regexp_replace("countryCode", '"', '')))

# Preprocess flight connections
flight_connections_df = itineraries_df.select(
    col("startingAirport").alias("source"),
    col("destinationAirport").alias("destination"),
    col("totalFare").alias("cost"),
    col("travelDuration").alias("duration"),
    col("isNonStop").alias("is_direct")
)

# Add a unique edge ID for each flight connection
flight_connections_df = flight_connections_df.withColumn(
    "edge_id",
    F.concat_ws("_", col("source"), col("destination"), col("cost"))
)

# Extract unique airports (nodes)
nodes_df = flight_connections_df.select(col("source").alias("airportCode")) \
    .union(flight_connections_df.select(col("destination").alias("airportCode"))) \
    .distinct()

# Add a node ID for each airport
nodes_df = nodes_df.withColumn("node_id", monotonically_increasing_id())

# Join nodes with edges to get node IDs for source and destination
edges_df = flight_connections_df \
    .join(nodes_df, flight_connections_df.source == nodes_df.airportCode) \
    .withColumnRenamed("node_id", "source_id") \
    .drop("airportCode") \
    .join(nodes_df, flight_connections_df.destination == nodes_df.airportCode) \
    .withColumnRenamed("node_id", "destination_id") \
    .drop("airportCode")

# Add edge weights (cost + duration weight factor)
edges_df = edges_df.withColumn(
    "edge_weight",
    col("cost") + (col("duration") * 0.1)  # Adjust weight factor as needed
).na.drop(subset=["edge_weight"])  # Drop rows with null edge_weight


# Corrected Dijkstra's Algorithm
def dijkstra(edges_df, start_node, end_node):
    from pyspark.sql.functions import col

    # Initialize distances
    distances = {start_node: 0}
    visited = set()
    path = {}

    while True:
        # Find the node with the smallest distance
        unvisited_nodes = {node: dist for node, dist in distances.items() if node not in visited}
        if not unvisited_nodes:
            return "No path found", float('inf')

        # Find the node with the smallest distance manually
        current_node = None
        min_distance = float('inf')
        for node, dist in unvisited_nodes.items():
            if dist < min_distance:
                min_distance = dist
                current_node = node

        # Stop if we reach the destination
        if current_node == end_node:
            break

        # Mark the current node as visited
        visited.add(current_node)

        # Update distances for neighboring nodes
        neighbors = edges_df.filter(col("source_id") == current_node).collect()
        for neighbor in neighbors:
            neighbor_node = neighbor["destination_id"]
            neighbor_weight = neighbor["edge_weight"]
            if neighbor_weight is None:  # Skip if edge_weight is None
                continue
            new_distance = distances[current_node] + neighbor_weight

            if neighbor_node not in distances or new_distance < distances[neighbor_node]:
                distances[neighbor_node] = new_distance
                path[neighbor_node] = current_node

    # Reconstruct the path
    shortest_path = []
    current = end_node
    while current != start_node:
        shortest_path.append(current)
        current = path[current]
    shortest_path.append(start_node)
    shortest_path.reverse()

    return shortest_path, distances[end_node]


# Example: Find the cheapest path from JFK to LAX
# Get node IDs for JFK and LAX
start_airport = "JFK"
end_airport = "LAX"

start_node = nodes_df.filter(col("airportCode") == start_airport).select("node_id").collect()[0][0]
end_node = nodes_df.filter(col("airportCode") == end_airport).select("node_id").collect()[0][0]

# Run Dijkstra's algorithm
shortest_path, total_cost = dijkstra(edges_df, start_node, end_node)

# Map node IDs back to airport codes
path_airports = nodes_df.filter(col("node_id").isin(shortest_path)).select("airportCode").collect()
path_airports = [row["airportCode"] for row in path_airports]

print(f"Cheapest path from {start_airport} to {end_airport}: {' -> '.join(path_airports)}")
print(f"Total cost: {total_cost}")

# Analyze average cost and duration for layovers
layover_analysis_df = itineraries_df.filter(col("isNonStop") == False) \
    .groupBy("segmentsArrivalAirportCode") \
    .agg(
    avg("totalFare").alias("avg_fare"),
    avg("travelDuration").alias("avg_duration")
) \
    .orderBy("avg_fare")

print("Average Fare and Duration for Layovers:")
layover_analysis_df.show(10)

# Enrich results with airport and country information
enriched_df = itineraries_df \
    .join(airports_df, itineraries_df.startingAirport == airports_df.airportCode, "left") \
    .join(countries_df, airports_df.countryCode == countries_df.countryCode, "left") \
    .select(
    "startingAirport",
    "destinationAirport",
    "flightDate",
    "totalFare",
    "travelDuration",
    "isNonStop",
    "airportName",
    "city",
    "countryName",
    "continent"
)

# Display enriched results
print("Enriched Data with Airport and Country Info:")
z.show(enriched_df)