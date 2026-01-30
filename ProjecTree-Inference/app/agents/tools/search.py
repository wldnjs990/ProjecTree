from langchain_tavily import TavilySearch
from dotenv import load_dotenv
from langchain.tools import tool
load_dotenv()


# 2~30개의 신뢰할 수 있는 도메인 리스트
TRUSTED_DOMAINS = [
    "https://tech.kakao.com/blog/",
    "https://medium.com/",
    "https://helloworld.kurly.com/",
    "https://techblog.woowahan.com/",
    "https://blog.banksalad.com/",
    "https://meetup.nhncloud.com/",
    "https://hyperconnect.github.io/",
    "https://blog.gangnamunni.com/blog/tech/",
    "https://techblog.yogiyo.co.kr/",
    "https://blog.est.ai/",
    "https://ridicorp.com/story-category/tech-blog/"
    "https://d2.naver.com/home",
    "https://www.44bits.io/ko",
    "https://news.hada.io/",
    "https://techblog.samsung.com/",
    "https://velog.io/"
]

@tool
def restricted_search(query: str) -> str:
    """
    검증된 기술 블로그 및 엔지니어링 도메인(Trusted Domains) 내에서만 심층적인 기술 정보를 검색합니다.
    일반적인 웹 검색이 아닌, '기술 비교', 'Best Practices', '트러블슈팅 사례'를 찾을 때 필수적으로 사용해야 합니다.

    [검색 원칙]
    1. 이 도구는 시스템 프롬프트의 'include_domains'에 명시된 URL들(Kakao, Naver D2, Toss, Woowahan 등)만 타겟팅합니다.
    2. 단순한 개념 정의가 아닌, 기술 간의 장단점 비교(Comparison), 성능 이슈, 마이그레이션 가이드 등을 찾는 데 최적화되어 있습니다.

    [쿼리 작성 가이드]
    - 사용자의 요구사항을 분석하여 기술 비교가 가능한 형태의 쿼리를 입력하세요.
    - 예시: "React Hook Form vs Formik 성능 비교", "Spring Boot 3.2 JPA Best Practices", "Redis vs Memcached 캐싱 전략"
    
    Args:
        query (str): 검색할 구체적인 기술 키워드 또는 질문 (한국어 권장, 필요시 기술명은 영어 병기)
    
    Returns:
        str: 검색된 기술 블로그의 내용 요약 및 URL 정보
    """
    search_tool = TavilySearch(
        include_domains=TRUSTED_DOMAINS,
        search_depth="advanced"
    )
    return search_tool.invoke({"query": query})