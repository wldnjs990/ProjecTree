"""포트폴리오 생성 사용자 프롬프트 (동적 데이터 삽입)"""

PORTFOLIO_USER_PROMPT = """
아래 프로젝트 정보를 바탕으로 포트폴리오를 작성해주세요.

## 프로젝트 정보
- **프로젝트명**: {project_title}
- **프로젝트 설명**: {project_description}
- **프로젝트 기간**: {project_start_date} ~ {project_end_date}
- **프로젝트 기술 스택**: {project_tech_stack}
- **프로젝트 참여 인원**: {project_head_count}명

## 내가 수행한 태스크 목록
{formatted_tasks}

---
위 정보를 분석하고, 도구들을 활용하여 매력적인 포트폴리오를 작성해주세요.
"""


def format_tasks_for_prompt(user_tasks: list) -> str:
    """태스크 목록을 프롬프트용 문자열로 포맷팅"""
    if not user_tasks:
        return "- (수행한 태스크 없음)"
    
    formatted = []
    for i, task in enumerate(user_tasks, 1):
        task_str = f"### 태스크 {i}: {task.get('task_name', 'Unknown')}\n"
        task_str += f"- **설명**: {task.get('task_description', '')}\n"
        
        if task.get('task_note'):
            task_str += f"- **노트**: {task.get('task_note')}\n"
        
        tech = task.get('tech_stack')
        if tech:
            if isinstance(tech, dict):
                task_str += f"- **사용 기술**: {tech.get('name', 'Unknown')}\n"
                if tech.get('description'):
                    task_str += f"  - 설명: {tech.get('description')}\n"
            else:
                task_str += f"- **사용 기술**: {tech}\n"
        
        comparison = task.get('comparison')
        if comparison:
            task_str += f"- **기술 비교 분석**: {comparison}\n"
        
        formatted.append(task_str)
    
    return "\n".join(formatted)
