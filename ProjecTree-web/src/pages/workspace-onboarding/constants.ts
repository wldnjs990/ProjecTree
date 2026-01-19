// 온보딩 페이지에서 사용하는 모든 텍스트 상수

export const ONBOARDING_TEXTS = {
  // 페이지 제목
  pageTitle: '워크스페이스 생성 온보딩',

  // 단계별 정보
  steps: [
    {
      number: 1,
      label: '기본 정보',
      title: '워크스페이스 기본 설정',
      description: 'AI가 정보를 바탕으로 프로젝트를 분석합니다',
    },
    {
      number: 2,
      label: '주제 및 기간',
      title: '주제 및 일정',
      description: '프로젝트 주제와 예상 기간을 입력하세요',
    },
    {
      number: 3,
      label: '기술 스택',
      title: '사용할 기술 스택',
      description: '사용 예정인 기술을 선택해주세요 (다중 선택 가능)',
    },
    {
      number: 4,
      label: '팀 및 에픽',
      title: '팀 및 에픽',
      description: '팀원을 초대하고 초기 에픽을 설정하세요',
    },
  ],

  // 버튼 텍스트
  buttons: {
    prev: '이전',
    next: '다음',
    submit: '워크스페이스 시작',
  },

  // 로딩 화면
  loading: {
    title: 'AI가 프로젝트를 분석 중입니다...',
    description: '에픽과 하위 태스크를 생성하고 있습니다.',
  },
} as const;

// 타입 추론을 위한 타입 export
export type OnboardingStep = (typeof ONBOARDING_TEXTS.steps)[number];
