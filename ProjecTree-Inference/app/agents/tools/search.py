from langchain_community.tools.tavily_search import TavilySearchResults
from dotenv import load_dotenv
from langchain.tools import tool

load_dotenv()


# 한국 기술 블로그 도메인만 허용 (외국 블로그 제외)
TRUSTED_DOMAINS = [
    "tech.kakao.com",
    "helloworld.kurly.com",
    "techblog.woowahan.com",
    "blog.banksalad.com",
    "meetup.nhncloud.com",
    "hyperconnect.github.io",
    "blog.gangnamunni.com",
    "techblog.yogiyo.co.kr",
    "blog.est.ai",
    "ridicorp.com",
    "d2.naver.com",
    "44bits.io",
    "news.hada.io",
    "techblog.samsung.com",
    "velog.io",
    "tistory.com",
    "blog.naver.com",
]

from app.agents.tools.validator import url_validator

@tool
def restricted_search(query: str) -> str:
    """
    한국 기술 블로그에서만 심층적인 기술 정보를 검색합니다.
    일반적인 웹 검색이 아닌, '기술 비교', 'Best Practices', '트러블슈팅 사례'를 찾을 때 필수적으로 사용해야 합니다.
    
    ⚠️ [중요] 검색 결과는 한국 블로그만 반환됩니다. ref URL도 반드시 한국 블로그여야 합니다.

    [include_domains - 한국 기술 블로그만 허용]
    tech.kakao.com, helloworld.kurly.com, techblog.woowahan.com, blog.banksalad.com,
    meetup.nhncloud.com, hyperconnect.github.io, blog.gangnamunni.com, techblog.yogiyo.co.kr,
    blog.est.ai, ridicorp.com, d2.naver.com, 44bits.io, news.hada.io, techblog.samsung.com,
    velog.io, tistory.com, blog.naver.com

    [검색 원칙]
    1. 단순한 개념 정의가 아닌, 기술 간의 장단점 비교(Comparison), 성능 이슈, 마이그레이션 가이드 등을 찾는 데 최적화되어 있습니다.

    [쿼리 작성 가이드]
    - 사용자의 요구사항을 분석하여 기술 비교가 가능한 형태의 쿼리를 입력하세요.
    - 반드시 한국어로 작성하세요.
    - 예시: "multer 파일 업로드 스트리밍", "sharp 이미지 리사이징 튜토리얼", "Spring Boot 트랜잭션 처리"
    
    Args:
        query (str): 검색할 구체적인 기술 키워드 또는 질문 (반드시 한국어로 작성)
    
    Returns:
        str: 검색된 한국 기술 블로그의 내용 요약 및 유효한 URL 정보
    """
    try:
        search_tool = TavilySearchResults(
            include_domains=TRUSTED_DOMAINS,
            search_depth="basic",
            max_results=3  # 결과 개수 제한 (토큰 비용 최적화)
        )
        results = search_tool.invoke({"query": query})
        
        valid_results = []
        for res in results:
            url = res.get("url")
            content = res.get("content")
            
            if not url:
                continue
                
            # url_validator 도구를 사용하여 검증
            if url_validator.invoke(url):
                valid_results.append(f"Title: {res.get('title', 'No Title')}\nURL: {url}\nContent: {content}\n")

        if not valid_results:
            return "검색 결과가 없거나 유효한 기술 블로그 URL을 찾지 못했습니다. 다른 키워드로 재검색해보세요."

        return "\n---\n".join(valid_results)

    except Exception as e:
        return f"Search Error: {str(e)}"