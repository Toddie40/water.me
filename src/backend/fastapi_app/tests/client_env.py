from fastapi import FastAPI
from fastapi.testclient import TestClient
from ..routers import plants
from ..routers import log
from ..routers import status

# Build testing environment to import into all test files
app = FastAPI()

app.include_router(plants.router)
app.include_router(log.router)
app.include_router(status.router)

client = TestClient(app, client=('localhost', 8000))
