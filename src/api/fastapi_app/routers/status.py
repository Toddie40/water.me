# This file contains the api routes for endpoints which get status information from the plant waterer.
from fastapi import APIRouter, Request, HTTPException
from ..models.status import AddSlotRequest, StatusList, StatusItem
from ..models.plants import BasicResponse
from ..utils.db_conf import database_connection

router = APIRouter()

@router.get("/status", response_model=StatusList, tags=['Status'])
async def get_all_status():
    try:
        with database_connection() as conn:
            with conn.cursor() as curs:
                slot_query = """
SELECT 
    watering_slots.slot_id, 
    watering_slots.plant_name, 
    watering_slots.last_watered, 
    watering_slots.moisture_level, 
    watering_slots.auto_water, 
    plants.description, 
    plants.moisture_threshold
FROM watering_slots
LEFT JOIN plants ON watering_slots.plant_name = plants.name;
"""             
                curs.execute(slot_query)
                slots_information = curs.fetchall()
                results_list = [StatusItem(
                    slot=slot[0],
                    name=slot[1],
                    lastWatered=slot[2],
                    moisture=slot[3],
                    autoWater=slot[4],
                    description=slot[5],
                    threshold=slot[6],
                    image=f'/plants/images/{slot[1]}') 
                for slot in slots_information ]

                return StatusList(result=results_list)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to access database. Error:{e}")        

@router.get("/status/{slot_number}", tags=['Status'])
def get_plant_status(slot_number: int):
    return {
        "status": "success",
        "message": f"Retrieved status for plant: {slot_number}",
        "plant_index": slot_number,
        "moisture_level": 75,  # Placeholder value
        "name": f"Plant <retrived plant name>"  # Placeholder name
    }

@router.put("/status/{slot_number}/{plant_name}", tags=['Status'])
def set_slot(add_slot_request: AddSlotRequest):
    with database_connection() as conn:
        with conn.cursor() as curs:
            query = """
INSERT INTO watering_slots (slot_id, plant_name, added_at)
VALUES (%(slot_id)s, %(plant_name)s, DEFAULT)
ON CONFLICT (slot_id) DO UPDATE
SET plant_name = EXCLUDED.plant_name,
    added_at = DEFAULT;
"""
            try:
                curs.execute(query, {'plant_name': add_slot_request.plant_name, 'slot_id': add_slot_request.slot_number})
                conn.commit()
            except Exception as e:
                # Check if the error is due to a duplicate plant name.
                conn.rollback()      
                raise HTTPException(status_code=500, detail=f"Database error: {e}") 
    return BasicResponse(message=f"Successfully added plant: {add_slot_request.plant_name} to slot {add_slot_request.slot_number}")
                
    