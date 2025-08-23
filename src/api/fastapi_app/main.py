from fastapi import FastAPI

from .routers import control, status, plant

app = FastAPI()

# api endpoints for controlling the plant waterer
app.include_router(control.router)
app.include_router(status.router)
app.include_router(plant.router)

# api endpoints for reading the status of the plant waterer
# app.include_router(status.router)

@app.get("/")
async def root():
    return {
        "message": "plant_waterer_api",
        "status" : "heathy"
        }