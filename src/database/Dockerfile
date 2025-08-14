FROM postgres:latest

WORKDIR /database

#  copy across the database intialisation script. this creates the database and tables
#  the postgres docker image has a handy little folder called /docker-entrypoint-initdb.d/
#  which will run any .sql files in it when the container is started for the first time (who knew!)
COPY ./database.init.sql /docker-entrypoint-initdb.d/

