# Base image
FROM python:3.12.7-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
# 1. psycopg2 빌드를 위한 gcc, libpq-dev
# 2. (선택사항) pyppeteer/OpenCV 등이 있다면 필요한 추가 라이브러리가 있을 수 있음
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
# requirements.txt 대신 .in 파일을 복사합니다.
COPY requirements.in .

# Install python dependencies
# 1. pip를 최신 버전으로 업그레이드 (구버전 pip는 의존성 해결 능력이 떨어짐)
# 2. requirements.in을 통해 리눅스 환경에 맞는 버전을 새로 계산해서 설치
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.in

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["python", "-m", "app.main"]