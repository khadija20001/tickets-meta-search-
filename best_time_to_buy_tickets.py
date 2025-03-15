#code about Best time to buy flight ticket
#code by salma-bendriss

# i started with setting up spark
#i import some functions to help me work with the data
from pyspark.sql.functions import col, to_date, datediff, avg, trim, regexp_replace, lit, month, dayofweek
from pyspark.sql import SparkSession

# i create a Spark session, which is like starting the engine of Spark so we can use it.
spark = SparkSession.builder.appName("FlightDataAnalysis").getOrCreate()

# i set a configuration to make sure Spark can read dates correctly.
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")


# Step 1: Load & Clean Flight Data
# iam taking the flight data and cleaning it up by removing unnecessary or incorrect information
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


#Fixing Dates and Calculating Booking Lead Time
# i Convert flightdate to a proper date format (MM/dd/yyyy).
itineraries_df = itineraries_df.withColumn("flightDate", to_date(col("flightdate"), "MM/dd/yyyy"))

# i create new column bookingDate (30 days before flightDate)
itineraries_df = itineraries_df.withColumn("bookingDate", F.date_sub(col("flightDate"), 30))

# i Calculate booking lead time (days between bookingDate and flightDate)
itineraries_df = itineraries_df.withColumn("bookingLeadTime", datediff(col("flightDate"), col("bookingDate")))


# Step 2: Clean airport data
# i load airport data from a table called airports $ select colums
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


# Step 3: Clean country data
#i load country data from a table called countries & select columns
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
    .groupBy("bookingLeadTime")#grp the flight data by how early tickets are booked
    .agg(avg("totalFare").alias("avgFare")) #calculate the average fare for each group.
    .orderBy("bookingLeadTime")  # Sort by booking lead time
)
#display the result of analysis average fares by booking lead time
print("Average Fare by Booking Lead Time:")
booking_lead_time_df.show(10, truncate=False)


# 2.  Average Fare by month
#finding out how ticket prices change based on the month of the flight.
itineraries_df = itineraries_df.withColumn("month", month(col("flightDate")))

monthly_fares_df = (
    itineraries_df
    .groupBy("month")# add a month column to the flight data.
    .agg(avg("totalFare").alias("avgFare"))
    .orderBy("month")  # Sort the result by month
)
#display the result of analysis average fares by month
print("Average Fare by Month:")
monthly_fares_df.show(12, truncate=False)


# 3.  Average Fare by day of the week
#grp the data by dayOfWeek and calculate the average fare for each day of the week.
itineraries_df = itineraries_df.withColumn("dayOfWeek", dayofweek(col("flightDate")))

day_of_week_fares_df = (
    itineraries_df
    .groupBy("dayOfWeek") #grp
    .agg(avg("totalFare").alias("avgFare"))
    .orderBy("dayOfWeek")  # Sort by day of the week
)
# display the result of analysis average fares by day of the week.
print("Average Fare by Day of the Week:")
day_of_week_fares_df.show(7, truncate=False)

# Step 5: Enrich results with airport and country information
# i am adding more details to the flight data, like the names of airports and countries, to make it more informative.
#combine the flight data with the cleaned airport and country data & add details

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

# i free up memory by removing cached data.
#i clean the workspace to make sure everything runs smoothly.
itineraries_df.unpersist()
airports_df.unpersist()
countries_df.unpersist()