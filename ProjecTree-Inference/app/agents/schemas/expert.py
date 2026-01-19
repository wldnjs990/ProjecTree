from typing import List, Literal
from pydantic import BaseModel, Field


class TechRecommandation(BaseModel):
    id: int = Field(description="기술의 DB_ID")
    name: str = Field(description="기술 명칭 (kebab-case, 예: react-js, spring-boot)")
    advantage: str = Field(description="한글로 설명한 해당 기술의 핵심 장점")
    disadvantage: str = Field(description="한글로 설명한 해당 기술의 핵심 단점")
    description: str = Field(description="한글로 설명한 해당 기술에 대한 설명")
    recommendation_score: int = Field(description="추천 점수 (1-5)")
    tech_type: Literal["FE", "BE"] = Field(
        description="기술 타입 (반드시 FE 또는 BE 중 하나여야 함)"
    )
    


class TechList(BaseModel):
    techs: List[TechRecommandation] = Field(description="비교 가능한 기술 목록")
    compairson: str = Field(description="기술 비교에 대한 설명 및 추천")
