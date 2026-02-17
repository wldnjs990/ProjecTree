from typing import List, Literal
from pydantic import BaseModel, Field


class TechName(BaseModel):
    tech_origin_id: str = Field(description="원본 기술 ID")
    tech_db_id: str = Field(description="DB에 저장된 기술 ID(Key값)")
    tech_name: str = Field(description="기술 명칭, cabab-case")
