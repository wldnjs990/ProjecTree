from app.repository.base_repository import BaseRepository
from app.db.models import Node
from app.db.schemas.node import NodeCreate, NodeUpdate

class NodeRepository(BaseRepository[Node, NodeCreate, NodeUpdate]):
    pass

node_repository = NodeRepository(Node)
