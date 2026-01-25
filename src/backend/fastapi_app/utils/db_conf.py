# this file consumes the requisite environment variables for the api to connect to the database
from sqlalchemy import URL
from sqlalchemy.engine import Engine
from sqlalchemy.exc import IntegrityError

from sqlmodel import SQLModel, create_engine, Session
from os import getenv


# generator for the postgres Engine object so we can just import it from here whenever we need it
def get_engine() -> Engine:
    db_type = getenv("DATABASE_TYPE", "sqlite")
    match db_type:
        case "postgresql":
            url_object = URL.create(
                drivername="postgresql",
                username = getenv("POSTGRES_USER", "postgres"),
                password = getenv("POSTGRES_PASSWORD", "postgres"),
                host = getenv("POSTGRES_HOST", "database"),
                port = int(getenv("POSTGRES_PORT", "5432")),
                database = getenv("DB_NAME", "postgres")
            )
            return create_engine(url_object, echo=True)
        case "sqlite":
            database_dir = getenv("DATABASE_LOCATION", "./")
            return create_engine(f"sqlite:///{database_dir}/plants.db")
        case _:
            raise ValueError("Please set the DATABASE_TYPE environment variable to a valid database type string.\nOptions are: 'postgresql' or 'sqlite'")
    
    
def get_session() -> Session:
    return Session(get_engine())

def setup_db() -> None:
    from ..models.plants import Plant
    from ..models.status import Status, SlotNumber
    from ..models.log import Log
    engine = get_engine()
    SQLModel.metadata.create_all(engine)

    # populate the three status rows for the slots. These will be only ever be updated once they're made; never deleted or inserted
    # iterating over the Enum like this means we can always add more slots just by changing the SlotNumber model. :)
    try:
        with Session(engine) as session:
            for slot in SlotNumber:
                session.add(Status(slot=slot))
            session.commit()
    except IntegrityError:
        # if we land here then we have already populated the database and we shouldn't nulliy the current rows so we'll return here
        return 