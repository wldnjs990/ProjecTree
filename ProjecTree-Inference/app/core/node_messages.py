"""
노드별 메시지 매핑 설정

LangGraph 노드 이름에 따른 카테고리, 시작 메시지, 종료 메시지를 정의합니다.

Graphs:
- candidates/graph.py: 후보 노드 생성
- node/graph.py: 노드 생성 및 처리
- recommend/graph.py: 기술 스택 추천
- portfolio/graph.py: 포트폴리오 생성
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class NodeMessageConfig:
    """노드별 메시지 설정"""
    category: str
    start_msg: str
    end_msg: str = ""
    status: str = "IN_PROGRESS"


# ============================================================
# 노드 이름과 메시지 매핑
# LangGraph의 add_node("노드이름", 함수)에서 지정한 이름을 키로 사용
# ============================================================

NODE_MESSAGE_CONFIG: dict[str, NodeMessageConfig] = {
    # ----------------------------------------------------------
    # Candidate Graph (candidates/graph.py) - 후보 노드 생성
    # ----------------------------------------------------------
    "fetch_sibling_context": NodeMessageConfig(
        category="CANDIDATE",
        start_msg="📂 형제 노드 컨텍스트를 조회 중입니다...",
        end_msg="✅ 형제 노드 컨텍스트 조회 완료",
    ),
    "generate_candidates": NodeMessageConfig(
        category="CANDIDATE",
        start_msg="🔍 후보군 생성 작업을 시작합니다...",
        end_msg="✅ 후보 노드 생성 완료",
    ),
    "validate_candidates": NodeMessageConfig(
        category="CANDIDATE",
        start_msg="🔎 생성된 후보를 검증 중입니다...",
        end_msg="✅ 후보 검증 완료",
    ),

    # ----------------------------------------------------------
    # Node Graph (node/graph.py) - 노드 생성 및 처리
    # ----------------------------------------------------------
    "parent_node_fetch": NodeMessageConfig(
        category="NODE",
        start_msg="📦 상위 노드 정보를 조회 중입니다...",
        end_msg="✅ 상위 노드 정보 조회 완료",
    ),
    "project_spec_fetch": NodeMessageConfig(
        category="NODE",
        start_msg="📋 프로젝트 명세를 불러오는 중입니다...",
        end_msg="✅ 프로젝트 명세 조회 완료",
    ),
    "candidate_node_fetch": NodeMessageConfig(
        category="NODE",
        start_msg="📂 후보 노드 정보를 조회 중입니다...",
        end_msg="✅ 후보 노드 정보 조회 완료",
    ),
    "epic_node_process": NodeMessageConfig(
        category="NODE",
        start_msg="🏗️ Epic 노드를 처리 중입니다...",
        end_msg="✅ Epic 노드 처리 완료",
    ),
    "story_node_process": NodeMessageConfig(
        category="NODE",
        start_msg="📖 Story 노드를 처리 중입니다...",
        end_msg="✅ Story 노드 처리 완료",
    ),
    "sub_node_info_create": NodeMessageConfig(
        category="NODE",
        start_msg="🌱 상세 노드 정보를 구성 중입니다...",
        end_msg="✅ 서브 노드 정보 생성 완료",
    ),
    "task_node_process": NodeMessageConfig(
        category="NODE",
        start_msg="✏️ Task 노드를 처리 중입니다...",
        end_msg="✅ Task 노드 처리 완료",
    ),
    "advance_node_process": NodeMessageConfig(
        category="NODE",
        start_msg="⚙️ 심화 노드를 처리 중입니다...",
        end_msg="✅ 심화 노드 처리 완료",
    ),
    "structured_output_parser": NodeMessageConfig(
        category="NODE",
        start_msg="🔧 출력 데이터를 파싱 중입니다...",
        end_msg="✅ 출력 파싱 완료",
    ),
    "node_feedback": NodeMessageConfig(
        category="NODE",
        start_msg="💬 노드 피드백을 처리 중입니다...",
        end_msg="✅ 노드 피드백 처리 완료",
    ),
    "struct_feedback": NodeMessageConfig(
        category="NODE",
        start_msg="🔄 구조 피드백을 반영 중입니다...",
        end_msg="✅ 구조 피드백 반영 완료",
    ),

    # ----------------------------------------------------------
    # Recommend Graph (recommend/graph.py) - 기술 스택 추천
    # ----------------------------------------------------------
    # "project_spec_fetch" - 위에서 이미 정의됨 (중복 노드 이름)
    "expert_route": NodeMessageConfig(
        category="TECH",
        start_msg="🧭 전문 분야별 라우팅을 진행 중입니다...",
        end_msg="✅ 전문가 라우팅 완료",
    ),
    "frontend_expert": NodeMessageConfig(
        category="TECH",
        start_msg="🎨 프론트엔드 기술 스택을 분석 중입니다...",
        end_msg="✅ 프론트엔드 분석 완료",
    ),
    "backend_expert": NodeMessageConfig(
        category="TECH",
        start_msg="🔧 백엔드 기술 스택을 분석 중입니다...",
        end_msg="✅ 백엔드 분석 완료",
    ),
    "advance_expert": NodeMessageConfig(
        category="TECH",
        start_msg="🚀 심화 기술 스택을 분석 중입니다...",
        end_msg="✅ 심화 기술 분석 완료",
    ),
    "route_feedback": NodeMessageConfig(
        category="TECH",
        start_msg="🔄 기술 스택 피드백을 반영 중입니다...",
        end_msg="✅ 기술 스택 피드백 반영 완료",
    ),
    "tech_stack_integrator": NodeMessageConfig(
        category="TECH",
        start_msg="🛠️ 기술 스택을 통합 분석하고 있습니다...",
        end_msg="✅ 기술 스택 통합 완료",
    ),

    # ----------------------------------------------------------
    # Portfolio Graph (portfolio/graph.py) - 포트폴리오 생성
    # ----------------------------------------------------------
    "generate_portfolio": NodeMessageConfig(
        category="PORTFOLIO",
        start_msg="� 포트폴리오를 생성 중입니다...",
        end_msg="✅ 포트폴리오 생성 완료",
    ),
}


def get_node_config(node_name: Optional[str]) -> Optional[NodeMessageConfig]:
    """
    노드 이름으로 설정을 조회합니다.
    
    Args:
        node_name: LangGraph 노드 이름
        
    Returns:
        NodeMessageConfig 또는 None
    """
    if not node_name:
        return None
    return NODE_MESSAGE_CONFIG.get(node_name)


def get_node_category(node_name: Optional[str]) -> Optional[str]:
    """
    노드 이름으로 카테고리를 조회합니다.
    
    Args:
        node_name: LangGraph 노드 이름
        
    Returns:
        카테고리 문자열 또는 None
    """
    config = get_node_config(node_name)
    return config.category if config else None


def is_tracked_node(node_name: Optional[str]) -> bool:
    """
    추적 대상 노드인지 확인합니다.
    
    Args:
        node_name: LangGraph 노드 이름
        
    Returns:
        추적 여부
    """
    return node_name in NODE_MESSAGE_CONFIG


# ============================================================
# 도구 호출 메시지 매핑
# create_agent 내부에서 호출되는 도구들의 메시지 설정
# ============================================================

@dataclass
class ToolMessageConfig:
    """도구별 메시지 설정"""
    start_msg: str
    end_msg: str


# 도구 이름과 메시지 매핑
TOOL_MESSAGE_CONFIG: dict[str, ToolMessageConfig] = {
    # 기본 도구 (매칭되는 도구가 없을 때)
    "default": ToolMessageConfig(
        start_msg="🔧 도구를 실행 중입니다...",
        end_msg="✅ 도구 실행 완료",
    ),
    
    # 검증 도구
    "validate_summary": ToolMessageConfig(
        start_msg="📝 요약 내용을 검증 중입니다...",
        end_msg="✅ 요약 검증 완료",
    ),
    "validate_description": ToolMessageConfig(
        start_msg="📝 설명 내용을 검증 중입니다...",
        end_msg="✅ 설명 검증 완료",
    ),
    
    # 검색 도구
    "restricted_search": ToolMessageConfig(
        start_msg="🔍 웹에서 정보를 검색 중입니다...",
        end_msg="✅ 웹 검색 완료",
    ),
    
    # 데이터 조회 도구
    "fetch_sibling_candidates": ToolMessageConfig(
        start_msg="📂 형제 후보 정보를 조회 중입니다...",
        end_msg="✅ 형제 후보 조회 완료",
    ),
}


def get_tool_config(tool_name: Optional[str] = None) -> ToolMessageConfig:
    """
    도구 이름으로 메시지 설정을 조회합니다.
    
    Args:
        tool_name: 도구 이름 (없거나 매칭 안되면 default 반환)
        
    Returns:
        ToolMessageConfig
    """
    if tool_name and tool_name in TOOL_MESSAGE_CONFIG:
        return TOOL_MESSAGE_CONFIG[tool_name]
    return TOOL_MESSAGE_CONFIG["default"]
