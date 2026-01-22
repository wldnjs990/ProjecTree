from typing import Optional
from app.db.schemas.base import BaseSchema, TimestampSchema

class CandidateBase(BaseSchema):
    node_id: int
    name: Optional[str] = None
    description: Optional[str] = None
    is_selected: bool = False
    derivation_node_id: Optional[int] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    is_selected: Optional[bool] = None
    derivation_node_id: Optional[int] = None

class CandidateResponse(CandidateBase, TimestampSchema):
    id: int
