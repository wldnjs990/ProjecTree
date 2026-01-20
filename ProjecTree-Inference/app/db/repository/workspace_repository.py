from app.repository.base_repository import BaseRepository
from app.db.models import Workspace
from app.db.schemas.workspace import WorkspaceCreate, WorkspaceUpdate

class WorkspaceRepository(BaseRepository[Workspace, WorkspaceCreate, WorkspaceUpdate]):
    pass

workspace_repository = WorkspaceRepository(Workspace)
