from pydantic import BaseModel, AfterValidator
from typing import Annotated, List
from datetime import datetime

from .plants import PlantName # validated type for plant names
from .validators import check_slot

SlotNumber = Annotated[int, AfterValidator(check_slot)]

class AddSlotRequest(BaseModel):
    slot_number: SlotNumber
    plant_name: PlantName

class StatusItem(BaseModel):
    slot: int
    image: str
    name: str
    description: str
    moisture : float
    threshold : float
    lastWatered : datetime
    autoWater : bool

class StatusList(BaseModel):
    result: List[StatusItem]
