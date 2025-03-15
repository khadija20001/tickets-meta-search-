from pyspark.sql.functions import col, to_date, datediff, avg, trim, regexp_replace, lit, month, dayofweek
from pyspark.sql import SparkSession

# Initialize Spark session
spark = SparkSession.builder.appName("FlightDataAnalysis").getOrCreate()

# Ensure backward compatibility for date parsing
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")

# Step 1: Load and preprocess the itineraries dataset
itineraries_df = (
    spark.sql("""
        SELECT
            startingAirport,
            destinationAirport,
            totalFare,
            travelDuration,
            flightdate
        FROM fitineraries
        WHERE legid != 'legId'  -- Exclude invalid leg IDs
    """)
    .na.drop(subset=["startingAirport", "destinationAirport", "totalFare", "travelDuration", "flightdate"])  # Drop rows with missing critical data
)

# Convert flightdate to a proper date format
itineraries_df = itineraries_df.withColumn("flightDate", to_date(col("flightdate"), "MM/dd/yyyy"))

# Dynamically calculate bookingDate (e.g., 30 days before flightDate)
itineraries_df = itineraries_df.withColumn("bookingDate", F.date_sub(col("flightDate"), 30))

# Calculate booking lead time (days between bookingDate and flightDate)
itineraries_df = itineraries_df.withColumn("bookingLeadTime", datediff(col("flightDate"), col("bookingDate")))

# Step 2: Clean airport data
airports_df = (
    spark.sql("""
        SELECT
            COALESCE(iata_code, ident) AS airportCode,
            name AS airportName,
            municipality AS city,
            iso_country AS countryCode,
            latitude_deg AS latitude,
            longitude_deg AS longitude
        FROM airports
    """)
    .withColumn("airportCode", trim(regexp_replace(col("airportCode"), '"', '')))  # Clean airport codes
    .withColumn("countryCode", trim(regexp_replace(col("countryCode"), '"', '')))  # Clean country codes
)

# Step 3: Clean country metadata
countries_df = (
    spark.sql("""
        SELECT
            TRIM(REGEXP_REPLACE(code, '"', '')) AS countryCode,
            TRIM(REGEXP_REPLACE(name, '"', '')) AS countryName,
            TRIM(REGEXP_REPLACE(continent, '"', '')) AS continent
        FROM countries
    """)
)

# Cache frequently used DataFrames for performance
itineraries_df.cache()
airports_df.cache()
countries_df.cache()

# Step 4: Analyze and calculate trends
# 1. How prices vary with booking lead time
booking_lead_time_df = (
    itineraries_df
    .groupBy("bookingLeadTime")
    .agg(avg("totalFare").alias("avgFare"))
    .orderBy("bookingLeadTime")  # Sort by booking lead time
)

print("Average Fare by Booking Lead Time:")
booking_lead_time_df.show(10, truncate=False)

# 2. Fares by month
itineraries_df = itineraries_df.withColumn("month", month(col("flightDate")))

monthly_fares_df = (
    itineraries_df
    .groupBy("month")
    .agg(avg("totalFare").alias("avgFare"))
    .orderBy("month")  # Sort by month
)

print("Average Fare by Month:")
monthly_fares_df.show(12, truncate=False)

# 3. Fares by day of the week
itineraries_df = itineraries_df.withColumn("dayOfWeek", dayofweek(col("flightDate")))

day_of_week_fares_df = (
    itineraries_df
    .groupBy("dayOfWeek")
    .agg(avg("totalFare").alias("avgFare"))
    .orderBy("dayOfWeek")  # Sort by day of the week
)

print("Average Fare by Day of the Week:")
day_of_week_fares_df.show(7, truncate=False)

# Step 5: Enrich results with airport and country information
enriched_df = (
    itineraries_df
    .join(airports_df, itineraries_df.startingAirport == airports_df.airportCode, "left")
    .join(countries_df, airports_df.countryCode == countries_df.countryCode, "left")
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
)

# Show enriched results
print("Enriched Data with Airport and Country Info:")
enriched_df.show(20, truncate=False)
z.show(enriched_df)

# Unpersist cached DataFrames to free up memory
itineraries_df.unpersist()
airports_df.unpersist()
countries_df.unpersist()