# utility to hold the functions to log requests to the database
from pydantic import BaseModel
from .utils.db_conf import database_connection
import datetime


# useful little pydantic model for defining the log entry
# Users of the log() function should import and pass an object of it to the log() function
class LogEntry(BaseModel):
    timestamp: datetime.datetime
    endpoint: str
    method: str
    request_body: str  # json string
    response_status: int
    response_body: str # json string
    client_ip: str

def log(entry: LogEntry):
    # generate sql query string
    query = f"""
    INSERT INTO log (timestamp, endpoint, method, request_body, response_status, response_body, client_ip)
    VALUES (%(timestamp)s, %(endpoint)s, %(method)s, %(request_body)s, %(response_status)s, %(response_body)s, %(client_ip)s);
    """

    # make db connection
    try:
        with database_connection() as conn:
            with conn.cursor() as curs:
                curs.execute(query, 
                            {
                                'timestamp':  entry.timestamp,
                                'endpoint': entry.endpoint,
                                'method' : entry.method,
                                'request_body': entry.request_body,
                                'response_status': entry.response_status,
                                'response_body': entry.response_body,
                                'client_ip': entry.client_ip
                            })
            conn.commit()
            
    except Exception as e:
        print(f"error occured making log entry: {e}")