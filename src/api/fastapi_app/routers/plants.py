# This file contains the api routes for endpoints which get status information from the plant waterer.
from fastapi import APIRouter, HTTPException, Response, Form, File, UploadFile
from typing import Optional, Union
from PIL import Image
import io
from sqlalchemy.exc import OperationalError, IntegrityError
from sqlmodel import select

from ..models.plants import BasicResponse, Plant, Plants, AddPlantRequest, PlantUpdateRequest, PlantResponse, create_plant_response
from ..utils.db_conf import get_session


async def _process_image(image: Union[bytes, None]) -> Union[bytes, None]:
    if not image:
        return None
    
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
        return thumbnail_bytes
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to parse image object. Error: {e}")

router = APIRouter(
    prefix="/plants",
    tags=['Plants']
)

@router.post("", response_model=PlantResponse, status_code=201)
async def add_plant(
    name: str = Form(...),
    description: str = Form(...),
    moisture_threshold: float = Form(...),
    image: Optional[UploadFile] = File(None)
):
    # annoyingly due to FastAPI limitations, we can't use a Pydantic model to define the input when it is of type: form/multipart.
    # To maintain the validation, we use the fields from the request to immediately try to build the request model
    # if this fails, it will raise the ValidationError that FastAPI knows what to do with.
    AddPlantRequest(name=name, description=description, moisture_threshold=moisture_threshold, image=image)
    
    thumbnail_bytes = await _process_image(image)

    try:
        plant = Plant(
            name=name,
            description=description,
            moisture_threshold=moisture_threshold,
            image=thumbnail_bytes
        ) 
        with get_session() as session:       
            session.add(plant)
            session.commit()
            session.refresh(plant)

        print("Added plant: ", plant)
        return create_plant_response(plant)

    except IntegrityError as e:
        # Check if the error is due to a duplicate plant name.
        session.rollback()
        if e.pgcode == '23505': 
            raise HTTPException(status_code=409, detail="Plant with that name already exists")
        else:                
            raise HTTPException(status_code=500, detail="Database error")                

@router.get("/{plant_name}", response_model=PlantResponse)
async def get_plant(plant_name: str):
    with get_session() as session:
        statement = select(Plant).where(Plant.name == plant_name)
        results = session.exec(statement)
        plant = results.first()
        return create_plant_response(plant)

@router.put("/{plant_name}", response_model=PlantResponse)
async def update_plant(
    plant_name: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    moisture_threshold: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    new_plant = PlantUpdateRequest(name=name, description=description, moisture_threshold=moisture_threshold, image=image)
    try:
        with get_session() as session:
            statement = select(Plant).where(Plant.name == plant_name)
            results = session.exec(statement)
            plant_to_edit = results.first()
            if plant_to_edit == None:
                raise HTTPException(status_code=404, detail=f"Unable to find plant: {plant_name} in the database")
            
            # loop over all the properties provided in the update request body and add make those changes on the row.
            for property_name, property_value in new_plant.dict().items():
                if property_value is not None:
                    if property_name == 'image':
                        # Need to process the image if there is one present.
                        property_value = await _process_image(property_value)
                    
                    setattr(plant_to_edit, property_name, property_value) 

            session.add(plant_to_edit)
            session.commit()
            session.refresh(plant_to_edit)
            return create_plant_response(plant_to_edit)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error connecting to database: {e}")
        raise HTTPException(status_code=500, detail="Unable to reach databse. Maybe it's dead?")
    
@router.delete("/{plant_name}")
async def delete_plant(plant_name: str):
    try:
        with get_session() as session:
            statement = select(Plant).where(Plant.name == plant_name)
            results = session.exec(statement)
            plant = results.first()
            
            if plant is None:
                raise HTTPException(status_code=404, detail="Plant not found")            
            
            print("Deleting from database plant: ", plant)
            session.delete(plant)  
            session.commit() 
            
            return BasicResponse(message=f"Plant {plant_name} successfully deleted")
    except Exception as e:
        print(f"Error occured connecting to database: {e}")
        raise HTTPException(status_code=500, detail="Database error occured. Maybe the database is down?")



@router.get("")
async def get_all_plants():
    # return a json object of a list of Plant models
    try:
        with get_session() as session:
            statement = select(Plant)
            results = session.exec(statement)
            plants_list = [
                create_plant_response(plant) for plant in results
            ]
            return Plants(plants=plants_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occured accessing database: {e}")
    
@router.get("/images/{plant_name}")
def getPlantImage(plant_name: str):
    # get plant image from database
    try:
        with get_session() as session:
            statement = select(Plant).where(Plant.name == plant_name)
            results = session.exec(statement)
            plant = results.first()
            if plant == None:
                raise HTTPException(status_code=404, detail="Plant not found.")

            # load the image butes. Could be 'None' if the plant doesn't have an image so we should raise a 404 error in this case.
            image_bytes = plant.image    
            if image_bytes == None:
                raise HTTPException(status_code=404, detail="No image available for this plant")
        
            # we've confirmed we have an image for this plant so we return it as a png file
            return Response(content=image_bytes, media_type="image/png")

    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Unable to access database.")