FROM python:3.13-slim

WORKDIR /app

# install python requirements
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

WORKDIR /app/fastapi_app

ENTRYPOINT [ "fastapi", "run" ]


