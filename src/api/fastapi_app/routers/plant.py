# This file contains the api routes for endpoints which get status information from the plant waterer.
from fastapi import APIRouter, Request, Form, UploadFile, File, HTTPException

from typing import Annotated
from pydantic import BaseModel

from ..utils.db_conf import database_connection
from PIL import Image
import io
from psycopg2 import Binary, IntegrityError
from psycopg2.errors import UniqueViolation

router = APIRouter()

class Plant(BaseModel):
    name: str
    description: str
    moisture_threshold: float
    # Will need to check for the image too, but that will happen in the function logic

@router.post("/plant/add", response_model=Plant)
async def add_plant(
    name: Annotated[str, Form()],
    description: Annotated[str, Form()],
    moisture_threshold: Annotated[float, Form()],
    image: Annotated[UploadFile, File()],
    request: Request
):
    plant = Plant(name=name, description=description, moisture_threshold=moisture_threshold)

    # first parse the file object
    allowed_types = {"image/jpeg", "image/png"}
    if image.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    image_file_bytes = await image.read() # this should be a bytes array
    
    try:
        img = Image.open(io.BytesIO(image_file_bytes))
        img.thumbnail((128,128)) # resize image in place (dont need to save the raw image)
        
        # Bytes buffer to save to
        buf = io.BytesIO()
        # Save the image in PNG format into the buffer
        img.save(buf, format="PNG")
        thumbnail_bytes = buf.getvalue()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to parse image object. Error: {e}")

    # if we get this far then we should have a working Image object to save.
    with database_connection() as conn:
        with conn.cursor() as curs:
             # first check the for duplicates. each plant in the library must have a unique name
            curs.execute("SELECT name FROM plants WHERE name = %(name)s;", {'name': plant.name})
            if curs.fetchone() is not None:
                conn.rollback()
                raise HTTPException(status_code=409, detail="Plant with that name already exists")

            # database sql command:
            query = """
            INSERT INTO plants (name, description, moisture_threshold, image)
            VALUES (%(name)s, %(description)s, %(moisture_threshold)s, %(image)s);
            """
            try:
                curs.execute(query, {
                    'name':plant.name,
                    'description': plant.description,
                    'moisture_threshold': plant.moisture_threshold,
                    'image': Binary(thumbnail_bytes) # wrap binary in psycopg2 binary format to ensure comaptibilty with postgres
                })
                conn.commit()
            except IntegrityError as e:
                # Check if the error is due to a duplicate plant name.
                conn.rollback()
                if e.pgcode == '23505': 
                    raise HTTPException(status_code=409, detail="Plant with that name already exists")
                else:                
                    raise HTTPException(status_code=500, detail="Database error")                


    # Construct and return the PlantOut object with the generated id
    return Plant(name=plant.name, description=plant.description, moisture_threshold=plant.moisture_threshold)

    


@router.get("/plant/{plant_id}", response_model=Plant)
async def get_plant(plant_id: int, request: Request):
    with database_connection() as conn:
        with conn.cursor() as curs:
            query = """
            SELECT name, description, moisture_threshold
            FROM plants
            WHERE id = %(id)s
            """
            curs.execute(query, {'id': plant_id})
            row = curs.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Plant not found")
            # Create a Plant object from the database row
            return Plant(        
                name=row[0],
                description=row[1],
                moisture_threshold=row[2]
            )