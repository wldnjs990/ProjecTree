// 메시지 타입
export interface ChatMessage {
    id: string;
    workspaceId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string; // ISO 8601 형식
    type: 'text' | 'image' | 'file' | 'system';
    isRead: boolean;
    readBy: string[]; // 읽은 사용자 ID 목록
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

// 워크스페이스 채팅방
export interface WorkspaceChatRoom {
    workspaceId: string;
    workspaceName: string;
    participants: ChatParticipant[];
    lastMessage?: ChatMessage;
    unreadCount: number;
    createdAt: string;
}

// Socket 이벤트 타입
export type SocketEvent =
    | 'chat:join' // 채팅방 입장
    | 'chat:leave' // 채팅방 퇴장
    | 'message:send' // 메시지 전송
    | 'message:receive' // 메시지 수신
    | 'message:read' // 메시지 읽음 처리
    | 'typing:start' // 타이핑 시작
    | 'typing:stop' // 타이핑 종료
    | 'user:online' // 사용자 온라인
    | 'user:offline' // 사용자 오프라인
    | 'error'; // 에러

// Socket 이벤트 페이로드
export interface MessageSendPayload {
    workspaceId: string;
    content: string;
    type: 'text' | 'image' | 'file';
}

export interface MessageReceivePayload {
    message: ChatMessage;
}

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
