from langchain_upstage import ChatUpstage
mini_llm = ChatUpstage(model="solar-mini", temperature=0)
large_llm = ChatUpstage(model="solar-pro2", temperature=0)