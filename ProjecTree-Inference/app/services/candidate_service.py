from app.api.schemas.candidates import CandidateGenerateRequest, CandidateGenerateResponse
from app.agents.sub_agents.candidates.graph import candidate_graph
from app.db.repository.node_repository import NodeRepository
from app.db.repository.candidate_repository import CandidateRepository
from sqlalchemy.orm import Session
from app.core.log import langfuse_handler

class CandidateService:
    """후보 노드 생성 서비스 클래스
    
    candidate_graph를 호출하여 후보 노드를 생성합니다.
    """
    
    def __init__(self, node_repository: NodeRepository, candidate_repository: CandidateRepository):
        self.node_repository = node_repository
        self.candidate_repository = candidate_repository
    
    async def generate_candidates(
        self, 
        db: Session,
        request: CandidateGenerateRequest
    ) -> CandidateGenerateResponse:
        # 노드 정보 조회
        node = self.node_repository.get_by_id(db, request.node_id)
        
        # TODO: candidate_graph를 호출하여 실제 후보 노드 생성 로직 구현
        result = await candidate_graph.ainvoke({
            "current_node_id": node.id,
            "candidate_count": request.candidate_count,
            "current_node_type": node.node_type,
            "current_node_name": node.name,
            "current_node_description": node.description,
        }, config={
            "callbacks": [langfuse_handler]
        })
        candidates_data = result['candidates']['candidates']
        self.candidate_repository.create_multiple(db, node.id, candidates_data)
        return CandidateGenerateResponse(candidates=candidates_data)