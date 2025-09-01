import pytest
import os
from testcontainers.postgres import PostgresContainer

from ..utils.db_conf import setup_db

postgres = PostgresContainer("postgres:17.6-alpine3.22")

@pytest.fixture(scope="module", autouse=True)
def setup(request):
    postgres.start()

    def remove_container():
        postgres.stop()

    request.addfinalizer(remove_container)
    os.environ["POSTGRES_HOST"] = postgres.get_container_host_ip()
    os.environ["POSTGRES_PORT"] = str(postgres.get_exposed_port(5432))
    os.environ["POSTGRES_USER"] = postgres.username
    os.environ["POSTGRES_PASSWORD"] = postgres.password
    os.environ["POSTGRES_DB"] = postgres.dbname


@pytest.fixture(scope="function", autouse=True)
def setup_data():
    # set up database using the normal database setup script in production
    setup_db()


