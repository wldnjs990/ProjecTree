from typing import Optional
from datetime import datetime
from app.db.schemas.base import BaseSchema, TimestampSchema

class WorkspaceBase(BaseSchema):
    name: str
    description: Optional[str] = None
    purpose: Optional[str] = None
    domain: Optional[str] = None
    identifier_prefix: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    purpose: Optional[str] = None
    domain: Optional[str] = None
    identifier_prefix: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class WorkspaceResponse(WorkspaceBase, TimestampSchema):
    id: int
