"""포트폴리오 프롬프트 패키지

prompts/system/: 정적 지시사항이 포함된 시스템 프롬프트
prompts/user/: 동적 데이터가 삽입되는 사용자 프롬프트
"""

from app.agents.portfolio.prompts.system import (
    PORTFOLIO_AGENT_SYSTEM_PROMPT,
    NOTE_FILTER_SYSTEM_PROMPT,
)
from app.agents.portfolio.prompts.user import (
    PORTFOLIO_USER_PROMPT,
    format_tasks_for_prompt,
    NOTE_FILTER_USER_PROMPT,
)

__all__ = [
    # System prompts
    "PORTFOLIO_AGENT_SYSTEM_PROMPT",
    "NOTE_FILTER_SYSTEM_PROMPT",
    # User prompts
    "PORTFOLIO_USER_PROMPT",
    "format_tasks_for_prompt",
    "NOTE_FILTER_USER_PROMPT",
]
