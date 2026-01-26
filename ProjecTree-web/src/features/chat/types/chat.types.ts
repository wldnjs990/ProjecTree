// 메시지 타입
export interface ChatMessage {
  id: string;
  workspaceId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string; // ISO 8601 형식
  type: 'text';
}

// 참여자 정보
export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  isOnline: boolean;
  isTyping: boolean;
  lastSeen?: string;
}

// Socket 이벤트 페이로드
export interface TypingPayload {
  workspaceId: string;
  userId: string;
  userName: string;
}

export interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
}

// 채팅 상태
export interface ChatState {
  // 메시지
  messages: Record<string, ChatMessage[]>; // workspaceId를 키로 사용

  // 참여자
  participants: Record<string, ChatParticipant[]>;

  // 현재 활성 워크스페이스
  activeWorkspaceId: string | null;

  // 타이핑 중인 사용자
  typingUsers: Record<string, string[]>; // workspaceId -> userIds

  // 읽지 않은 메시지 수
  unreadCounts: Record<string, number>;

  // 연결 상태
  isConnected: boolean;

  // 액션
  addMessage: (workspaceId: string, message: ChatMessage) => void;
  setMessages: (workspaceId: string, messages: ChatMessage[]) => void;
  markAsRead: (workspaceId: string, messageIds: string[]) => void;
  setParticipants: (
    workspaceId: string,
    participants: ChatParticipant[]
  ) => void;
  updateParticipantStatus: (userId: string, isOnline: boolean) => void;
  setTyping: (workspaceId: string, userId: string, isTyping: boolean) => void;
  setActiveWorkspace: (workspaceId: string | null) => void;
  setConnected: (isConnected: boolean) => void;
  clearWorkspaceMessages: (workspaceId: string) => void;
}
