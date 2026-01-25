from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from typing import List
from datetime import datetime

class Log(SQLModel, table=True):
    id:int = Field(primary_key=True)
    timestamp: datetime
    endpoint: str
    method: str
    query_params: str
    request_body: str
    response_status: int
    client_ip: str

class LogResponse(BaseModel):
    items: List[Log]
    total: int