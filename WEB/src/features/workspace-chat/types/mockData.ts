import type {
  ChatMessage,
  ChatParticipant,
  PaginationConfig,
} from './chat.types';

export const MOCK_MY_ID = 'temp_my_id';

// 페이지네이션 설정
export const CHAT_PAGINATION_CONFIG: PaginationConfig = {
  totalMessages: 100, // 전체 Mock 메시지 개수
  initialLoad: 20, // 초기 로드 개수
  loadMoreSize: 15, // 추가 로드 개수
  networkDelay: 300, // 네트워크 지연 시뮬레이션 (ms)
};

// 다양한 메시지 템플릿
const MESSAGE_TEMPLATES = [
  '회의 시간 조정 가능할까요?',
  '노드 구조 업데이트 완료했습니다.',
  '오늘 작업 진행 상황 공유드립니다.',
  '질문 있습니다!',
  '확인했습니다 👍',
  '백엔드 API 명세서 확인 부탁드려요.',
  '프론트엔드 컴포넌트 리팩토링 중입니다.',
  'User Auth 쪽 트리 구조가 복잡해 보이네요.',
  '좋은 의견입니다!',
  '메인 기능 명세부터 확정 짓고 넘어갑시다.',
  '테스트 코드 작성 완료했습니다.',
  '내일 스프린트 회의 있습니다.',
  'PR 리뷰 부탁드립니다.',
  '버그 수정 완료했어요.',
  '디자인 시안 공유드립니다.',
];

export const getMockParticipants = (
  _workspaceId: string
): ChatParticipant[] => [
  {
    id: MOCK_MY_ID,
    name: '나',
    email: 'me@dev.com',
    role: 'owner',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'other-user-1',
    name: '김개발',
    email: 'dev@dev.com',
    role: 'member',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'other-user-2',
    name: '이기획',
    email: 'pm@dev.com',
    role: 'member',
    isOnline: false,
    isTyping: false,
  },
];

// Mock 메시지 캐시 (워크스페이스별로 한 번만 생성)
const messageCache = new Map<string, ChatMessage[]>();

/**
 * 100개의 Mock 메시지를 자동 생성합니다.
 * 캐싱을 통해 같은 워크스페이스는 동일한 메시지를 반환합니다.
 */
export const generateMockMessages = (
  workspaceId: string,
  count: number = CHAT_PAGINATION_CONFIG.totalMessages
): ChatMessage[] => {
  // 캐시 확인
  const cacheKey = `${workspaceId}-${count}`;
  if (messageCache.has(cacheKey)) {
    return messageCache.get(cacheKey)!;
  }

  // 메시지 생성 (최신순 정렬)
  const messages = Array.from({ length: count }, (_, i) => {
    const messageIndex = count - i; // 100, 99, 98, ... 1
    const isMyMessage = messageIndex % 3 === 0;
    const otherUserId =
      messageIndex % 2 === 0 ? 'other-user-1' : 'other-user-2';
    const otherUserName = messageIndex % 2 === 0 ? '김개발' : '이기획';

    return {
      id: `msg-${messageIndex}`,
      workspaceId,
      senderId: isMyMessage ? MOCK_MY_ID : otherUserId,
      senderName: isMyMessage ? '나' : otherUserName,
      senderAvatar: isMyMessage ? undefined : '',
      content: MESSAGE_TEMPLATES[messageIndex % MESSAGE_TEMPLATES.length],
      timestamp: new Date(Date.now() - messageIndex * 60000).toISOString(), // 1분씩 과거
      type: 'text' as const,
    };
  });

  // 캐시 저장
  messageCache.set(cacheKey, messages);
  return messages;
};

/**
 * 커서 기반 페이지네이션 API를 시뮬레이션합니다.
 * @param workspaceId - 워크스페이스 ID
 * @param options - 페이지네이션 옵션
 * @param options.before - 커서 (이 메시지 ID 이전의 메시지를 가져옴)
 * @param options.limit - 가져올 메시지 개수
 */
export const mockFetchMessages = async (
  workspaceId: string,
  options: { before?: string; limit: number }
): Promise<ChatMessage[]> => {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, CHAT_PAGINATION_CONFIG.networkDelay)
  );

  const allMessages = generateMockMessages(workspaceId);

  // 초기 로드 (before 없음)
  if (!options.before) {
    return allMessages.slice(0, options.limit);
  }

  // 커서 기반 페이지네이션
  const beforeIndex = allMessages.findIndex((m) => m.id === options.before);
  if (beforeIndex === -1) {
    return []; // 커서를 찾을 수 없음
  }

  // before 이후의 메시지 반환
  const start = beforeIndex + 1;
  const end = start + options.limit;
  return allMessages.slice(start, end);
};

/**
 * 기존 호환성을 위한 함수 (deprecated)
 * @deprecated generateMockMessages 사용을 권장합니다.
 */
export const getMockMessages = (workspaceId: string): ChatMessage[] => {
  return generateMockMessages(workspaceId, 3); // 기존처럼 3개만 반환
};
