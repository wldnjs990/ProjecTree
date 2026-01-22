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
