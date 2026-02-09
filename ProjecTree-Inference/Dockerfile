# Base image
FROM python:3.12.7-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.in .

RUN uv pip install --system --no-cache -r requirements.in

COPY . .
EXPOSE 8000

# Command to run the application
CMD ["python", "-m", "app.main"]