from pydantic import BaseModel, validator
from typing import List, Optional, Union, Annotated
from fastapi import UploadFile, Form, File

# Validator functions
def not_empty(cls, v):
        if not v.strip():
            raise ValueError(f'{cls} cannot be empty')
        return v


# Pydantic models

class Plant(BaseModel):
    name: str
    description: str
    moisture_threshold: float
    image: Optional[bytes] = None

    _check_name = validator('name', allow_reuse=True)(not_empty)
    
    # Will need to check for the image too, but that will happen in the function logic

class AddPlantRequest(BaseModel):
    name: Annotated[str, Form()]
    description: Annotated[str, Form()]
    moisture_threshold: Annotated[float, Form()]
    image: Optional[Annotated[UploadFile, File()]] = None

    _check_name = validator('name', allow_reuse=True)(not_empty)

class PlantUpdateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    moisture_threshold: Optional[float] = None
    image: Optional[bytes] = None

class Plants(BaseModel):
    plants: List[Plant]

class BasicResponse(BaseModel):
    message: str
