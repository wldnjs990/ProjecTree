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
from app.db.models import NodeTechStack
from app.db.models import TaskNode, AdvanceNode
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
            task_node = db.query(TaskNode).filter(TaskNode.node_id == node.id).first()
            if task_node and task_node.type:
                input_data["task_type"] = task_node.type
        elif node.node_type == NodeType.ADVANCE:
            input_data["task_type"] = TaskType.ADVANCE

        # 기존 NodeTechStack 조회 (node_id 기준) - 제외할 기술 스택 목록 생성
        existing_node_tech_stacks = db.query(NodeTechStack).filter(
            NodeTechStack.node_id == node.id
        ).all()

        if existing_node_tech_stacks:
            # 기존 기술 스택 이름 목록 추출
            excluded_tech_names = []
            for existing_nts in existing_node_tech_stacks:
                if existing_nts.tech_vocabulary:
                    excluded_tech_names.append(existing_nts.tech_vocabulary.name)
            input_data["excluded_tech_stacks"] = excluded_tech_names

        # recommend_graph를 호출하여 실제 기술 스택 추천 로직 구현
        result = await recommend_graph.ainvoke(
            input_data, config={"callbacks": [langfuse_handler]}
        )

        tech_list = result["tech_list"].techs
        comparison = result["tech_list"].comparison
        
        # TASK 또는 ADVANCE 노드인 경우 comparison 필드 업데이트
        if node.node_type == NodeType.TASK:
            task_node = db.query(TaskNode).filter(TaskNode.node_id == node.id).first()
            if task_node:
                task_node.comparison = comparison
                db.commit()
        elif node.node_type == NodeType.ADVANCE:
            advance_node = db.query(AdvanceNode).filter(AdvanceNode.node_id == node.id).first()
            if advance_node:
                advance_node.comparison = comparison
                db.commit()
        
        # 기존 데이터가 있으면 기존 TechStackInfo 삭제 후 새로 생성
        if existing_node_tech_stacks:
            for existing_nts in existing_node_tech_stacks:
                # 연결된 TechStackInfo 삭제
                if existing_nts.tech_stack_info_id:
                    existing_tech_info = self.tech_stack_info_repository.get_by_id(
                        db, existing_nts.tech_stack_info_id
                    )
                    if existing_tech_info:
                        db.delete(existing_tech_info)
                # NodeTechStack 삭제
                db.delete(existing_nts)
            db.commit()

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
                ref=tech.ref
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