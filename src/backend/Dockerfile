# FROM python:3.13-slim
FROM dtcooper/raspberrypi-os:python-bullseye

WORKDIR /app

# install python requirements
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

WORKDIR /app/fastapi_app

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["fastapi", "run"]


