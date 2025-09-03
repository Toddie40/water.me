import pytest
import os
from testcontainers.postgres import PostgresContainer

from ..utils.db_conf import setup_db

postgres = PostgresContainer("postgres:17.6-alpine3.22")

# This is the test fixture a the MODULE level. This is run before any tests are begun in the suite. 
# It creates the test container and creates the tables in the database as well as populates the status table to have three null plants in it.
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

    # set up the database tables and populate the status table using the production script
    setup_db()


@pytest.fixture(scope="function", autouse=True)
def setup_data():
    # clean up database ready for next test.
    # This fixture is run before each individual test. 
    # ATM I don't think there are anyt things that need to happen here, 
    # but I will keep the fixture in case it becomes necessary later as the tests grow in number.
    pass
    


