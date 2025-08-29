from fastapi import FastAPI

from .routers import control, plants, status, log

from .middleware import LoggingMiddleware, log_function

app = FastAPI()

app.add_middleware(LoggingMiddleware, log_function=log_function)

# api endpoints for controlling the plant waterer
app.include_router(control.router)
app.include_router(status.router)
app.include_router(plants.router)
app.include_router(log.router)

# api endpoints for reading the status of the plant waterer
# app.include_router(status.router)

@app.get("/")
async def root():
    return {
        "message": "plant_waterer_api",
        "status" : "heathy"
        }