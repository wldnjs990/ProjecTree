from app.api.schemas.recommendations import TechStackRecommendRequest, TechStackRecommendResponse


class RecommendationService:
    """기술 스택 추천 서비스 클래스
    
    실제 구현은 향후 추가 예정입니다.
    recommend_graph를 호출하여 기술 스택을 추천합니다.
    """
    
    async def recommend_tech_stack(
        self, 
        request: TechStackRecommendRequest
    ) -> TechStackRecommendResponse:
        """기술 스택 추천
        
        Args:
            request: 기술 스택 추천 요청 정보
            
        Returns:
            추천된 기술 스택 목록 및 비교 설명
            
        Raises:
            NotImplementedError: 서비스 미구현 상태
        """
        # TODO: recommend_graph를 호출하여 실제 기술 스택 추천 로직 구현
        # from app.agents.sub_agents.recommend.graph import recommend_graph
        # result = await recommend_graph.ainvoke({...})
        raise NotImplementedError("RecommendationService.recommend_tech_stack is not implemented yet")
