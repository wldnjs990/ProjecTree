from app.repository.base_repository import BaseRepository
from app.db.models import Member
from app.db.schemas.member import MemberCreate, MemberUpdate

class MemberRepository(BaseRepository[Member, MemberCreate, MemberUpdate]):
    pass

member_repository = MemberRepository(Member)
