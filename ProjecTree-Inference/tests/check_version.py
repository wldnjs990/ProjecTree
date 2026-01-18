import langchain
import langgraph

print(f"LangChain Version: {langchain.__version__}")
try:
    import pandas

    print(f"Pandas Version: {pandas.__version__}")
except:
    pass
