# This file contains the api routes for endpoints which get status information from the plant waterer.

from fastapi import APIRouter

router = APIRouter()

@router.get("/status/{plant_index}")
def get_plant_status(plant_index: int):
    return {
        "status": "success",
        "message": f"Retrieved status for plant: {plant_index}",
        "plant_index": plant_index,
        "moisture_level": 75,  # Placeholder value
        "name": f"Plant {plant_index}"  # Placeholder name
    }

