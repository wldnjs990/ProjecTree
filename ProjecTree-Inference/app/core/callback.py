from langchain.callbacks.base import BaseCallbackHandler

class DeepAgentStreamHandler(BaseCallbackHandler):
    def __init__(self, session_id: str, crdt_client):
        self.session_id = session_id
        self.crdt_client = crdt_client
        self.tool_call_count = 0
    
    async def on_llm_start(self, serialized, prompts, **kwargs):
        await self.crdt_client.send({
            "type": "agent_thinking",
            "message": "🧠 AI가 분석 중...",
            "session_id": self.session_id
        })
    
    async def on_tool_start(self, serialized, input_str, **kwargs):
        tool_name = serialized.get("name", "도구")
        self.tool_call_count += 1
        
        # 도구별 한글 메시지
        if tool_name == "restricted_search":
            message = f"🔍 '{input_str[:30]}...' 웹에서 검색 중... ({self.tool_call_count}번째)"
        else:
            message = f"🔧 {tool_name} 실행 중..."
        
        await self.crdt_client.send({
            "type": "tool_call",
            "message": message,
            "tool": tool_name,
            "session_id": self.session_id
        })
    
    async def on_tool_end(self, output, **kwargs):
        await self.crdt_client.send({
            "type": "tool_complete",
            "message": "✅ 검색 완료, 결과 분석 중...",
            "session_id": self.session_id
        })
    
    async def on_agent_finish(self, finish, **kwargs):
        await self.crdt_client.send({
            "type": "agent_complete",
            "message": "🎉 기술 스택 분석 완료!",
            "session_id": self.session_id
        })