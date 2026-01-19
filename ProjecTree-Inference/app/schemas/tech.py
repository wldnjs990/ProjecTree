from typing import List, Literal
from pydantic import BaseModel, Field


class TechRecommandation(BaseModel):
    name: str = Field(description="기술 명칭 (예: React, Spring Boot)")
    advantage: str = Field(description="해당 기술의 핵심 장점")
    disadvantage: str = Field(description="해당 기술의 핵심 단점")
    description: str = Field(description="해당 기술에 대한 간략한 설명")
    recommendation_score: int = Field(description="추천 점수 (1-10)")
    tech_type: Literal["FE", "BE"] = Field(
        description="기술 타입 (반드시 FE 또는 BE 중 하나여야 함)"
    )    
    


class TechList(BaseModel):
    techs: List[TechRecommandation]
