from fastapi import FastAPI

from .routers import control

app = FastAPI()


app.include_router(control.router)

@app.get("/")
async def root():
    return {
        "message": "plant_waterer_api",
        "status" : "heathy"
        }