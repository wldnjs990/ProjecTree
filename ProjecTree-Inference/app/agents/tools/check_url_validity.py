
from langchain_core.tools import tool
import requests
@tool
def check_url_validity(url: str) -> str:
    """
    Check if the URL returns a 200 OK status. 
    Returns 'Valid' if 200, otherwise returns the error code or message.
    """
    try:
        response = requests.head(url, timeout=3, allow_redirects=True)
        if response.status_code == 200:
            return "Valid"
        # 403/404 등은 Invalid 처리
        return f"Invalid (Status: {response.status_code})"
    except Exception as e:
        return f"Invalid (Error: {str(e)})"