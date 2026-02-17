from typing import Optional, List
from datetime import datetime
from app.db.schemas.base import BaseSchema, TimestampSchema
from app.db.schemas.tech import WorkspaceTechStackResponse

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
    workspace_tech_stacks: List[WorkspaceTechStackResponse] = []
