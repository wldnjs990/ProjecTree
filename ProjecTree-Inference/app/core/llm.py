from app.core.config import settings
from langchain_upstage import ChatUpstage
from langchain_openai import ChatOpenAI

mini_llm = ChatUpstage(name="solar-mini", temperature=0, max_retries=3)
large_llm = ChatUpstage(name="solar-pro2", temperature=0, max_retries=3)

openai_mini_llm = ChatOpenAI(name="gpt-5-mini", 
temperature=0, 
max_retries=3, 
base_url=settings.OPENAI_BASE_URL, 
api_key=settings.OPENAI_API_KEY
)