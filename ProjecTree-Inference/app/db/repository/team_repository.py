from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.repository.base_repository import BaseRepository
from app.db.models import Team, Member
from pydantic import BaseModel


# Team용 스키마 (필요시 별도 파일로 분리)
class TeamCreate(BaseModel):
    user_id: int
    workspace_id: int
    chat_id: Optional[str] = None


class TeamUpdate(BaseModel):
    chat_id: Optional[str] = None


class TeamRepository(BaseRepository[Team, TeamCreate, TeamUpdate]):
    """Team 관련 데이터베이스 작업을 처리하는 Repository"""

    def get_by_workspace_id(self, db: Session, workspace_id: int) -> List[Team]:
        """워크스페이스 ID로 팀 멤버 목록 조회"""
        return db.query(self.model).filter(self.model.workspace_id == workspace_id).all()

    def get_headcount_by_workspace_id(self, db: Session, workspace_id: int) -> int:
        """워크스페이스의 참여 인원 수 조회"""
        return db.query(func.count(self.model.id)).filter(
            self.model.workspace_id == workspace_id
        ).scalar() or 0

    def get_members_by_workspace_id(self, db: Session, workspace_id: int) -> List[Member]:
        """워크스페이스의 참여 멤버 정보 조회"""
        return (
            db.query(Member)
            .join(Team, Team.user_id == Member.id)
            .filter(Team.workspace_id == workspace_id)
            .all()
        )


team_repository = TeamRepository(Team)
