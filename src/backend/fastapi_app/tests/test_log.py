# import pytext fixtures to set up the database
from .fixtures import setup, setup_data

# import the test client already set up.
from .client_env import client


def test_get_logs():
    response = client.get("/log", params={"lines_per_page" : 10, "page_no" : 1})
    assert response.status_code == 200

def test_bad_log():
    response = client.get("/log", params={})
    assert response.status_code == 422