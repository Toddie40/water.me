# This file contains the api routes for endpoints which get status information from the plant waterer.
from fastapi import APIRouter, HTTPException
from sqlmodel import select

from ..models.status import StatusResponse, StatusSlotResponse , Status, SlotNumber
from ..models.plants import BasicResponse, Plant, PlantName
from ..utils.db_conf import get_session

router = APIRouter(
    prefix="/status",
    tags=['Status']
)

def _generate_status_slot_response(status: Status, plant: Plant) -> StatusSlotResponse:
    return StatusSlotResponse(
        slot = status.slot,
        moisture = status.moisture,
        last_watered = status.last_watered,
        auto_water = status.auto_water,
        plant_name = status.plant_name if plant else None,
        description = plant.description if plant else None,
        moisture_threshold = plant.moisture_threshold if plant else None,
        image_link = f"/plants/images/{plant.name}" if  (plant and plant.image) else None
)


@router.get("", response_model=StatusResponse)
async def get_all_status():
    try:
        with get_session() as session:
            statement = select(Status, Plant).join(Plant, isouter=True)
            results = session.exec(statement)
            items = results.all()
            response = [   
                    _generate_status_slot_response(status, plant)
                for status, plant in items
            ]
            
            return StatusResponse(slots=response)
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Unable to access database. Error: {e}")        

@router.get("/{slot_number}", response_model = StatusSlotResponse)
def get_plant_status(slot_number: SlotNumber):
    try:
        with get_session() as session:
            statement = select(Status, Plant).where(Status.slot == slot_number).join(Plant, isouter=True)
            result = session.exec(statement)
            status, plant = result.one()
            return _generate_status_slot_response(status, plant)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Unable to access database. Error: {e}")        
            
@router.put("/{slot_number}/{plant_name}", status_code=201)
def set_slot(slot_number: SlotNumber, plant_name: PlantName):
    try:
     with get_session() as session:

            # quick sanity check to make sure the requested plant exists in the library
            statement = select(Plant.name).where(Plant.name == plant_name)
            if session.exec(statement).first() == None:
                raise HTTPException(status_code=404, detail=f"No plant in library with name: {plant_name}")

            # If we get here then we know the plant exists and we can crack on
            statement = select(Status).where(Status.slot == slot_number)
            results = session.exec(statement)
            status = results.one()
        
            status.plant_name = plant_name
        
            session.add(status)
            session.commit()
           
            return BasicResponse(message=f"Successfully added plant: {plant_name} to slot {slot_number}")   
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Database error: {e}") 
   
@router.delete("/{slot_number}")
def delete_slot(slot_number: SlotNumber):
    try:
        with get_session() as session:
            statement = select(Status).where(Status.slot == slot_number)
            results = session.exec(statement)
            status = results.one()

            if status.plant_name == None:
                raise HTTPException(status_code=404, detail=f"No plant found at slot {slot_number}")

            status.plant_name = None

            session.add(status)
            session.commit()
            return BasicResponse(message=f"Successfully cleared slot {slot_number}")   
    
    except Exception as e:
        # Check if the error is due to a duplicate plant name.
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Database error: {e}") 
                        
    