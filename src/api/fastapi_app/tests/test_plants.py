# import pytext fixtures to set up the database
from .fixtures import setup, setup_data

# import the test client already set up.
from .client_env import client

# This test suite performs CRUD operations on the api in order.
# This has the intentional side effect, that earlier tests failing will result in later tests also failing. 
# This is an intentional decision, because _all_ operations _must_ work for this suite to pass.

def test_add_plant():
    files = {"image": ("testfile.jpeg", open('test_image.jpeg', 'rb'), "image/jpeg")}
    form_data = {
            "name": "test_plant",
            "description": "test_description",
            "moisture_threshold": "2.2"
        }
    response = client.post("/plants", data=form_data, files=files)
    assert response.status_code == 201

def test_add_bad_plant():
    files = {"image": ("testfile.jpeg", open('test_image.jpeg', 'rb'), "image/jpeg")}
    form_data = {
            "description": "test_description",
            "moisture_threshold": "2.2"
        }
    response = client.post("/plants", data=form_data, files=files)
    assert response.status_code == 422

# TODO add assert line for json content of the response once the mock database has been set up
def test_get_plants():
    response = client.get("/plants")
    assert response.status_code == 200

def test_get_plant():
    response = client.get("/plants/test_plant")
    assert response.status_code == 200

def test_get_bad_plant():
    response = client.get("/plants/no_plant")
    assert response.status_code == 404

def test_get_plant_image():
    response = client.get("/plants/images/test_plant")
    assert response.status_code == 200

def test_get_bad_plant_image():
    response = client.get("/plants/images/no_plant")
    assert response.status_code == 404

def test_delete_plant():
    response = client.delete("/plants/test_plant")
    assert response.status_code == 200

def test_delete_bad_plant():
    response = client.delete("/plants/no_plant")
    assert response.status_code == 404