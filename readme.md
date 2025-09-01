# Water.me

## Introduction

Water.me is am automatic plant watering application I am working on. 
It's designed to be run on a RaspberryPi 3 and interfaces with hardware over the GPIO.

The application is split up into multiple containers which all do their own things.

## Architecture

The application is containerised using `docker` and is intended to be run as via the docker cli using: `docker compose up`

The containers communicate over a docker network and the frontend is exposed for requests.

> During development, all the containers have exposed ports for easy debugging, but this will not be true in production.

1. Database 
2. API
3. Frontend
4. Montior 

### Database:

The database container runs a postgres database. There's nothing special about this container. The Dockerfile is essentially empty aside from the postgres version to use. The folder and Dockerfile exist in case future versions require some extra configuration.

### API:

The API is a containerised [`FastAPI`](https://fastapi.tiangolo.com) application. The API handles all interaction between the programme and the database and hardware. 

It has the following main routes:

- `/plants`
- `/status`
- `/control`
- `/log`
- `/docs`

These contain sub-routes of course, but for documentation on the API, run the app and visit the /docs route which is automatically generated using Swagger

### Frontend

The frontend is a [`next.js`](https://nextjs.org) application that consumes the API to provide user interaction to - and feedback from - the plant waterer. 

It provides an interface for monitoring the plants statuses as well as providing a way to add plants to the waterer. 

It also provides the ability to add plants to a `library` so plants can be reused across multiple slots and at later dates. 

### Monitor

This is a little python programme that runs almost like a daemon. It periodically pings the API to check plant statuses and waters and plants that need watering whose `auto_water` property has been enabled.

It hasn't been written yet which explains its conspicuous absence in the codebase.

## Contribution

At the moment this project is a personal one. I'm getting familiar with a log of tuff going through this, but should anybody wish to contribute, please get in touch and I'm sure we could get something going. 

