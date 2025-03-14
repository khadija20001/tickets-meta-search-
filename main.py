%pyspark
from pyspark.sql.functions import udf, trim, regexp_replace
from pyspark.sql.types import IntegerType
import re


# UDF to convert ISO travel duration (PTxHxM) into minutes
def conv_dur_min(duration_str):
    h_min = re.findall(r'\d+', duration_str)
    if h_min:
        hours = int(h_min[0])
        minutes = int(h_min[1]) if len(h_min) > 1 else 0
        return hours * 60 + minutes
    return 0


# Register UDF with Spark
convert_duration_udf = udf(conv_dur_min, IntegerType())
# Use the flight_analysis database
spark.sql("USE flight_analysis")


# Function to process and enrich itineraries
def your_distination(departure_airport_code, max_travel_duration, max_flight_cost=None):
    """
    Spark function to process itineraries and enrich data with airports and countries datasets.
    """

    #  Load Itineraries Dataset
    itineraries_df = spark.sql(
        "SELECT startingAirport, destinationAirport, totalFare, travelDuration FROM fitineraries WHERE legid != 'legId'"
    ).na.drop(subset=["startingAirport", "destinationAirport", "totalFare", "travelDuration"])

    # Load Additional Datasets
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

    countries_df = spark.sql("""  
        SELECT   
            REGEXP_REPLACE(code, '"', '') AS countryCode,   
            REGEXP_REPLACE(name, '"', '') AS countryName,   
            REGEXP_REPLACE(continent, '"', '') AS continent  
        FROM countries  
    """).withColumn("countryCode", trim(regexp_replace("countryCode", '"', '')))

    #  Enrich Itineraries with Airport and Country Data
    enriched_itineraries_df = itineraries_df \
        .join(airports_df, itineraries_df.destinationAirport == airports_df.airportCode, how="left") \
        .join(countries_df, airports_df.countryCode == countries_df.countryCode, how="left") \
        .withColumn("travelDurationInMinutes", convert_duration_udf(itineraries_df.travelDuration)) \
        .select(
        "startingAirport",
        "destinationAirport",
        "totalFare",
        "travelDuration",
        "travelDurationInMinutes",
        "airportName",
        "city",
        "countryName",
        "continent",
    )

    # STEP 4: Apply Filtering
    filtered_itineraries_df = enriched_itineraries_df \
        .filter(enriched_itineraries_df.startingAirport == departure_airport_code) \
        .filter(enriched_itineraries_df.travelDurationInMinutes <= max_travel_duration)
    if max_flight_cost is not None:
        filtered_itineraries_df = filtered_itineraries_df.filter(filtered_itineraries_df.totalFare <= max_flight_cost)

        #  Aggregate and Finalize Results
    # Aggregate the filtered itineraries to find the lowest fare and shortest travel time
    aggregated_results_df = filtered_itineraries_df.groupBy("destinationAirport").agg(
        {"totalFare": "min", "travelDurationInMinutes": "min"}
    ).withColumnRenamed("min(totalFare)", "lowestFare") \
        .withColumnRenamed("min(travelDurationInMinutes)", "shortestTravelTime")

    # Join aggregated results with airports_df to get additional airport details
    results_with_airports_df = aggregated_results_df \
        .join(airports_df, aggregated_results_df.destinationAirport == airports_df.airportCode, how="left") \
        .select(
        "destinationAirport",
        "lowestFare",
        "shortestTravelTime",
        "airportName",
        "city",
        "countryCode"
    )

    # Join with countries_df using countryCode to get country details
    final_results_df = results_with_airports_df \
        .join(countries_df, "countryCode", how="left") \
        .select(
        "destinationAirport",
        "lowestFare",
        "shortestTravelTime",
        "airportName",
        "city",
        "countryName",
        "continent"
    )

    # Display the final results
    z.show(final_results_df)  # For Zeppelin, or use final_results_df.show() if Zeppelin is unavailable


# Test the function
departure_airport_code = "ATL"  # Example: Atlanta
max_travel_duration = 240  # Example: 4 hours (240 minutes)
max_flight_cost = 300  # Example: $300 budget

your_distination(departure_airport_code, max_travel_duration, max_flight_cost)