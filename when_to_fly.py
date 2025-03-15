%pyspark
from pyspark.sql.functions import col, to_date, month, dayofweek, min, trim, regexp_replace, udf
from pyspark.sql.types import IntegerType
import re


# Custom function to parse flight duration from ISO format
def parse_travel_duration_to_minutes(iso_duration):
    """Converts PT1H30M format to total minutes"""
    time_components = re.findall(r'\d+', iso_duration)
    if time_components:
        hours = int(time_components[0])
        minutes = int(time_components[1]) if len(time_components) > 1 else 0
        return hours * 60 + minutes
    return 0  # Default for invalid formats


# Register our custom duration converter
travel_time_converter = udf(parse_travel_duration_to_minutes, IntegerType())

# Configure Spark for legacy date parsing
spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")
spark.sql("USE flight_analysis")  # Working with our flight database


def find_cheapest_flight_times(home_airport_code, max_flight_duration):
    """
    Identifies budget-friendly flight times from a departure airport within a maximum duration.
    Returns enriched data with destination details and pricing trends.

    Parameters:
    home_airport_code (str): IATA code for departure airport (e.g., 'JFK')
    max_flight_duration (int): Maximum allowed travel time in minutes
    """
    # First, we pull the flight itineraries and clean up any missing data
    raw_flight_data = spark.sql("""
        SELECT startingAirport, destinationAirport, 
               totalFare, travelDuration, flightdate 
        FROM fitineraries 
        WHERE legid != 'legId'  -- Filtering out invalid entries
    """).na.drop(subset=["startingAirport", "destinationAirport",
                         "totalFare", "travelDuration", "flightdate"])

    # Airport reference data setup
    airport_reference = spark.sql("""
        SELECT 
            COALESCE(iata_code, ident) AS airport_code,
            name AS airport_name,
            municipality AS city,
            iso_country AS country_code,
            latitude_deg AS latitude,
            longitude_deg AS longitude
        FROM airports
    """).withColumn("airport_code", trim(regexp_replace("airport_code", '"', ''))) \
        .withColumn("country_code", trim(regexp_replace("country_code", '"', '')))

    # Country reference data setup
    country_reference = spark.sql("""
        SELECT 
            TRIM(REGEXP_REPLACE(code, '"', '')) AS country_code,
            TRIM(REGEXP_REPLACE(name, '"', '')) AS country_name,
            TRIM(REGEXP_REPLACE(continent, '"', '')) AS continent
        FROM countries
    """).withColumn("country_code", trim(regexp_replace("country_code", '"', '')))

    # Enhance our flight data with calculated fields
    processed_flights = raw_flight_data \
        .withColumn("flight_duration_mins", travel_time_converter(col("travelDuration"))) \
        .filter(col("startingAirport") == home_airport_code) \
        .filter(col("flight_duration_mins") <= max_flight_duration) \
        .withColumn("flight_date", to_date(col("flightdate"), "MM/dd/yyyy")) \
        .withColumn("departure_month", month(col("flight_date"))) \
        .withColumn("departure_weekday", dayofweek(col("flight_date")))

    # Combine with location information
    flights_with_locations = processed_flights \
        .join(airport_reference,
              processed_flights.destinationAirport == airport_reference.airport_code,
              "left") \
        .join(country_reference,
              airport_reference.country_code == country_reference.country_code,
              "left") \
        .select(
        processed_flights["*"],
        airport_reference.airport_name,
        airport_reference.city,
        country_reference.country_name,
        country_reference.continent
    )

    # Find best prices by time patterns
    price_analysis = flights_with_locations.groupBy(
        "destinationAirport", "departure_weekday", "departure_month"
    ).agg(min("totalFare").alias("minimum_fare"))

    # Final enriched results
    travel_recommendations = price_analysis \
        .join(airport_reference,
              price_analysis.destinationAirport == airport_reference.airport_code,
              "left") \
        .join(country_reference,
              airport_reference.country_code == country_reference.country_code,
              "left") \
        .select(
        "destinationAirport",
        "minimum_fare",
        "airport_name",
        "departure_weekday",
        "departure_month",
        "city",
        "country_name",
        "continent"
    )

    # Show results in our notebook environment
    z.show(travel_recommendations)


# Try it out for Atlanta flights under 4 hours
find_cheapest_flight_times(
    home_airport_code="ATL",
    max_flight_duration=240
)