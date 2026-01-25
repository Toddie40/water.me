# This file contains the api routes for endpoints which perform direct control of the plant waterer.
# This is essentially just the water plant route, but also has meta-routes for finer control and testing
import logging

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..models.status import SlotNumber

logger = logging.getLogger(__name__)

router = APIRouter(
     tags=['Control'],
     prefix="/control"
)

# controller = interface.RPIController()
# TODO: update to actually poll hardware using interface class
@router.get("/sensors")
def get_sensors():
    logger.info("pollling sensors...")
    return {"result": "success!"}

# @router.post("/water/{slot_number}")
# def water_plant(slot_number: SlotNumber):
#     return StreamingResponse(
#         controller.water(slot_number)
#     )

# @router.get("/sensors/{slot_number}")
# def read_sensor(slot_number: SlotNumber):
#     return controller.read_sensor(slot_number)