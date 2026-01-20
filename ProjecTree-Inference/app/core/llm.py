from app.core.config import settings
from langchain_upstage import ChatUpstage
from langchain_openai import ChatOpenAI

mini_llm = ChatUpstage(model="solar-mini", name="solar-mini", temperature=0, max_retries=3)
large_llm = ChatUpstage(model="solar-pro2", name="solar-pro2", temperature=0, max_retries=3)

openai_mini_llm = ChatOpenAI(model="gpt-5-mini", 
name="gpt-5-mini", 
temperature=0, 
max_retries=3, 
base_url=settings.OPENAI_BASE_URL, 
api_key=settings.OPENAI_API_KEY
)

openai_nano_llm = ChatOpenAI(model="gpt-5-nano", 
name="gpt-5-nano", 
temperature=0, 
max_retries=3, 
base_url=settings.OPENAI_BASE_URL, 
reasoning_effort="minimal",  # 추론 토큰 생성을 억제하여 속도 향상
verbosity="low",             # 출력의 군더더기를 줄임
api_key=settings.OPENAI_API_KEY
)