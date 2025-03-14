%pyspark
from pyspark.sql.functions import col, to_date, month, dayofweek, min, trim, regexp_replace, udf
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


convert_duration_udf = udf(conv_dur_min, IntegerType())
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")
# Use the flight_analysis database
spark.sql("USE flight_analysis")


# Function to analyze most cost-effective departure times
def when_to_fly(departure_airport, max_travel_time):
    """
    Analyzes feasible flight itineraries based on departure times
    and enriches results with airport and country information.
    """
    #  Load and preprocess datasets
    # Load itineraries dataset
    itineraries_df = spark.sql(
        "SELECT startingAirport, destinationAirport, totalFare, travelDuration, flightdate FROM fitineraries WHERE legid != 'legId'"
    ).na.drop(subset=["startingAirport", "destinationAirport", "totalFare", "travelDuration", "flightdate"])

    # Load additional datasets: airports and countries
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
            TRIM(REGEXP_REPLACE(code, '"', '')) AS countryCode,  
            TRIM(REGEXP_REPLACE(name, '"', '')) AS countryName,  
            TRIM(REGEXP_REPLACE(continent, '"', '')) AS continent  
        FROM countries  
    """).withColumn("countryCode", trim(regexp_replace("countryCode", '"', '')))

    # SEnrich the itineraries dataset
    enriched_df = itineraries_df \
        .withColumn("travelDurationInMinutes", convert_duration_udf(col("travelDuration"))) \
        .filter(col("startingAirport") == departure_airport) \
        .filter(col("travelDurationInMinutes") <= max_travel_time)

    # Join with airports data
    enriched_df = enriched_df \
        .join(airports_df, enriched_df.destinationAirport == airports_df.airportCode, "left") \
        .join(countries_df, airports_df.countryCode == countries_df.countryCode, "left") \
        .select(
        enriched_df["*"],
        airports_df["airportName"],
        airports_df["city"],
        countries_df["countryName"],
        countries_df["continent"]
    )

    #  Extract date information (month and day of the week)
    # Use flightdate instead of departureDate
    enriched_df = enriched_df \
        .withColumn("flightDateFormatted", to_date(col("flightdate"), "MM/dd/yyyy")) \
        .withColumn("month", month(col("flightDateFormatted"))) \
        .withColumn("dayOfWeek", dayofweek(col("flightDateFormatted")))

    #  Group by destination, day of the week, and month
    # Find the lowest fare for each destination by day of the week and month
    grouped_df = enriched_df.groupBy("destinationAirport", "dayOfWeek", "month").agg(
        min("totalFare").alias("lowestFare")
    )

    # Enrich aggregated results with airport and country information
    result_df = grouped_df \
        .join(airports_df, grouped_df.destinationAirport == airports_df.airportCode, "left") \
        .join(countries_df, airports_df.countryCode == countries_df.countryCode, "left") \
        .select(
        grouped_df["destinationAirport"],
        "lowestFare",
        "airportName",
        "dayOfWeek",
        "month",
        "city",
        "countryName",
        "continent"
    )
    # itineraries_df.select("flightdate").distinct().show(50, truncate=False)
    # Display the results in Zeppelin or as a PySpark DataFrame
    z.show(result_df)  # For Zeppelin; replace with result_df.show() if not using Zeppelin


# Example Usage
departure_airport = "ATL"  # Example: Atlanta
max_travel_time = 240  # Example: 4 hours (240 minutes)
when_to_fly(departure_airport, max_travel_time)