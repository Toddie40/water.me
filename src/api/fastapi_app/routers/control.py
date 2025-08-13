# This file contains the api routes for endpoints which perform direct control of the plant waterer.
# This is essentially just the water plant route, but also has meta-routes for finer control and testing

from fastapi import APIRouter

router = APIRouter()

@router.post("/water/{plant_index}")
def water_plant(plant_index: int):
    return {
        "status" : "success!",
        "message" : f"watered plant: {plant_index}"
    }