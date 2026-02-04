import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


class Settings(BaseSettings):
    # Upstage 설정
    UPSTAGE_API_KEY: str
    UPSTAGE_LARGE_MODEL: str = "solar-pro2"
    UPSTAGE_MINI_MODEL: str = "solar-mini"
    UPSTAGE_EMBEDDING_DOCUMENT_EMBEDDING_MODEL: str = "embedding-document"
    UPSTAGE_EMBEDDING_TEXT_EMBEDDING_MODEL: str = "embedding-query"

    # PostgreSQL 설정
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str

    LANGFUSE_SECRET_KEY: str
    LANGFUSE_PUBLIC_KEY: str
    LANGFUSE_BASE_URL: str
    OPENAI_API_KEY: str
    OPENAI_BASE_URL: str
    
    # CRDT Server 설정
    CRDT_SERVER_URL: str
    CRDT_SERVER_PATH: str
    # =========================================================
    # 2. 선택 변수 (기본값을 주면 .env에 없어도 됨)
    # =========================================================

    # =========================================================
    # 3. 환경 설정 (.env 파일 로드 규칙)
    # =========================================================
    model_config = SettingsConfigDict(
        env_file=".env",  # 읽어올 파일명
        env_file_encoding="utf-8",  # 인코딩
        extra="ignore",  # .env에 정의되지 않은 키가 있어도 무시 (에러 방지)
    )


settings = Settings()
