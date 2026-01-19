from langchain_core.prompts import ChatPromptTemplate

integrator_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "당신은 기술 컨설턴트입니다. 다음 기술들을 비교하고, 프로젝트에 가장 적합한 기술을 추천하는 통찰력 있는 짧은 코멘트를 작성하세요. 한국어로 답변하세요.",
        ),
        ("human", "Project Spec: {spec}\n\nRecommended Techs: {techs}"),
    ]
)
