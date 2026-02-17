from typing import Optional
from pydantic import EmailStr
from app.db.schemas.base import BaseSchema, TimestampSchema

class MemberBase(BaseSchema):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    nickname: Optional[str] = None
    oauth_provider: Optional[str] = None

class MemberCreate(MemberBase):
    pass

class MemberUpdate(MemberBase):
    pass

class MemberResponse(MemberBase, TimestampSchema):
    id: int
