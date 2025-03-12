# Input: Departure location and travel time
departure_location = "ATL"  # Example: Atlanta
travel_time = "PT2H30M"     # Example: 2 hours 30 minutes

# Filter itineraries based on departure location and travel time
filtered_flights = itineraries_df.filter(
    (col("departure_airport") == departure_location) &
    (col("duration") <= travel_time)
)

# Find the lowest price for each destination
lowest_prices = filtered_flights.groupBy("arrival_airport").agg(
    min("price").alias("min_price")
)

# Join with airports data to get destination coordinates
result_df = lowest_prices.join(
    airports_df,
    lowest_prices.arrival_airport == airports_df.iata_code,
    "inner"
).select(
    col("arrival_airport"),
    col("min_price"),
    col("latitude_deg").alias("latitude"),
    col("longitude_deg").alias("longitude")
)

# Show the result
result_df.show()