from app.db.repository.base_repository import BaseRepository
from app.db.models import TechVocabulary
from app.db.schemas.tech import TechVocabularyCreate, TechVocabularyUpdate


class TechStackRepository(
    BaseRepository[TechVocabulary, TechVocabularyCreate, TechVocabularyUpdate]
):
    pass


tech_stack_repository = TechStackRepository(TechVocabulary)
