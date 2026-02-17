export const DOMAIN_OPTIONS = [
    'AI/ML',
    '게임',
    '교육',
    '금융',
    '모빌리티',
    '부동산/주거',
    '생산성/협업',
    '소셜미디어',
    '여행',
    '음식/배달',
    '전자상거래',
    '헬스케어',
    '기타',
].sort((a, b) => {
    if (a === '기타') return 1;
    if (b === '기타') return -1;
    return a.localeCompare(b, 'ko');
});

export type DomainOption = (typeof DOMAIN_OPTIONS)[number];
