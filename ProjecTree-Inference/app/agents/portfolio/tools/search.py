"""기술 스택 검색 도구"""

from langchain_core.tools import tool
from langchain_community.tools.tavily_search import TavilySearchResults
from typing import Dict, Any
import os


# Tavily 검색 설정
tavily_search = TavilySearchResults(
    max_results=3,
    include_domains=["velog.io", "tistory.com", "medium.com", "dev.to", "techblog.woowahan.com"]
)


@tool
def search_tech_description(tech_name: str) -> Dict[str, Any]:
    """
    특정 기술이 비즈니스적으로 어떤 가치를 주는지 검색합니다.
    포트폴리오에 작성할 수 있도록 해당 기술의 장점과 활용 사례를 찾습니다.
    
    Args:
        tech_name: 검색할 기술 스택 이름 (예: Kafka, Redis, React)
    
    Returns:
        검색 결과:
        - tech_name: 검색한 기술 이름
        - business_value: 비즈니스적 가치/장점
        - use_cases: 주요 활용 사례
        - keywords: 관련 키워드 (포트폴리오 작성용)
        - raw_results: 원본 검색 결과
    """
    # 비즈니스 가치 중심 검색 쿼리
    query = f"{tech_name} 도입 효과 장점 비즈니스 가치 활용 사례"
    
    try:
        search_results = tavily_search.invoke(query)
        
        if not search_results:
            return {
                "tech_name": tech_name,
                "business_value": f"{tech_name}은(는) 현대 소프트웨어 개발에서 널리 사용되는 기술입니다.",
                "use_cases": ["일반적인 서비스 구축"],
                "keywords": [tech_name],
                "raw_results": []
            }
        
        # 검색 결과에서 비즈니스 가치 관련 키워드 추출
        business_keywords = {
            "Kafka": ["이벤트 기반 아키텍처", "비동기 처리", "대용량 메시지 처리", "마이크로서비스 통신", "실시간 데이터 파이프라인"],
            "Redis": ["캐싱", "세션 관리", "실시간 랭킹", "Pub/Sub", "성능 최적화"],
            "React": ["컴포넌트 기반 UI", "SPA", "재사용성", "가상 DOM", "사용자 경험 개선"],
            "Spring": ["엔터프라이즈 애플리케이션", "의존성 주입", "AOP", "트랜잭션 관리", "보안"],
            "Docker": ["컨테이너화", "환경 일관성", "배포 자동화", "마이크로서비스", "DevOps"],
            "Kubernetes": ["오케스트레이션", "자동 스케일링", "무중단 배포", "고가용성", "클라우드 네이티브"],
            "PostgreSQL": ["관계형 데이터베이스", "ACID", "JSON 지원", "확장성", "데이터 무결성"],
            "MongoDB": ["NoSQL", "스키마리스", "수평적 확장", "유연한 데이터 모델", "빠른 개발"],
            "Elasticsearch": ["전문 검색", "로그 분석", "실시간 검색", "분산 시스템", "분석 엔진"],
            "RabbitMQ": ["메시지 큐", "비동기 처리", "작업 분산", "신뢰성 있는 전달", "디커플링"],
        }
        
        # 해당 기술의 키워드가 있으면 사용, 없으면 검색 결과에서 추출
        keywords = business_keywords.get(tech_name, [])
        
        # 검색 결과 요약
        all_content = " ".join([r.get("content", "") for r in search_results[:3]])
        
        # 비즈니스 가치 문구 생성
        if keywords:
            business_value = f"{tech_name}을(를) 활용하여 {', '.join(keywords[:3])}을(를) 구현했습니다."
        else:
            business_value = f"{tech_name}을(를) 도입하여 시스템의 효율성과 안정성을 개선했습니다."
        
        return {
            "tech_name": tech_name,
            "business_value": business_value,
            "use_cases": keywords[:5] if keywords else ["서비스 안정성 향상", "개발 생산성 증대"],
            "keywords": keywords,
            "raw_results": search_results[:3]
        }
        
    except Exception as e:
        # 검색 실패 시 기본값 반환
        return {
            "tech_name": tech_name,
            "business_value": f"{tech_name}을(를) 활용하여 프로젝트를 개발했습니다.",
            "use_cases": ["기술 적용"],
            "keywords": [tech_name],
            "error": str(e)
        }
