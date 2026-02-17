"""포트폴리오 생성을 위한 도구들"""

from langchain_core.tools import tool
from typing import List, Dict, Any
from collections import Counter
import re


@tool
def analyze_task_distribution(task_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    태스크 목록을 분석하여 통계와 주요 키워드를 추출합니다.
    
    Args:
        task_list: 사용자가 수행한 태스크 목록
                   각 태스크는 {task_name, task_description, task_note, tech_stack} 형태
    
    Returns:
        분석 결과:
        - total_tasks: 총 태스크 수
        - tech_distribution: 기술 스택별 태스크 비율
        - keywords: 추출된 주요 키워드
        - task_categories: 추정된 태스크 카테고리 (BE/FE/Infra 등)
    """
    if not task_list:
        return {
            "total_tasks": 0,
            "tech_distribution": {},
            "keywords": [],
            "task_categories": {},
            "summary": "분석할 태스크가 없습니다."
        }
    
    total_tasks = len(task_list)
    
    # 기술 스택 분포 분석
    tech_counter = Counter()
    for task in task_list:
        tech = task.get("tech_stack")
        if tech and isinstance(tech, dict):
            tech_name = tech.get("name", "Unknown")
            tech_counter[tech_name] += 1
        elif tech and isinstance(tech, str):
            tech_counter[tech] += 1
    
    tech_distribution = {
        tech: {
            "count": count,
            "percentage": round((count / total_tasks) * 100, 1)
        }
        for tech, count in tech_counter.most_common()
    }
    
    # 키워드 추출 (태스크 이름과 설명에서)
    all_text = " ".join([
        f"{task.get('task_name', '')} {task.get('task_description', '')}"
        for task in task_list
    ])
    
    # 주요 키워드 패턴 (한국어/영어 키워드)
    keyword_patterns = [
        r'API', r'구현', r'개발', r'설계', r'연동', r'처리',
        r'인증', r'로그인', r'회원', r'결제', r'알림', r'검색',
        r'업로드', r'다운로드', r'캐싱', r'최적화', r'리팩토링',
        r'테스트', r'배포', r'CI/CD', r'모니터링', r'로깅',
        r'WebSocket', r'REST', r'GraphQL', r'CRUD', r'SSE',
        r'프론트엔드', r'백엔드', r'풀스택', r'인프라', r'DevOps'
    ]
    
    keywords = []
    for pattern in keyword_patterns:
        if re.search(pattern, all_text, re.IGNORECASE):
            keywords.append(pattern)
    
    # 태스크 카테고리 추정
    category_keywords = {
        "Backend": ["API", "서버", "DB", "데이터베이스", "백엔드", "REST", "인증", "Spring", "Django", "FastAPI", "Node"],
        "Frontend": ["UI", "화면", "컴포넌트", "프론트", "React", "Vue", "페이지", "레이아웃"],
        "Infrastructure": ["배포", "CI/CD", "Docker", "K8s", "Kubernetes", "AWS", "인프라", "서버 구축"],
        "Data": ["데이터", "분석", "ETL", "파이프라인", "ML", "AI"],
    }
    
    category_counter = Counter()
    for task in task_list:
        task_text = f"{task.get('task_name', '')} {task.get('task_description', '')}"
        for category, cat_keywords in category_keywords.items():
            for kw in cat_keywords:
                if kw.lower() in task_text.lower():
                    category_counter[category] += 1
                    break
    
    task_categories = {
        cat: {
            "count": count,
            "percentage": round((count / total_tasks) * 100, 1)
        }
        for cat, count in category_counter.most_common()
    }
    
    # 주요 카테고리 요약
    main_category = category_counter.most_common(1)[0][0] if category_counter else "General"
    main_percentage = task_categories.get(main_category, {}).get("percentage", 0)
    
    summary = f"총 {total_tasks}개의 태스크 분석 완료. "
    summary += f"주요 작업 영역: {main_category} ({main_percentage}%). "
    if tech_counter:
        top_tech = tech_counter.most_common(1)[0][0]
        summary += f"가장 많이 사용된 기술: {top_tech}."
    
    return {
        "total_tasks": total_tasks,
        "tech_distribution": tech_distribution,
        "keywords": keywords,
        "task_categories": task_categories,
        "summary": summary
    }
