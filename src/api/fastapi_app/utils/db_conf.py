# this file consumes the requisite environment variables for the api to connect to the database
from sqlalchemy import URL
from sqlalchemy.engine import Engine

from sqlmodel import SQLModel, create_engine, Session
from os import getenv

POSTGRES_USER = getenv("POSTGRES_USER", "postgres") # get the postgres user and fallback to 'postgres'
POSTGRES_PASSWORD = getenv("POSTGRES_PASSWORD", "postgres") # get the postgres password. Fallback to 'postgres'. 
POSTGRES_DB = getenv("POSTGRES_DB", "postgres") # liek the above. We fallback to 'postgres'
POSTGRES_HOST = getenv("POSTGRES_HOST", "database")
POSTGRES_PORT = int(getenv("POSTGRES_PORT", "5432"))


# generator for the postgres connection object so we can just import it from here whenever we need it

def get_engine() -> Engine:
    url_object = URL.create(
        drivername="postgresql",
        username = POSTGRES_USER,
        password = POSTGRES_PASSWORD,
        host = POSTGRES_HOST,
        port = POSTGRES_PORT,
        database = POSTGRES_DB
    )
    return create_engine(url_object, echo=True)
    
def get_session() -> Session:
    return Session(get_engine())

def setup_db() -> None:
    from ..models.plants import Plant
    from ..models.status import Status
    from ..models.log import Log
    engine = get_engine()
    SQLModel.metadata.create_all(engine)


