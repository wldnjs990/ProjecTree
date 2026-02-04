"""포트폴리오 생성 Agent 노드"""

from app.agents.portfolio.state import PortfolioState
from app.agents.portfolio.schemas.portfolio import PortfolioOutput
from app.agents.portfolio.tools.analyze import analyze_task_distribution
from app.agents.portfolio.prompts.system.portfolio_system import PORTFOLIO_AGENT_SYSTEM_PROMPT
from app.agents.portfolio.prompts.user.portfolio_user import PORTFOLIO_USER_PROMPT, format_tasks_for_prompt
from app.core.llm import openai_nano_llm
from langchain.agents import create_agent
from langchain_core.runnables import RunnableConfig
import logging

logger = logging.getLogger(__name__)

# 도구 목록
tools = [analyze_task_distribution]


def generate_portfolio_node(state: PortfolioState, config: RunnableConfig) -> PortfolioState:
    """포트폴리오 생성 Agent 노드"""
    logger.info(f"[Portfolio] 포트폴리오 생성 시작 - project: {state.get('project_title')}")
    
    try:
        # 태스크 목록 포맷팅
        user_tasks = state.get("user_tasks", [])
        formatted_tasks = format_tasks_for_prompt(user_tasks)
        
        # 사용자 프롬프트 구성
        tech_stack_list = state.get("project_tech_stack", []) or []
        tech_stack_str = ", ".join(tech_stack_list) if tech_stack_list else "정보 없음"
        
        user_prompt = PORTFOLIO_USER_PROMPT.format(
            project_title=state.get("project_title", ""),
            project_description=state.get("project_description", ""),
            project_start_date=state.get("project_start_date", "정보 없음"),
            project_end_date=state.get("project_end_date", "정보 없음"),
            project_tech_stack=tech_stack_str,
            project_head_count=state.get("project_head_count", 1),
            formatted_tasks=formatted_tasks
        )
        
        # DeepAgent 생성 및 실행
        agent = create_agent(
            model=openai_nano_llm,
            tools=tools,
            system_prompt=PORTFOLIO_AGENT_SYSTEM_PROMPT,
        )
        
        response = agent.invoke({
            "messages": [("user", user_prompt)]
        }, config=config)
        
        # 응답에서 포트폴리오 내용 추출
        messages = response.get("messages", [])
        if messages:
            # 마지막 AI 메시지에서 포트폴리오 내용 추출
            last_message = messages[-1]
            if hasattr(last_message, 'content'):
                portfolio_content = last_message.content
            else:
                portfolio_content = str(last_message)
        else:
            portfolio_content = "포트폴리오 생성에 실패했습니다."
        
        logger.info(f"[Portfolio] 포트폴리오 생성 완료 - project: {state.get('project_title')}")
        
        return {
            **state,
            "formatted_tasks": formatted_tasks,
            "portfolio_content": portfolio_content,
            "summary": f"{state.get('project_title')} 프로젝트 포트폴리오",
            "last_error": None
        }
        
    except Exception as e:
        logger.error(f"[Portfolio] 포트폴리오 생성 실패: {str(e)}")
        return {
            **state,
            "last_error": str(e),
            "retry_count": state.get("retry_count", 0) + 1
        }
