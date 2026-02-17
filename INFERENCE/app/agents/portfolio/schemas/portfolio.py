"""포트폴리오 생성 스키마 정의"""

from pydantic import BaseModel, Field


class PortfolioOutput(BaseModel):
    """포트폴리오 생성 결과"""
    portfolio_content: str = Field(description="마크다운 형식의 포트폴리오 내용")
    summary: str = Field(description="포트폴리오 한 줄 요약")
