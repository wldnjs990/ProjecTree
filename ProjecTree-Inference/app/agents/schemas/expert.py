from typing import List, Literal
from pydantic import BaseModel, Field

class TechRecommandation(BaseModel):
    id: str|None = Field(description="ignore", default=None)
    name: str = Field(description="기술 명칭 (kebab-case, 예: react-js). 반드시 포함되어야 함")
    advantage: str = Field(description="한글로 설명한 해당 기술의 핵심 장점")
    disadvantage: str = Field(description="한글로 설명한 해당 기술의 핵심 단점")
    description: str = Field(description="한글로 설명한 해당 기술에 대한 설명")    
    ref: str = Field(description="해당 기술에 대한 웹 검색 도구의 문서 URL")
    recommendation_score: int = Field(
        description="추천 점수 (1-5). 기술 목록 내에서 '상위 순위'를 나타내는 유일한(Unique) 정수여야 하며, 다른 기술과 중복될 수 없음."
    )

class TechList(BaseModel):
    techs: List[TechRecommandation] = Field(
        description="비교 가능한 기술 목록. 각 기술의 'recommendation_score'는 리스트 내에서 절대로 중복되지 않아야 하며, 가장 추천하는 기술부터 높은 점수를 부여하여 순위를 매겨야 함."
    )
    comparison: str = Field(description="기술 비교에 대한 상세한 비교 설명 및 Markdown 형식의 텍스트")
 