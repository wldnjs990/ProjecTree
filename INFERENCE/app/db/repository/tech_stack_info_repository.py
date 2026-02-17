from app.db.repository.base_repository import BaseRepository
from app.db.models import TechStackInfo
from app.db.schemas.tech import TechStackInfoCreate, TechStackInfoUpdate


class TechStackInfoRepository(
    BaseRepository[TechStackInfo, TechStackInfoCreate, TechStackInfoUpdate]
):
    pass


tech_stack_info_repository = TechStackInfoRepository(TechStackInfo)
