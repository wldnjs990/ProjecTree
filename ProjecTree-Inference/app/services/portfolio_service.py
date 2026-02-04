"""포트폴리오 생성 서비스"""

from app.api.schemas.portfolio import PortfolioGenerateRequest, PortfolioGenerateResponse
from app.agents.portfolio.graph import portfolio_graph
from app.core.log import langfuse_handler
import logging
import traceback

logger = logging.getLogger(__name__)


class PortfolioService:
    """포트폴리오 생성 서비스 클래스
    
    LLM Agent를 활용하여 사용자의 프로젝트 정보를 기반으로 포트폴리오를 생성합니다.
    """
    
    def __init__(self):
        pass
    
    async def generate_portfolio(
        self, 
        request: PortfolioGenerateRequest
    ) -> PortfolioGenerateResponse:
        """포트폴리오 생성
        
        Args:
            request: 포트폴리오 생성 요청 정보
                - project_title: 프로젝트 제목
                - project_description: 프로젝트 설명
                - project_head_count: 프로젝트 인원수
                - user_task_schemas: 사용자가 수행한 작업 목록
        
        Returns:
            생성된 포트폴리오 내용 및 요약
        """
        logger.info(f"[PortfolioService] 포트폴리오 생성 시작 - project_title: {request.project_title}")
        
        try:
            # 요청 데이터를 State 형식으로 변환
            user_tasks = []
            for task in request.user_task_schemas:
                task_dict = {
                    "task_name": task.task_name,
                    "task_description": task.task_description,
                    "task_note": task.task_note,
                    "tech_stack": None
                }
                if task.tech_stack:
                    task_dict["tech_stack"] = {
                        "name": task.tech_stack.name,
                        "advantage": task.tech_stack.advantage,
                        "disadvantage": task.tech_stack.disadvantage,
                        "description": task.tech_stack.description
                    }
                user_tasks.append(task_dict)
            
            # 그래프 실행
            logger.info(f"[PortfolioService] portfolio_graph 호출 시작")
            result = await portfolio_graph.ainvoke(
                {
                    "project_title": request.project_title,
                    "project_description": request.project_description,
                    "project_head_count": request.project_head_count,
                    "project_start_date": request.project_start_date,
                    "project_end_date": request.project_end_date,
                    "project_tech_stack": request.project_tech_stack,
                    "user_tasks": user_tasks,
                    "retry_count": 0
                },
                config={"callbacks": [langfuse_handler]}
            )
            logger.info(f"[PortfolioService] portfolio_graph 호출 완료")
            
            portfolio_content = result.get("portfolio_content", "포트폴리오 생성에 실패했습니다.")
            summary = result.get("summary", f"{request.project_title} 프로젝트 포트폴리오")
            
            logger.info(f"[PortfolioService] 포트폴리오 생성 완료 - project_title: {request.project_title}")
            
            return PortfolioGenerateResponse(
                portfolio_content=portfolio_content,
                summary=summary
            )
            
        except Exception as e:
            logger.error(f"[PortfolioService] 포트폴리오 생성 실패 - project_title: {request.project_title}")
            logger.error(f"[PortfolioService] Error Type: {type(e).__name__}")
            logger.error(f"[PortfolioService] Error Message: {str(e)}")
            logger.error(f"[PortfolioService] Traceback:\n{traceback.format_exc()}")
            raise

