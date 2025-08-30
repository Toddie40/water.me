from pydantic import BaseModel, AfterValidator
from typing import List, Optional, Union, Annotated
from fastapi import UploadFile, Form, File
from .validators import not_empty

PlantName = Annotated[str, AfterValidator(not_empty)]

class Plant(BaseModel):
    name: PlantName
    description: str
    moisture_threshold: float
    image: Optional[bytes] = None

class AddPlantRequest(BaseModel):
    name: Annotated[PlantName, Form()]
    description: Annotated[str, Form()]
    moisture_threshold: Annotated[float, Form()]
    image: Optional[Annotated[UploadFile, File()]] = None

class PlantUpdateRequest(BaseModel):
    name: PlantName
    description: Optional[str] = None
    moisture_threshold: Optional[float] = None
    image: Optional[bytes] = None

class Plants(BaseModel):
    plants: List[Plant]

class BasicResponse(BaseModel):
    message: str
