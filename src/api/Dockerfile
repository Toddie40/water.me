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
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/refs/heads/master/wait-for-it.sh -O /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["/usr/local/bin/wait-for-it.sh", "database:5432", "--timeout=30", "--strict", "--", "fastapi", "run"]


