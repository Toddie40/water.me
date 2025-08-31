from fastapi import FastAPI

from .routers import plants, log
from .utils.db_conf import setup_db
from .middleware import LoggingMiddleware, log_function

app = FastAPI()

app.add_middleware(LoggingMiddleware, log_function=log_function)

# api endpoints for controlling the plant waterer
# app.include_router(control.router)
# app.include_router(status.router)
app.include_router(plants.router)
app.include_router(log.router)

# create database tables and perform necessary setup
@app.on_event("startup")
def on_startup():
    setup_db()

@app.get("/", tags=['Health Check'])
async def root():
    return {
        "message": "plant_waterer_api",
        "status" : "heathy"
        }