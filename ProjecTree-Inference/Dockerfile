# Base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
# psycopg2 requires libpq-dev and gcc
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install python dependencies
# Filter out pywin32 as it is Windows specific and will fail on Linux
RUN grep -v "pywin32" requirements.txt > requirements_linux.txt \
    && pip install --no-cache-dir -r requirements_linux.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["python", "-m", "app.main"]
