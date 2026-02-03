from langchain.tools import tool

@tool
def validate_description(description: str) -> str:
    """
    작성된 description의 글자 수(공백 포함)를 계산하여 1000자 제한 준수 여부를 검증합니다.
    검증 통과 시: 검증된 description을 그대로 반환합니다. 이 반환값을 최종 출력에 그대로 사용하세요.
    검증 실패 시: 오류 메시지를 반환합니다. 내용을 줄인 후 다시 검증하세요.
    """
    limit = 1000
    current_length = len(description)
    
    if current_length <= limit:
        # 검증 통과: description을 그대로 반환 (LLM이 이 값을 그대로 사용해야 함)
        return f"✅ 검증 통과 ({current_length}자/{limit}자). 아래 description을 최종 출력에 그대로 복사하세요:\n\n{description}"
    else:
        excess = current_length - limit
        return (f"❌ 검증 실패: 현재 {current_length}자로, 제한({limit}자)을 {excess}자 초과했습니다. "
                f"내용을 {excess + 100}자 이상 줄인 후 다시 검증하세요. 절대로 검증 없이 출력하지 마세요.")

@tool
def validate_summary(summary: str) -> str:
    """
    작성된 summary의 글자 수(공백 포함)를 계산하여 60자 제한 준수 여부를 검증합니다.
    검증 통과 시: 검증된 summary를 그대로 반환합니다. 이 반환값을 최종 출력에 그대로 사용하세요.
    검증 실패 시: 오류 메시지를 반환합니다. 내용을 줄인 후 다시 검증하세요.
    """
    limit = 60
    current_length = len(summary)
    
    if current_length <= limit:
        # 검증 통과: summary를 그대로 반환 (LLM이 이 값을 그대로 사용해야 함)
        return f"✅ 검증 통과 ({current_length}자/{limit}자). 아래 summary를 최종 출력에 그대로 복사하세요:\n\n{summary}"
    else:
        excess = current_length - limit
        return (f"❌ 검증 실패: 현재 {current_length}자로, 제한({limit}자)을 {excess}자 초과했습니다. "
                f"내용을 {excess + 10}자 이상 줄인 후 다시 검증하세요. 절대로 검증 없이 출력하지 마세요.")