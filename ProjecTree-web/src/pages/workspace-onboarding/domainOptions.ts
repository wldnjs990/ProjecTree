// 도메인 옵션 상수
export const DOMAIN_OPTIONS = [
  '여행',
  '전자상거래',
  '교육',
  '소셜미디어',
  'AI/ML',
  '헬스케어',
  '금융',
  '게임',
  '생산성/협업',
  '부동산/주거',
  '음식/배달',
  '모빌리티',
  '기타',
] as const;

export type DomainOption = (typeof DOMAIN_OPTIONS)[number];
