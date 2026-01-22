from typing import Optional, List, Dict, Any
from app.db.schemas.base import BaseSchema, TimestampSchema


class TechVocabularyBase(BaseSchema):
    name: str


class TechVocabularyCreate(TechVocabularyBase):
    pass


class TechVocabularyUpdate(BaseSchema):
    name: Optional[str] = None


class TechVocabularyResponse(TechVocabularyBase, TimestampSchema):
    id: int


class TechStackInfoBase(BaseSchema):
    is_selected: bool
    recommendation: int
    advantage: Optional[str] = None
    description: Optional[str] = None
    disadvantage: Optional[str] = None


class TechStackInfoCreate(TechStackInfoBase):
    pass


class TechStackInfoUpdate(BaseSchema):
    is_selected: Optional[bool] = None
    recommendation: Optional[int] = None
    advantage: Optional[str] = None
    description: Optional[str] = None
    disadvantage: Optional[str] = None


class TechStackInfoResponse(TechStackInfoBase, TimestampSchema):
    id: int
