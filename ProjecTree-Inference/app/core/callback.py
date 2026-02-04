from langchain_core.callbacks import AsyncCallbackHandler
from app.core.config import settings
from app.agents.candidates.schemas.candidate import CandidateList
from app.agents.recommend.schemas.expert import TechList
from app.core.node_messages import get_node_config, is_tracked_node
from typing import Any, Dict, Optional
from uuid import UUID
import logging
from app.core.crdt_client import get_crdt_client

logger = logging.getLogger(__name__)


class AgentStreamHandler(AsyncCallbackHandler):
    """
    LangGraph 노드 실행을 추적하고 클라이언트에 진행 상태를 전송하는 핸들러.

    주요 기능:
    - on_chain_start/end: 노드 시작/완료 시점 메시지 전송
    - run_id 기반으로 실행 컨텍스트 추적
    """

    def __init__(self, crdt_client, workspace_id: int, node_id: int):
        """
        AgentStreamHandler 초기화.

        Args:
            crdt_client: CRDT 클라이언트 인스턴스
            workspace_id: 워크스페이스 ID
            node_id: 노드 ID
        """
        self.crdt_client = crdt_client
        self.workspace_id = workspace_id
        self.node_id = node_id
        self.tool_call_count = 0
        # run_id -> node_name 매핑으로 실행 컨텍스트 추적
        self.active_nodes: Dict[UUID, str] = {}
        # run_id -> inputs 저장 (on_chain_end에서 사용)
        self.run_inputs: Dict[UUID, Dict[str, Any]] = {}
        # run_id -> tool_name 저장 (on_tool_end에서 사용)
        self.active_tool_runs: Dict[UUID, Optional[str]] = {}

    def _get_node_name(
        self, serialized: Optional[Dict[str, Any]], kwargs: Dict[str, Any]
    ) -> Optional[str]:
        """
        노드 이름을 추출합니다.
        """
        # kwargs에서 직접 name 확인 (v0.3+ 대응)
        node_name = kwargs.get("name")

        # serialized에서 name 확인 (기존 방식)
        if not node_name and serialized:
            node_name = serialized.get("name")

        return node_name

    async def on_chain_start(
        self,
        serialized: Optional[Dict[str, Any]],
        inputs: Dict[str, Any],
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """체인(노드) 실행 시작 시 호출"""
        # 1. 노드 이름 식별
        node_name = self._get_node_name(serialized, kwargs)

        # 2. 추적 대상 노드인지 확인
        if not is_tracked_node(node_name):
            return

        # 3. 실행 컨텍스트 저장
        self.active_nodes[run_id] = node_name
        self.run_inputs[run_id] = inputs

        # 4. 노드 설정 조회 및 시작 메시지 전송
        config = get_node_config(node_name)
        if config:
            logger.debug(f"Node started: {node_name}, run_id: {run_id}")

            await self.crdt_client.send(
                {
                    "body": {
                        "workspaceId": self.workspace_id,
                        "nodeId": self.node_id,
                        "category": config.category,
                        "content": config.start_msg,
                    },
                }
            )

    async def on_chain_end(
        self,
        outputs: Dict[str, Any],
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """체인(노드) 실행 종료 시 호출"""
        # 저장된 노드 정보 가져오기
        node_name = self.active_nodes.pop(run_id, None)

        # 추적 대상 노드가 아니면 종료
        if not node_name:
            return

        config = get_node_config(node_name)
        if not config:
            return

        logger.debug(f"Node ended: {node_name}, run_id: {run_id}")

        # 카테고리별 완료 메시지 생성
        content = self._build_completion_message(node_name, config, outputs)

        await self.crdt_client.send(
            {
                "body": {
                    "workspaceId": self.workspace_id,
                    "nodeId": self.node_id,
                    "category": config.category,
                    "content": content,
                },
            }
        )

    def _build_completion_message(
        self, node_name: str, config: Any, outputs: Dict[str, Any]
    ) -> str:
        """노드별 완료 메시지를 생성합니다."""
        if node_name == "generate_candidates":
            candidates = outputs.get("candidates") if outputs else None
            if isinstance(candidates, CandidateList) and candidates.candidates:
                return f"{len(candidates.candidates)}개의 후보 노드 생성 완료"
            return config.end_msg

        elif node_name == "tech_stack_integrator":
            tech_list = outputs.get("tech_list") if outputs else None
            if isinstance(tech_list, TechList) and tech_list.techs:
                tech_names = ", ".join([t.name for t in tech_list.techs])
                return f"기술 스택 통합 완료: {tech_names}"
            return config.end_msg

        return config.end_msg

    async def on_llm_start(
        self,
        serialized: Optional[Dict[str, Any]],
        prompts: Any,
        **kwargs: Any,
    ) -> None:
        """LLM 호출 시작 시 호출 - 여기서는 아무 작업도 하지 않음"""
        pass

    async def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: Any,
        **kwargs: Any,
    ) -> None:
        """Chat 모델 호출 시작 시 호출"""
        model_name = serialized.get("name", "") if serialized else ""
        logger.debug(f"Chat model started: {model_name}")

        await self.crdt_client.send(
            {
                "body": {
                    "workspaceId": self.workspace_id,
                    "nodeId": self.node_id,
                    "category": "CANDIDATE",
                    "content": "🤖 AI가 분석 중입니다...",
                },
            }
        )

    async def on_tool_start(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """도구 실행 시작 시 호출"""
        tool_name = serialized.get("name", "unknown")
        self.tool_call_count += 1
        self.active_tool_runs[run_id] = tool_name

        # 도구별 메시지 생성
        tool_messages = {
            "tavily_search_results_json": "🔍 웹에서 정보를 검색 중입니다...",
            "validate_summary": "✅ 요약 내용을 검증 중입니다...",
        }
        content = tool_messages.get(
            tool_name, f"🔧 {tool_name} 도구를 실행 중입니다..."
        )

        await self.crdt_client.send(
            {
                "body": {
                    "workspaceId": self.workspace_id,
                    "nodeId": self.node_id,
                    "category": "CANDIDATE",
                    "content": content,
                },
            }
        )

    async def on_tool_end(
        self,
        output: Any,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """도구 실행 완료 시 호출 - 여기서는 아무 작업도 하지 않음"""
        self.active_tool_runs.pop(run_id, None)

    async def on_tool_error(
        self,
        error: BaseException,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """도구 실행 오류 시 호출 - 여기서는 아무 작업도 하지 않음"""
        self.active_tool_runs.pop(run_id, None)
        logger.error(f"Tool error: {error}")

    async def on_agent_finish(self, finish: Any, **kwargs: Any) -> None:
        """에이전트 완료 시 호출 - 여기서는 아무 작업도 하지 않음"""
        pass


def get_stream_handler(workspace_id: int, node_id: int) -> AgentStreamHandler:
    """
    AgentStreamHandler 인스턴스를 반환합니다.
    매 호출마다 새 인스턴스 생성 (event loop 문제 방지).

    Args:
        workspace_id: 워크스페이스 ID
        node_id: 노드 ID

    Returns:
        AgentStreamHandler 인스턴스.
    """
    return AgentStreamHandler(
        crdt_client=get_crdt_client(path=settings.CRDT_SERVER_PATH),
        workspace_id=workspace_id,
        node_id=node_id,
    )


# ----------------Portfolio Stream Handler----------------


class PortfolioStreamHandler(AsyncCallbackHandler):
    """
    포트폴리오 생성 과정을 추적하고 CRDT 클라이언트에 진행 상태를 전송하는 핸들러.
    """

    def __init__(self, crdt_client, workspace_id: int, member_id: int):
        self.crdt_client = crdt_client
        self.workspace_id = workspace_id
        self.member_id = member_id

    async def _send_update(self, content: str):
        """CRDT 서버로 업데이트 전송"""
        await self.crdt_client.send(
            {
                "body": {
                    "workspaceId": self.workspace_id,
                    "memberId": self.member_id,
                    "content": content,
                }
            }
        )

    async def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: Any,
        **kwargs: Any,
    ) -> None:
        """Chat 모델 호출 시작 시"""
        await self._send_update("🤖 AI가 포트폴리오를 작성 중입니다...")

    async def on_tool_start(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        """도구 실행 시작 시"""
        tool_name = serialized.get("name", "unknown")
        msg = f"🔧 {tool_name} 도구를 실행 중입니다..."

        # 도구별 메시지 커스터마이징
        if tool_name == "tavily_search_results_json":
            msg = "🔍 자료를 검색 중입니다..."

        await self._send_update(msg)

    async def on_llm_start(
        self,
        serialized: Optional[Dict[str, Any]],
        prompts: Any,
        **kwargs: Any,
    ) -> None:
        pass

    async def on_tool_end(self, *args, **kwargs) -> None:
        pass

    async def on_tool_error(self, *args, **kwargs) -> None:
        pass

    async def on_chain_start(self, *args, **kwargs) -> None:
        pass

    async def on_chain_end(self, *args, **kwargs) -> None:
        pass


def get_portfolio_stream_handler(
    workspace_id: int, member_id: int
) -> PortfolioStreamHandler:
    """
    PortfolioStreamHandler 인스턴스를 반환합니다.

    Args:
        workspace_id: 워크스페이스 ID
        member_id: 멤버 ID

    Returns:
        PortfolioStreamHandler 인스턴스.
    """
    return PortfolioStreamHandler(
        crdt_client=get_crdt_client(path=settings.CRDT_PORTFOLIO_PATH),
        workspace_id=workspace_id,
        member_id=member_id,
    )
