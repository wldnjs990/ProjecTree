from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_upstage import ChatUpstage
from langchain_community.tools import TavilySearchResults
from app.core.llm import mini_llm

load_dotenv()

llm = mini_llm
tools = [TavilySearchResults()]
web_search_agent = create_agent(model=llm, tools=tools)
