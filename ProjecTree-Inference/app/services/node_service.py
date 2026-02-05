from sqlalchemy.orm import Session
from sqlalchemy import insert
from app.core.callback import get_stream_handler
from app.api.schemas.nodes import NodeCreateRequest, NodeCreateResponse
from app.db.repository.node_repository import NodeRepository
from app.db.repository.candidate_repository import CandidateRepository
from app.db.models import (
    Node,
    EpicNode,
    StoryNode,
    TaskNode,
    AdvanceNode,
    node_tree,
    Candidate,
)
from app.db.schemas.node import NodeCreate, TaskNodeCreate
from app.agents.enums import NodeType
from app.core.log import langfuse_handler
import logging

logger = logging.getLogger(__name__)


class NodeService:
    """노드 생성 서비스 클래스

    메인 그래프를 호출하여 노드를 생성합니다.
    """

    def __init__(
        self,
        node_repository: NodeRepository,
        candidate_repository: CandidateRepository,
    ):
        self.node_repository = node_repository
        self.candidate_repository = candidate_repository

    async def create_node(
        self, db: Session, request: NodeCreateRequest
    ) -> NodeCreateResponse:
        """노드 생성

        Args:
            db: 데이터베이스 세션
            request: 노드 생성 요청 정보 (workspace_id, candidate_id, parent_id)

        Returns:
            생성된 노드 ID 및 상태
        """
        from app.agents.node.graph import builder

        # 2. Graph 컴파일 및 실행
        graph = builder.compile()
        result = await graph.ainvoke(
            {
                "workspace_id": request.workspace_id,
                "parent_id": request.parent_id,
                "candidate_id": request.candidate_id,
            },
            config={"callbacks": [langfuse_handler, get_stream_handler(workspace_id=request.workspace_id, node_id=request.parent_id)]},
        )

        # 3. 결과에서 생성된 노드 정보 추출
        generated_node = result.get("generated_node")
        parent_info = result.get("parent_info")
        current_candidate_info = result.get("current_candidate_info")

        if not generated_node or not parent_info:
            error_msg = result.get("last_error") if result else "Unknown error"
            raise ValueError(
                f"Graph execution failed: generated_node or parent_info is missing. Last Error: {error_msg}"
            )

        # 4. 부모 노드의 타입에 따라 자식 노드 타입 결정
        parent_node_type = parent_info.node_type
        child_node_type = self._get_child_node_type(parent_node_type)


        if isinstance(generated_node, dict):
            node_name = generated_node.get("name")
            node_description = generated_node.get("description")
            node_difficulty = generated_node.get("difficulty")
            task_type = generated_node.get("task_type")
        else:
            node_name = generated_node.name
            node_description = generated_node.description
            node_difficulty = getattr(generated_node, "difficulty", None)
            task_type = getattr(generated_node, "task_type", None)

        logger.info(
            f"[DEBUG] Extracted - name: {node_name}, description: {node_description}"
        )

        created_node = self._create_node_by_type(
            db=db,
            node_type=child_node_type,
            name=node_name,
            description=node_description,
            task_type=task_type,
            difficulty=node_difficulty,
            x_pos=request.x_pos,
            y_pos=request.y_pos,
        )

        # 6. node_tree 관계 저장 (부모-자식 관계)
        self._create_node_tree_relation(db, request.parent_id, created_node.id)

        # 7. Candidate의 derivation_node_id 업데이트
        if current_candidate_info:
            self._update_candidate_derivation(db, request.candidate_id, created_node.id)

        db.commit()

        return NodeCreateResponse(
            node_id=created_node.id,
            parent_id=request.parent_id,
            candidate_id=request.candidate_id,
            x_pos=request.x_pos,
            y_pos=request.y_pos,
        )

    def _get_child_node_type(self, parent_node_type: NodeType) -> NodeType:
        """부모 노드 타입에 따른 자식 노드 타입 결정"""
        type_mapping = {
            NodeType.PROJECT: NodeType.EPIC,
            NodeType.EPIC: NodeType.STORY,
            NodeType.STORY: NodeType.TASK,
            NodeType.TASK: NodeType.ADVANCE,
        }
        return type_mapping.get(parent_node_type, NodeType.TASK)

    def _create_node_by_type(
        self,
        db: Session,
        node_type: NodeType,
        name: str,
        description: str,
        task_type=None,
        difficulty: int = None,
        x_pos: float = 0.0,
        y_pos: float = 0.0,
    ) -> Node:
        """노드 타입에 따른 노드 생성 (Joined Table Inheritance)"""
        logger.info(
            f"[DEBUG] _create_node_by_type called with name={name}, description={description[:50] if description else None}..."
        )

        # 타입별 서브클래스 직접 생성 (Joined Table Inheritance 방식)
        if node_type == NodeType.EPIC:
            node = EpicNode(
                node_type=node_type,
                name=name,
                description=description,
                status="TODO",
                x_pos=x_pos,
                y_pos=y_pos,
            )
        elif node_type == NodeType.STORY:
            node = StoryNode(
                node_type=node_type,
                name=name,
                description=description,
                status="TODO",
                x_pos=x_pos,
                y_pos=y_pos,
            )
        elif node_type == NodeType.TASK:
            node = TaskNode(
                node_type=node_type,
                name=name,
                description=description,
                status="TODO",
                difficult=difficulty,
                type=task_type,
                x_pos=x_pos,
                y_pos=y_pos,
            )
        elif node_type == NodeType.ADVANCE:
            node = AdvanceNode(
                node_type=node_type,
                name=name,
                description=description,
                status="TODO",
                difficult=difficulty,
                x_pos=x_pos,
                y_pos=y_pos,
            )
        else:
            # 기본 Node (일반적이지 않은 경우)
            node = Node(
                node_type=node_type,
                name=name,
                description=description,
                status="TODO",
                x_pos=x_pos,
                y_pos=y_pos,
            )

        db.add(node)
        db.flush()  # ID 생성을 위해 flush

        logger.info(
            f"[DEBUG] Created Node id={node.id}, name={node.name}, description={node.description[:50] if node.description else None}"
        )

        return node

    def _create_node_tree_relation(
        self,
        db: Session,
        parent_id: int,
        child_id: int,
    ):
        """node_tree 테이블에 부모-자식 관계 저장"""
        from sqlalchemy.dialects.postgresql import insert as pg_insert

        # 직접 부모-자식 관계 (depth=1) - ON CONFLICT DO NOTHING으로 중복 방지
        stmt = (
            pg_insert(node_tree)
            .values(
                ancestor_id=parent_id,
                descendant_id=child_id,
                depth=1,
            )
            .on_conflict_do_nothing(index_elements=["ancestor_id", "descendant_id"])
        )
        db.execute(stmt)

        # 조상들의 관계도 추가 (closure table 패턴)
        # 부모의 모든 조상에 대해 새로운 관계 추가
        ancestor_query = db.execute(
            node_tree.select().where(node_tree.c.descendant_id == parent_id)
        ).fetchall()

        for ancestor in ancestor_query:
            stmt = (
                pg_insert(node_tree)
                .values(
                    ancestor_id=ancestor.ancestor_id,
                    descendant_id=child_id,
                    depth=ancestor.depth + 1,
                )
                .on_conflict_do_nothing(index_elements=["ancestor_id", "descendant_id"])
            )
            db.execute(stmt)

    def _update_candidate_derivation(
        self,
        db: Session,
        candidate_id: int,
        node_id: int,
    ):
        """Candidate의 derivation_node_id 업데이트 및 is_selected 설정"""
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if candidate:
            candidate.derivation_node_id = node_id
            candidate.is_selected = True
