from app.core.config import settings
from langchain_upstage import ChatUpstage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

mini_llm = ChatUpstage(model="solar-mini", name="solar-mini", temperature=0, max_retries=3)
large_llm = ChatUpstage(model="solar-pro2", name="solar-pro2", temperature=0, max_retries=3)

openai_gpt_5_2 = ChatOpenAI(
    model="gpt-5.2",
    name="gpt-5.2",
    temperature=0,
    max_retries=3,
    base_url=settings.OPENAI_BASE_URL,
    api_key=settings.AI_API_KEY
)

# 내일 여기서 모델 수정
openai_mini_llm = ChatOpenAI(
    model="gpt-5-nano", 
    name="gpt-5-nano", 
    temperature=0, 
    max_retries=3, 
    base_url=settings.OPENAI_BASE_URL, 
    api_key=settings.AI_API_KEY,
    reasoning_effort="minimal",  # 추론 토큰 생성을 억제하여 속도 향상
)

opendai_reasoning_llm = ChatOpenAI(
    model="gpt-5-mini", 
    name="gpt-5-mini", 
    temperature=0, 
    max_retries=3, 
    base_url=settings.OPENAI_BASE_URL, 
    api_key=settings.AI_API_KEY,
reasoning_effort="medium", 
)

openai_nano_llm = ChatOpenAI(model="gpt-5-nano", 
name="gpt-5-nano", 
temperature=0, 
max_retries=3, 
base_url=settings.OPENAI_BASE_URL, 
reasoning_effort="minimal",  # 추론 토큰 생성을 억제하여 속도 향상
api_key=settings.AI_API_KEY
)

claude_llm = ChatAnthropic(
    model="claude-3-5-haiku-latest", 
    temperature=0, 
    max_retries=3, 
    base_url=settings.ANTHROPIC_BASE_URL, 
    api_key=settings.AI_API_KEY,
)