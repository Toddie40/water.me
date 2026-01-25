# FROM python:3.13-slim
FROM dtcooper/raspberrypi-os:python-bullseye

WORKDIR /app

# install uv
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

COPY . .

# Disable development dependencies
ENV UV_NO_DEV=1
RUN uv sync --locked

EXPOSE 8000

WORKDIR /app/fastapi_app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["uv", "run", "fastapi", "run"]


