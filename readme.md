# Water.me

Repository for an automatic plant waterer with the raspberry pi.

It comprises of three parts: 
1. API (for handling the interface between hardware and pi)
2. Frontend (A web application for sending manual requests to the API and viewing the current status of the plant waterer)
3. Montior (A server-like application for constantly monitoring the state of the plant waterer and running automatic watering routines)

Each component is its own docker container and networking all happens within the docker network. THe only entrypoint to the applicaiton is via the web application. 

