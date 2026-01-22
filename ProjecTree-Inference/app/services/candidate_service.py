from app.api.schemas.candidates import CandidateGenerateRequest, CandidateGenerateResponse


class CandidateService:
    """후보 노드 생성 서비스 클래스
    
    실제 구현은 향후 추가 예정입니다.
    candidate_graph를 호출하여 후보 노드를 생성합니다.
    """
    
    async def generate_candidates(
        self, 
        request: CandidateGenerateRequest
    ) -> CandidateGenerateResponse:
        """후보 노드 생성
        
        Args:
            request: 후보 노드 생성 요청 정보
            
        Returns:
            생성된 후보 노드 목록
            
        Raises:
            NotImplementedError: 서비스 미구현 상태
        """
        # TODO: candidate_graph를 호출하여 실제 후보 노드 생성 로직 구현
        # from app.agents.sub_agents.candidates.graph import candidate_graph
        # result = await candidate_graph.ainvoke({...})
        raise NotImplementedError("CandidateService.generate_candidates is not implemented yet")
