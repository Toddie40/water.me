from os import getenv
from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
import httpx
import logging

# import routers
from .routers import plants
from .routers import log
from .routers import status
# control will only run on a RPi. Need to find a way to spoof
from .routers import control

from .utils.db_conf import setup_db
from .middleware import LoggingMiddleware, log_function

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# create database tables and perform necessary setup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Setting up db...")
    setup_db()
    logging.info("done!")

    POLLING_INTERVAL = int(getenv("POLLING_INTERVAL", "60")) # INterval to poll the hardware to take sensor measurements. Defaults to 60 seconds
    
    logging.info(f'Setting up scheduler to poll sensors every {POLLING_INTERVAL} seconds')
    scheduler = BackgroundScheduler()
    scheduler.add_job(control.get_sensors, "interval", seconds = POLLING_INTERVAL)
    scheduler.start()

    yield

    # Cleanup when app shuts down
    logging.info("Shutting down scheduler...")
    scheduler.shutdown(wait=True)
    logging.info("done!")

app = FastAPI(lifespan=lifespan)

app.add_middleware(LoggingMiddleware, log_function=log_function)

# api endpoints for controlling the plant waterer
# app.include_router(control.router)
app.include_router(status.router)
app.include_router(plants.router)
app.include_router(log.router)
app.include_router(control.router)

@app.get("/", tags=['Health Check'])
async def root():
    return {
        "message": "plant_waterer_api",
        "status" : "heathy"
        }