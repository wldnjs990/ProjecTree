from langchain.callbacks.base import BaseCallbackHandler
from app.agents.candidates.schemas.candidate import CandidateList
from app.agents.recommend.schemas.expert import TechList
import logging

logger = logging.getLogger(__name__)


class DeepAgentStreamHandler(BaseCallbackHandler):
    # 노드 이름과 카테고리 매핑
    NODE_CATEGORY_MAP = {
        "generate_candidates": "CANDIDATE",
        "sub_node_info_create": "NODE",
        "tech_stack_integrator": "TECH",
    }

    def __init__(self, session_id: str, crdt_client):
        self.session_id = session_id
        self.crdt_client = crdt_client
        self.tool_call_count = 0

    async def on_llm_start(self, serialized, prompts, **kwargs):
        await self.crdt_client.send(
            {
                "type": "agent_thinking",
                "message": "🧠 AI가 분석 중...",
                "session_id": self.session_id,
            }
        )

    async def on_chain_end(self, outputs, **kwargs):
        """체인(노드) 실행 종료 시 호출"""
        serialized = kwargs.get("serialized", {})
        node_name = serialized.get("name") if serialized else None

        # kwargs의 parent_run_id 등을 통해 정확한 노드를 식별해야 할 수도 있지만,
        # LangGraph에서는 보통 노드 함수 이름이 name으로 전달됨.
        # 만약 serialized가 없거나 name이 없다면, run object를 확인해야 할 수도 있음.
        # 여기서는 간단히 kwargs에 넘어오는 inputs/outputs를 활용.

        # NOTE: LangGraph nodes execution triggers on_chain_end.
        # However, getting the exact node name might depend on how LangChain/LangGraph instrument it.
        # If 'name' is not available directly, we might need run_id mapping or check inputs/output structure.
        # Assuming we can filter by the mapped names.

        # 하지만 LangGraph의 노드 실행은 'Chain' 실행으로 잡히지 않을 수 있음(RunnableLambda 등).
        # serialized.get('name')이 노드 이름('generate_candidates' 등)과 일치한다고 가정하고 구현.
        # 실제 런타임에서 name이 다르게 넘어올 경우 수정 필요.

        # 대안: inputs/outputs의 구조를 보고 판단하거나,
        # LangGraph의 경우 Config를 통해 name을 전달받지 않으므로,
        # 가장 확실한 건 run.name을 확인하는 것인데 BaseCallbackHandler에서는 run object를 직접 받지 않음 (v0.2+).
        # v0.1 호환성을 위해 run object가 kwargs에 있을 수 있음.

        # 여기서는 안전하게직접 주입된 node 이름을 사용하거나,
        # 맵핑된 키가 name에 포함되는지 확인.

        # 디버깅을 위해 로깅
        # logger.info(f"Chain End: {node_name}, Outputs: {outputs.keys() if outputs else 'None'}")

        if node_name in self.NODE_CATEGORY_MAP:
            category = self.NODE_CATEGORY_MAP[node_name]
            inputs = kwargs.get("inputs", {})

            # State 추출
            if not inputs:
                return

            workspace_id = str(inputs.get("workspace_id", ""))

            # Category별 node_id 및 content 결정
            target_node_id = ""
            content = ""

            if category == "CANDIDATE":
                # Candidate generation
                target_node_id = str(inputs.get("current_node_id", ""))

                # outputs에서 결과 확인
                candidates = None
                if outputs and "candidates" in outputs:
                    candidates = outputs["candidates"]

                if isinstance(candidates, CandidateList) and candidates.candidates:
                    content = f"{len(candidates.candidates)}개의 후보 노드 생성 완료"
                else:
                    content = "후보 노드 생성 완료 (개수 확인 불가)"

            elif category == "NODE":
                # Sub node creation logic
                target_node_id = str(inputs.get("parent_id", ""))
                content = "서브 노드 생성 프로세스 시작"

            elif category == "TECH":
                # Tech stack integration
                # RecommendedState doesn't explicit have node_id, use empty string or infer
                target_node_id = str(inputs.get("node_id", ""))  # State에 없을 수 있음

                tech_list = None
                if outputs and "tech_list" in outputs:
                    tech_list = outputs["tech_list"]

                if isinstance(tech_list, TechList) and tech_list.techs:
                    content = f"기술 스택 통합 완료: {', '.join([t.name for t in tech_list.techs])}"
                else:
                    content = "기술 스택 통합 완료"

            if category:
                await self.crdt_client.send(
                    {
                        "type": "process_update",
                        "method": "POST",
                        "path": "internal/ai/messages",
                        "body": {
                            "workspaceId": workspace_id,
                            "nodeId": target_node_id,
                            "category": category,
                            "content": content,
                        },
                        "session_id": self.session_id,
                    }
                )

    async def on_tool_start(self, serialized, input_str, **kwargs):
        tool_name = serialized.get("name", "도구")
        self.tool_call_count += 1

        # 도구별 한글 메시지
        if tool_name == "restricted_search":
            message = f"🔍 '{input_str[:30]}...' 웹에서 검색 중... ({self.tool_call_count}번째)"
        else:
            message = f"🔧 {tool_name} 실행 중..."

        await self.crdt_client.send(
            {
                "type": "tool_call",
                "message": message,
                "tool": tool_name,
                "session_id": self.session_id,
            }
        )

    async def on_tool_end(self, output, **kwargs):
        await self.crdt_client.send(
            {
                "type": "tool_complete",
                "message": "✅ 검색 완료, 결과 분석 중...",
                "session_id": self.session_id,
            }
        )

    async def on_agent_finish(self, finish, **kwargs):
        await self.crdt_client.send(
            {
                "type": "agent_complete",
                "message": "🎉 기술 스택 분석 완료!",
                "session_id": self.session_id,
            }
        )
