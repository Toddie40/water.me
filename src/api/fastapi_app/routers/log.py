from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
from ..utils.db_conf import database_connection

class LogItem(BaseModel):
    id:int
    timestamp: datetime
    endpoint: str
    method: str
    request_body: str
    response_status: int
    client_ip: str

class Log(BaseModel):
    items: List[LogItem]
    total: int


router = APIRouter()

@router.get("/log", response_model=Log)
def get_logs(lines_per_page: int, page_no: int):

    # return the latest logs according to the line per page and the current page no
    # logs are returned in reverse chronological order for the time being. 
    query = f"""
    SELECT id, timestamp, endpoint, method, request_body, response_status, client_ip
    FROM log
    ORDER BY timestamp DESC
    LIMIT {lines_per_page}
    OFFSET {page_no - 1} * {lines_per_page};
    """

    try:
        with database_connection() as conn:
            with conn.cursor() as curs:
                curs.execute(query)
                rows = curs.fetchall()
                # creat reponse object
                log_items = [LogItem(
                    id = row[0],
                    timestamp = row[1],
                    endpoint = row[2],
                    method = row[3],
                    request_body = row[4],
                    response_status = row[5],
                    client_ip = row[6]
                ) for row in rows]

                # get total log count to send with response for pagination
                curs.execute("SELECT COUNT(*) FROM log;")
                count_row = curs.fetchone()[0]  # fetchone since only one row expected
                count = int(count_row) if count_row else 0

                return Log(items = log_items, total = count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to access logs. Error: {e}")