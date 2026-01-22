from app.api.schemas.recommendations import TechStackRecommendRequest, TechStackRecommendResponse
from app.agents.sub_agents.recommend.graph import recommend_graph
from app.db.repository.node_repository import NodeRepository
from sqlalchemy.orm import Session


class RecommendationService:
    
    def __init__(self, node_repository: NodeRepository):
        self.node_repository = node_repository
    
    async def recommend_tech_stack(
        self, 
        db: Session,
        request: TechStackRecommendRequest
    ) -> TechStackRecommendResponse:
        """기술 스택 추천
        
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
        
        # TODO: recommend_graph를 호출하여 실제 기술 스택 추천 로직 구현
        result = await recommend_graph.ainvoke({
            ""
        })
        raise NotImplementedError("RecommendationService.recommend_tech_stack is not implemented yet")

