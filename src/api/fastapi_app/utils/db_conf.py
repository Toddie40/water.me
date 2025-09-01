# this file consumes the requisite environment variables for the api to connect to the database
from sqlalchemy import URL
from sqlalchemy.engine import Engine

from sqlmodel import SQLModel, create_engine, Session
from os import getenv


# generator for the postgres Engine object so we can just import it from here whenever we need it
def get_engine() -> Engine:
    url_object = URL.create(
        drivername="postgresql",
        username = getenv("POSTGRES_USER", "postgres"),
        password = getenv("POSTGRES_PASSWORD", "postgres"),
        host = getenv("POSTGRES_HOST", "database"),
        port = int(getenv("POSTGRES_PORT", "5432")),
        database = getenv("POSTGRES_DB", "postgres")
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


