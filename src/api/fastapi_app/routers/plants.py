# This file contains the api routes for endpoints which get status information from the plant waterer.
from fastapi import APIRouter, HTTPException, Response, Form, File, UploadFile

from ..models.plants import BasicResponse, Plant, Plants, AddPlantRequest

from ..utils.db_conf import database_connection

from PIL import Image
import io
from psycopg2 import Binary, IntegrityError, OperationalError

router = APIRouter()

@router.post("/plants", response_model=Plant, status_code=201, tags=['Plants'])
async def add_plant(
    name: str = Form(...),
    description: str = Form(...),
    moisture_threshold: float = Form(...),
    image: UploadFile = File(None)
):
    # annoyingly due to FastAPI limitations, we can't use a Pydantic model to define the input when it is of type: form/multipart.
    # To maintain the validation, we use the fields from the request to immediately try to build the request model
    # if this fails, it will raise the ValidationError that FastAPI knows what to do with.
    plant = AddPlantRequest(
        name=name,
        description=description,
        moisture_threshold=moisture_threshold,
        image=image
    )

    allowed_types = {"image/jpeg", "image/png"}
    
    if plant.image:
        if plant.image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        image_file_bytes = await plant.image.read() # this should be a bytes array
        
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
            if plant.image:
                query = """
                INSERT INTO plants (name, description, moisture_threshold, image)
                VALUES (%(name)s, %(description)s, %(moisture_threshold)s, %(image)s);
                """

                values = {
                        'name':plant.name,
                        'description': plant.description,
                        'moisture_threshold': plant.moisture_threshold,
                        'image': Binary(thumbnail_bytes) # wrap binary in psycopg2 binary format to ensure comaptibilty with postgres
                    }
            else:
                query = """
                INSERT INTO plants (name, description, moisture_threshold)
                VALUES (%(name)s, %(description)s, %(moisture_threshold)s);
                """

                values = {
                        'name':plant.name,
                        'description': plant.description,
                        'moisture_threshold': plant.moisture_threshold
                    }

            try:
                curs.execute(query, values)
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

@router.get("/plants/{plant_name}", response_model=Plant, tags=['Plants'])
async def get_plant(plant_name: str):
    with database_connection() as conn:
        with conn.cursor() as curs:
            query = """
            SELECT name, description, moisture_threshold, image
            FROM plants
            WHERE name = %(name)s
            """
            curs.execute(query, {'name': plant_name})
            row = curs.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Plant not found")
            img_path = f"/plants/image/{plant_name}" if row[3] != None else None
            # Create a Plant object from the database row
            return Plant(        
                name=row[0],
                description=row[1],
                moisture_threshold=row[2],
                image = img_path
            )

@router.delete("/plants/{plant_name}", tags=['Plants'])
async def delete_plant(plant_name: str):
    with database_connection() as conn:
        with conn.cursor() as curs:
            query = """
            DELETE FROM plants
            WHERE name = %(name)s
            RETURNING name
            """
            curs.execute(query, {'name': plant_name})
            row = curs.fetchone()

            # if we don't return anything, then we didn't delete anything. this means that the plant wasn't in the db so we tell the consumer as much.
            if row is None:
                raise HTTPException(status_code=404, detail="Plant not found")            
            
            # if we reach this point we must have deleted the plant
            conn.commit()
            return BasicResponse(message=f"Plant {plant_name} successfully deleted")

@router.get("/plants", tags=['Plants'])
async def get_all_plants():
    # return a json object of a list of Plant models
    with database_connection() as conn:
        with conn.cursor() as curs:
            query = """
            SELECT * FROM plants;
            """
            curs.execute(query)
            rows = curs.fetchall()  # Fetch all rows
            
            #  construct plants list
            plants_list = []

            for row in rows:
                img_path = f'/plants/image/{row[0]}' if row[3]!= None else None
                plants_list.append(Plant(
                    name=row[0],
                    description=row[1],
                    moisture_threshold=row[2],
                    image=img_path
                ))    

            return Plants(plants=plants_list)
        
@router.get("/plants/images/{plantName}", tags=['Plants'])
def getPlantImage(plantName: str):
    # get plant image from database
    try:
        with database_connection() as conn:
            with conn.cursor() as curs:
                curs.execute(f"SELECT image FROM plants WHERE name = %s", (plantName,))
                row = curs.fetchone()
                # Check the query returned a row. If it didn't then a plant with this name doesn't exist.
                if row is None:
                    raise HTTPException(status_code=404, detail="Plant not found.")
                image_bytes = row[0]

                # have got response from db, but should check if this plant actually has an image stored in the db
                if image_bytes == None:
                    raise HTTPException(status_code=404, detail="No image available for this plant")
                
                # we've confirmed we have an image for this plant so we return it as a png file
                return Response(content=image_bytes, media_type="image/png")

    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Unable to access database.")