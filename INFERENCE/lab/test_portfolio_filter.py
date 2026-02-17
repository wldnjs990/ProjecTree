import asyncio
import sys
import os

# 현재 디렉토리를 path에 추가하여 app 모듈을 찾을 수 있게 함
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.log import langfuse_handler
from app.agents.portfolio.graph import portfolio_graph

async def test_portfolio_generation():
    # 테스트용 더미 데이터
    dummy_input = {
        "project_title": "ProjecTree - 프로젝트 관리 및 추천 시스템",
        "project_description": "LLM 기반 프로젝트 태스크 자동 생성 및 기술 스택 추천 서비스. 사용자가 프로젝트 아이디어를 입력하면 AI가 Epic-Story-Task 구조로 분해하고, 각 태스크에 적합한 기술 스택을 추천합니다.",
        "project_start_date": "2026-01-15",
        "project_end_date": "2026-02-15",
        "project_tech_stack": ["Python", "FastAPI", "LangChain", "LangGraph", "PostgreSQL", "React", "TypeScript"],
        "project_head_count": 6,
        "user_tasks": [
            {
                "task_name": "JWT 인증 시스템 구현",
                "task_description": "Spring Security와 JWT를 활용한 사용자 인증/인가 시스템 개발",
                "task_note": "Access Token 만료 시간은 15분, Refresh Token은 7일로 설정",
                "comparison": "Session vs JWT: MSA 환경에서의 확장성과 모바일 클라이언트 지원을 고려하여 서버 상태 저장이 필요 없는 JWT를 선택함.",
                "tech_stack": {
                    "name": "JWT",
                    "advantage": "무상태 인증으로 서버 확장성 우수",
                    "disadvantage": "토큰 탈취 시 만료 전까지 사용 가능",
                    "description": "JSON Web Token 기반 인증"
                }
            },
            {
                "task_name": "LangGraph 기반 추천 파이프라인 개발",
                "task_description": "기술 스택 추천을 위한 멀티 에이전트 워크플로우 구현",
                "task_note": "FE/BE/Infra 전문가 에이전트를 병렬로 실행하고 결과를 통합하는 구조로 설계",
                "comparison": "LangChain Chain vs LangGraph: 단순 체인으로는 복잡한 분기 처리와 순환 루프 구현이 어려워, 상태 관리가 가능한 LangGraph를 도입함.",
                "tech_stack": {
                    "name": "LangGraph",
                    "advantage": "복잡한 워크플로우를 그래프 구조로 표현 가능",
                    "disadvantage": "학습 곡선이 있음",
                    "description": "LLM 애플리케이션용 워크플로우 프레임워크"
                }
            },
            {
                "task_name": "PostgreSQL 스키마 설계",
                "task_description": "프로젝트, 노드, 후보, 기술스택 테이블 설계 및 관계 정의",
                "task_note": "오늘 회의에서 ERD 검토함. 김팀장님이 몇가지 피드백 주셨음.",
                "tech_stack": {
                    "name": "PostgreSQL",
                    "advantage": "ACID 트랜잭션, JSON 지원",
                    "disadvantage": "NoSQL 대비 스키마 변경이 어려움",
                    "description": "오픈소스 관계형 데이터베이스"
                }
            },
            {
                "task_name": "CRDT 기반 실시간 동기화 구현",
                "task_description": "여러 사용자가 동시에 프로젝트를 편집할 때 충돌 없이 동기화되는 시스템 구현",
                "task_note": "3) Yjs 라이브러리가 성숙하고 문서화가 잘 되어 있음",
                "comparison": "Operational Transform vs CRDT: 중앙 서버 없이 P2P 동기화가 가능하고, 네트워크 파티션 상황에서도 결과적 일관성(Eventual Consistency)을 보장하는 CRDT 방식을 선택함.",
                "tech_stack": {
                    "name": "Yjs",
                    "advantage": "성숙한 CRDT 구현, 다양한 바인딩 제공",
                    "disadvantage": "메모리 사용량이 높을 수 있음",
                    "description": "CRDT 기반 실시간 협업 프레임워크"
                }
            },
            {
                "task_name": "React 컴포넌트 개발",
                "task_description": "프로젝트 트리 뷰 및 노드 편집 UI 컴포넌트 개발",
                "task_note": "내일까지 완료해야 함. 힘들다...",
                "tech_stack": {
                    "name": "React",
                    "advantage": "컴포넌트 기반 UI 개발",
                    "disadvantage": "상태 관리 복잡성",
                    "description": "JavaScript UI 라이브러리"
                }
            },
            { 
                 "task_name": "DB 연결 타임아웃 해결",
                 "task_description": "대량 트래픽 발생 시 DB 연결이 끊기는 문제 해결",
                 "task_note": "커넥션 풀 설정을 HikariCP로 변경하고 maxLifetime을 DB wait_timeout보다 짧게 설정하여 해결함. 또한 커넥션 누수 방지를 위해 leakDetectionThreshold 설정 추가.",
                 "tech_stack": {
                     "name": "HikariCP",
                     "advantage": "빠르고 가벼운 JDBC 커넥션 풀",
                     "disadvantage": "설정이 복잡할 수 있음",
                     "description": "High-performance JDBC connection pool"
                 }
            }
        ],
        "retry_count": 0
    }

    print("=== 포트폴리오 생성 시작 ===")
    
    # 그래프 실행
    result = await portfolio_graph.ainvoke(dummy_input, config={"callbacks": [langfuse_handler]})
    
    print("\n=== 포트폴리오 생성 결과 ===")
    print(result.get("portfolio_content", "포트폴리오 생성 실패"))

if __name__ == "__main__":
    asyncio.run(test_portfolio_generation())
