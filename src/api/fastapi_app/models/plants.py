from pydantic import BaseModel, AfterValidator
from sqlmodel import SQLModel, Field
from typing import List, Optional, Union, Annotated
from fastapi import UploadFile, Form, File
from .validators import not_empty

PlantName = Annotated[str, AfterValidator(not_empty)]

class Plant(SQLModel, table=True):
    name: PlantName = Field(default=None, primary_key=True)
    description: str
    moisture_threshold: float
    image: bytes | None = Field(default=None)

# Response to return plant objects from the DB.
class PlantResponse(BaseModel):
    name: PlantName
    description: str
    moisture_threshold: float
    image: str | None # API path for the image for this plant

class AddPlantRequest(BaseModel):
    name: Annotated[PlantName, Form()]
    description: Annotated[str, Form()]
    moisture_threshold: Annotated[float, Form()]
    image: Optional[Annotated[UploadFile, File()]] = None

class PlantUpdateRequest(BaseModel):
    name: Optional[Annotated[PlantName, Form()]] = None
    description: Optional[Annotated[str, Form()]] = None
    moisture_threshold: Optional[Annotated[float, Form()]] = None
    image: Optional[Annotated[UploadFile, File()]] = None

class Plants(BaseModel):
    plants: List[PlantResponse]

class BasicResponse(BaseModel):
    message: str

def create_plant_response(plant: Plant) -> PlantResponse:
    return PlantResponse(
        name = plant.name,
        description = plant.description,
        moisture_threshold = plant.moisture_threshold,
        image = f"/plants/images/{plant.name}" if plant.image else None
    )