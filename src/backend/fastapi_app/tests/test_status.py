# import pytext fixtures to set up the database
from .fixtures import setup, setup_data

# import the test client already set up.
from .client_env import client

def test_update_slot():
    # add test plant using test function (this test depends on the test_add_plant test unfortunately)
    response = client.put("/status/1/test_plant")
    assert response.status_code == 404

def test_get_status():
    response = client.get("/status")
    assert response.status_code == 200

def test_get_status_single():
    response = client.get("/status/1")
    assert response.status_code == 200

def test_delete_status():
    response = client.delete("/status/1")
    assert response.status_code == 404