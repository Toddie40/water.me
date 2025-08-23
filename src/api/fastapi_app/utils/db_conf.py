# this file consumes the requisite environment variables for the api to connect to the database

from os import getenv

POSTGRES_USER = getenv("POSTGRES_USER", "postgres") # get the postgres user and fallback to 'postgres'
POSTGRES_PASSWORD = getenv("POSTGRES_PASSWORD", "postgres") # get the postgres password. Fallback to 'postgres'. 
POSTGRES_DB = getenv("POSTGRES_DB", "postgres") # liek the above. We fallback to 'postgres'
POSTGRES_HOST = getenv("POSTGRES_HOST", "database")
POSTGRES_PORT = int(getenv("POSTGRES_PORT", "5432"))

from psycopg2 import connect
from psycopg2.extensions import connection

# generator for the postgres connection object so we can just import it from here whenever we need it

def database_connection() -> connection:
    return connect(
        dbname = POSTGRES_DB,
        user = POSTGRES_USER,
        password = POSTGRES_PASSWORD,
        host = POSTGRES_HOST,
        port = POSTGRES_PORT
    )
