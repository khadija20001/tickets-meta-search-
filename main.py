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