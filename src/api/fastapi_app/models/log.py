from pydantic import BaseModel
from typing import List
from datetime import datetime

class LogItem(BaseModel):
    id:int
    timestamp: datetime
    endpoint: str
    method: str
    query_params: str
    request_body: str
    response_status: int
    client_ip: str

class Log(BaseModel):
    items: List[LogItem]
    total: int