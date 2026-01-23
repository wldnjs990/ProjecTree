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


class NodeTechStackBase(BaseSchema):
    is_recommended: bool
    node_id: Optional[int] = None
    tech_vocab_id: Optional[int] = None
    tech_stack_info_id: Optional[int] = None


class NodeTechStackCreate(NodeTechStackBase):
    node_id: int
    tech_vocab_id: int
    tech_stack_info_id: int


class NodeTechStackUpdate(BaseSchema):
    is_recommended: Optional[bool] = None
    node_id: Optional[int] = None
    tech_vocab_id: Optional[int] = None
    tech_stack_info_id: Optional[int] = None


class NodeTechStackResponse(NodeTechStackBase, TimestampSchema):
    id: int
