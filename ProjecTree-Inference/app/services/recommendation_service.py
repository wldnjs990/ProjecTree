from app.api.schemas.recommendations import (
    TechStackRecommendRequest,
    TechStackRecommendResponse,
)
from app.agents.sub_agents.recommend.graph import recommend_graph
from app.db.repository.node_repository import NodeRepository
from sqlalchemy.orm import Session
from app.core.log import langfuse_handler
from app.agents.enums import NodeType
from app.db.repository.tech_repository import TechVocabularyRepository
from app.db.repository.tech_stack_info_repository import TechStackInfoRepository
from app.db.repository.node_tech_stack_repository import NodeTechStackRepository
from app.db.schemas.tech import TechStackInfoCreate, NodeTechStackCreate
from app.db.models import TaskNode
from app.agents.enums import TaskType

class RecommendationService:

    def __init__(
        self,
        node_repository: NodeRepository,
        tech_vocabulary_repository: TechVocabularyRepository,
        tech_stack_info_repository: TechStackInfoRepository,
        node_tech_stack_repository: NodeTechStackRepository,
    ):
        self.node_repository = node_repository
        self.tech_vocabulary_repository = tech_vocabulary_repository
        self.tech_stack_info_repository = tech_stack_info_repository
        self.node_tech_stack_repository = node_tech_stack_repository

    async def recommend_tech_stack(
        self, db: Session, request: TechStackRecommendRequest
    ) -> TechStackRecommendResponse:
        """기술 스택 추천 및 저장

        Args:
            db: 데이터베이스 세션
            request: 기술 스택 추천 요청 정보

        Returns:
            추천된 기술 스택 목록 및 비교 설명

        Raises:
            NotImplementedError: 서비스 미구현 상태
        """
        # 노드 정보 조회
        node = self.node_repository.get_by_id(db, request.node_id)

        # 입력 데이터 구성
        input_data = {
            "current_node_id": node.id,
            "node_type": node.node_type,
            "current_node_name": node.name,
            "current_node_description": node.description,
        }

        # NodeType이 TASK인 경우 TaskType 추가
        if node.node_type == NodeType.TASK:
            # Node 객체로 조회되었을 가능성이 있으므로 TaskNode 테이블에서 명시적으로 조회


            # ORM 세션을 이용해 TaskNode 조회 (node_id가 PK)
            # node가 이미 TaskNode 인스턴스라면 바로 접근 가능하지만, 안전하게 DB 조회
            task_node = db.query(TaskNode).filter(TaskNode.node_id == node.id).first()
            if task_node and task_node.type:
                input_data["task_type"] = task_node.type
        elif node.node_type == NodeType.ADVANCE:
            input_data["task_type"] = TaskType.ADVANCE

        # recommend_graph를 호출하여 실제 기술 스택 추천 로직 구현
        result = await recommend_graph.ainvoke(
            input_data, config={"callbacks": [langfuse_handler]}
        )

        tech_list = result["tech_list"].techs
        comparison = result["tech_list"].comparison

        # 추천된 기술 스택 저장 로직
        for tech in tech_list:
            # 1. TechVocabulary 조회 및 생성
            tech_vocab_data = (
                self.tech_vocabulary_repository.create_with_duplicate_check(
                    db, tech.name
                )
            )
            tech_vocab_id = tech_vocab_data["id"]

            # 2. TechStackInfo 생성
            tech_info_create = TechStackInfoCreate(
                is_selected=False,  # 초기값은 선택되지 않음
                recommendation=tech.recommendation_score,
                advantage=tech.advantage,
                description=tech.description,
                disadvantage=tech.disadvantage,
            )
            tech_info = self.tech_stack_info_repository.create(
                db, obj_in=tech_info_create
            )

            # 3. NodeTechStack 연결
            node_tech_stack_create = NodeTechStackCreate(
                is_recommended=True,
                node_id=node.id,
                tech_vocab_id=tech_vocab_id,
                tech_stack_info_id=tech_info.id,
            )
            self.node_tech_stack_repository.create(db, obj_in=node_tech_stack_create)

        return TechStackRecommendResponse(
            techs=[tech.model_dump() for tech in tech_list], 
            comparison=comparison
        )