from pydantic import BaseModel, AfterValidator
from sqlmodel import SQLModel, Field, Relationship
from typing import Annotated, List
from enum import IntEnum
from datetime import datetime

from .plants import Plant, PlantName # validated type for plant names


class SlotNumber(IntEnum):
    one = 1
    two = 2
    three = 3


class Status(SQLModel, table=True):
    slot: SlotNumber = Field(default=None, primary_key=True)
    moisture : float | None
    last_watered : datetime | None
    auto_water : bool | None
    plant_name: PlantName | None = Field(default=None, foreign_key="plant.name")
    plant: Plant | None = Relationship()
    

class StatusSlotResponse(BaseModel):
    slot: SlotNumber
    moisture: float | None
    last_watered: datetime | None
    auto_water : bool | None
    plant_name: PlantName | None
    description: str | None
    moisture_threshold: float | None
    image_link: str | None

class StatusResponse(BaseModel):
    slots: List[StatusSlotResponse]