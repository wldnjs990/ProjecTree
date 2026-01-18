from pydantic import BaseModel, Field


class TaskAnalysis(BaseModel):
    comparison: str = Field(description="기술적 접근 방식 비교 분석")
    difficult: int = Field(description="구현 난이도 (1-5)")
