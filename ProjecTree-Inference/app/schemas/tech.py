from typing import List
from pydantic import BaseModel, Field


class TechExtraction(BaseModel):
    name: str = Field(description="기술 명칭 (예: React, Spring Boot)")
    advantage: str = Field(description="해당 기술의 핵심 장점")
    disadvantage: str = Field(description="해당 기술의 핵심 단점")
    description: str = Field(description="해당 기술에 대한 간략한 설명")
    recommendation_score: int = Field(description="추천 점수 (1-10)")


class TechList(BaseModel):
    techs: List[TechExtraction]
