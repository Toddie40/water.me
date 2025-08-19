# utility to hold the functions to log requests to the database
from fastapi import Request
from pydantic import BaseModel, Json
from typing import Any
import os
import psycopg2
import datetime


# useful little pydantic model for defining the log entry
# Users of the log() function should import and pass an object of it to the log() function
class LogEntry(BaseModel):
    timestamp: datetime.datetime
    endpoint: str
    request_body: str  # json string
    response_status: int
    response_body: str # json string
    client_ip: str

def log(entry: LogEntry):
    db_host = 'database'
    db_user = os.environ.get('POSTGRES_USER', 'postgres')
    db_password = os.environ.get('POSTGRES_PASSWORD', 'postgres')
    db_name = os.environ.get('POSTGRES_DB', 'postgres')

    # generate sql query string
    query = f"""
    INSERT INTO log (timestamp, endpoint, request_body, response_status, response_body, client_ip)
    VALUES (%(timestamp)s, %(endpoint)s, %(request_body)s, %(response_status)s, %(response_body)s, %(client_ip)s);
    """

    # make db connection
    try:
        with psycopg2.connect(
            host=db_host,
            port=5432,
            dbname=db_name,
            user=db_user,
            password=db_password
        ) as conn:
            with conn.cursor() as curs:
                curs.execute(query, 
                            {
                                'timestamp':  entry.timestamp,
                                'endpoint': entry.endpoint,
                                'request_body': entry.request_body,
                                'response_status': entry.response_status,
                                'response_body': entry.response_body,
                                'client_ip': entry.client_ip
                            })
            conn.commit()
            
    except Exception as e:
        print(f"error occured making log entry: {e}")