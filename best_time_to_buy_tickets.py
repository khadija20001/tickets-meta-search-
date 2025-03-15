%pyspark
from pyspark.sql.functions import col, to_date, datediff, avg, trim, regexp_replace, lit, month, dayofweek
from pyspark.sql import functions as F

# Load and preprocess itineraries dataset
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")
itineraries_df = spark.sql("""  
    SELECT startingAirport, destinationAirport, totalFare, travelDuration, flightdate  
    FROM fitineraries  
    WHERE legid != 'legId'  
""").na.drop(subset=["startingAirport", "destinationAirport", "totalFare", "travelDuration", "flightdate"])

# Convert flightdate to a proper date format
itineraries_df = itineraries_df.withColumn("flightDate", to_date(col("flightdate"), "MM/dd/yyyy"))

# Generate a hypothetical "bookingDate" column as no bookingDate is present in your data (replace with actual if available)
itineraries_df = itineraries_df.withColumn("bookingDate", to_date(lit("01/04/2022"), "MM/dd/yyyy"))

# Calculate booking lead time (days between bookingDate and flightDate)
itineraries_df = itineraries_df.withColumn("bookingLeadTime", datediff(col("flightDate"), col("bookingDate")))

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

# 1. Analyze how prices vary with booking lead time
booking_lead_time_df = itineraries_df.groupBy("bookingLeadTime") \
    .agg(avg("totalFare").alias("avgFare"))

# Show the result of average fare by booking lead time
print("Average Fare by Booking Lead Time: ")
booking_lead_time_df.show(10, truncate=False)

# 2. Analyze fares by month
itineraries_df = itineraries_df.withColumn("month", month(col("flightDate")))

monthly_fares_df = itineraries_df.groupBy("month") \
    .agg(avg("totalFare").alias("avgFare"))

# Show the result of average fare by month
print("Average Fare by Month: ")
monthly_fares_df.show(12, truncate=False)

# 3. Analyze fares by day of the week
itineraries_df = itineraries_df.withColumn("dayOfWeek", dayofweek(col("flightDate")))

day_of_week_fares_df = itineraries_df.groupBy("dayOfWeek") \
    .agg(avg("totalFare").alias("avgFare"))

# Show the result of average fare by day of the week
print("Average Fare by Day of the Week: ")
day_of_week_fares_df.show(7, truncate=False)

# Enrich results with airport and country information
enriched_df = itineraries_df \
    .join(airports_df, itineraries_df.startingAirport == airports_df.airportCode, "left") \
    .join(countries_df, airports_df.countryCode == countries_df.countryCode, "left") \
    .select(
        "startingAirport",
        "destinationAirport",
        "flightDate",
        "totalFare",
        "bookingLeadTime",
        "month",
        "dayOfWeek",
        "airportName",
        "city",
        "countryName",
        "continent"
    )

#
# Display enriched results
print("Enriched Data with Airport and Country Info: ")
z.show(enriched_df)
