from pydantic import BaseModel, Field

class TaskAnalysis(BaseModel):
    comparison: str = Field(description="기술적 접근 방식 비교 분석", min_length=1, max_length=1000)
    difficult: int = Field(description="구현 난이도 (1-5)", ge=1, le=5)
