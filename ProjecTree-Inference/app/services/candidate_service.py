from app.api.schemas.candidates import CandidateGenerateRequest, CandidateGenerateResponse
from app.agents.sub_agents.candidates.graph import candidate_graph
from app.db.repository.node_repository import NodeRepository
from app.agents.enums import NodeType
from app.db.repository.candidate_repository import CandidateRepository
from sqlalchemy.orm import Session
from app.core.log import langfuse_handler
import logging
import traceback

logger = logging.getLogger(__name__)

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
        logger.info(f"[CandidateService] 후보 노드 생성 시작 - node_id: {request.node_id}")
        
        try:
            # 노드 정보 조회
            node = self.node_repository.get_by_id(db, request.node_id)
            logger.debug(f"[CandidateService] 노드 조회 완료 - node_type: {node.node_type}, name: {node.name}")
            
            # candidate_graph를 호출하여 실제 후보 노드 생성 로직 구현
            logger.info(f"[CandidateService] candidate_graph 호출 시작")
            result = await candidate_graph.ainvoke({
                "current_node_id": node.id,
                "candidate_count": request.candidate_count,
                "current_node_type": node.node_type,
                "current_node_name": node.name,
                "current_node_description": node.description,
            }, config={
                "callbacks": [langfuse_handler]
            })
            logger.info(f"[CandidateService] candidate_graph 호출 완료")
            
            # result['candidates']는 CandidateList 객체이므로 .candidates 속성으로 접근
            candidate_list = result['candidates']
            candidates_data = candidate_list.candidates
            logger.debug(f"[CandidateService] 생성된 후보 수: {len(candidates_data)}")
            
            # Pydantic 객체를 딕셔너리로 변환
            candidates_dict = [candidate.model_dump() for candidate in candidates_data]
            
            self.candidate_repository.create_multiple(db, node.id, candidates_dict)
            logger.info(f"[CandidateService] 후보 노드 DB 저장 완료 - node_id: {request.node_id}")
            
            return CandidateGenerateResponse(candidates=candidates_dict)
            
        except Exception as e:
            logger.error(f"[CandidateService] 후보 노드 생성 실패 - node_id: {request.node_id}")
            logger.error(f"[CandidateService] Error Type: {type(e).__name__}")
            logger.error(f"[CandidateService] Error Message: {str(e)}")
            logger.error(f"[CandidateService] Traceback:\n{traceback.format_exc()}")
            raise