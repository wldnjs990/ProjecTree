from typing import Optional
from app.db.schemas.base import BaseSchema, TimestampSchema

class NodeBase(BaseSchema):
    node_type: str
    identifier: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    user_id: Optional[int] = None

class NodeCreate(NodeBase):
    pass

class NodeUpdate(BaseSchema):
    identifier: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    # node_type usually shouldn't change
    
class NodeResponse(NodeBase, TimestampSchema):
    id: int

# Specific Node Types can extend this if necessary
class TaskNodeCreate(NodeCreate):
    difficult: Optional[int] = None
    comparison: Optional[str] = None
    type: Optional[str] = None # BE/FE

class TaskNodeUpdate(NodeUpdate):
    difficult: Optional[int] = None
    comparison: Optional[str] = None
    type: Optional[str] = None
