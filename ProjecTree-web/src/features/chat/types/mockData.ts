import type { ChatMessage, ChatParticipant } from './chat.types';

export const MOCK_MY_ID = 'temp_my_id';

export const getMockParticipants = (workspaceId: string): ChatParticipant[] => [
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

export const getMockMessages = (workspaceId: string): ChatMessage[] => [
  {
    id: 'msg-1',
    workspaceId,
    senderId: 'other-user-1',
    senderName: '김개발',
    senderAvatar: '',
    content: '백엔드 API 명세서 노드 구조 업데이트했습니다. 확인 부탁드려요!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'text',
    isRead: true,
    readBy: [],
  },
  {
    id: 'msg-2',
    workspaceId,
    senderId: MOCK_MY_ID,
    senderName: '나',
    content:
      '넵, User Auth 쪽 트리 구조가 좀 복잡해 보이는데 분리하는 게 좋지 않을까요?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'text',
    isRead: true,
    readBy: [],
  },
  {
    id: 'msg-3',
    workspaceId,
    senderId: 'other-user-2',
    senderName: '이기획',
    senderAvatar: '',
    content: '좋은 의견입니다. 일단 메인 기능 명세부터 확정 짓고 넘어갑시다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'text',
    isRead: true,
    readBy: [],
  },
];

export const MOCK_REPLIES = [
  '아, 그 부분 확인해 보겠습니다!',
  '좋은 생각이네요. 바로 반영할까요?',
  '지금 회의 중이라 끝나고 다시 말씀드릴게요.',
  '넵, 알겠습니다.',
  '혹시 관련해서 참고할만한 문서가 있을까요?',
];
