import pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.functions import min
# Initialize Spark session
spark = SparkSession.builder \
    .appName("WhereToFly") \
    .getOrCreate()
# Load airports data
airports_df = spark.read.csv("/flight_data/airports", header=True, inferSchema=True)
# Load itineraries data
itineraries_df = spark.read.csv("/flight_data/itineraries", header=True, inferSchema=True)
# Load countries data
countries_df = spark.read.csv("/flight_data/countries", header=True, inferSchema=True)

# Extract city information from airports data
cities_df = airports_df.select(
    col("municipality").alias("city_name"),
    col("iata_code").alias("city_code"),
    col("latitude_deg").alias("latitude"),
    col("longitude_deg").alias("longitude"),
    col("iso_country").alias("country_code")
).distinct()
itineraries_df = itineraries_df.select(
    col("startingAirport").alias("departure_airport"),
    col("destinationAirport").alias("arrival_airport"),
    col("totalFare").alias("price"),
    col("travelDuration").alias("duration"),
    col("segmentsDepartureTimeRaw").alias("departure_time"),
    col("segmentsArrivalTimeRaw").alias("arrival_time")
)