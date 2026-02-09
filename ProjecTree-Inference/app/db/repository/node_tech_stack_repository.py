from app.db.repository.base_repository import BaseRepository
from app.db.models import NodeTechStack
from app.db.schemas.tech import NodeTechStackCreate, NodeTechStackUpdate


class NodeTechStackRepository(
    BaseRepository[NodeTechStack, NodeTechStackCreate, NodeTechStackUpdate]
):
    pass


node_tech_stack_repository = NodeTechStackRepository(NodeTechStack)
