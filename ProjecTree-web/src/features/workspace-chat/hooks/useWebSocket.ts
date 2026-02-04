import { useAuthStore } from '@/shared/stores/authStore';
import { useUserStore } from '@/shared/stores/userStore';
import { useEffect, useCallback } from 'react';
import { chatSocket } from '../services/chatSocket';
import { useChatStore } from '../store/chatStore';
import type {
  ChatMessage,
  TypingPayload,
  UserStatusPayload,
} from '../types/chat.types';

export const useWebSocket = (workspaceId: string | null) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const updateParticipantStatus = useChatStore(
    (state) => state.updateParticipantStatus
  );
  const setConnected = useChatStore((state) => state.setConnected);
  // chatRoomId 가져오기
  const chatRoomId = useChatStore((state) =>
    workspaceId ? state.chatRoomIds[workspaceId] : null
  );

  // WebSocket 연결
  useEffect(() => {
    // 실제 JWT 토큰 가져오기 (AuthStore)
    const token = useAuthStore.getState().accessToken || '';

    const socket = chatSocket.connect(token);

    // 연결 상태 업데이트
    socket.on('connect', () => {
      // workspaceId가 있더라도 chatRoomId가 아직 없을 수 있음 (비동기 로드)
      // chatRoomId가 생기면 아래 useEffect에서 join함
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      chatSocket.disconnect();
      setConnected(false);
    };
  }, [setConnected]);

  // 채팅방 입장/퇴장 (chatRoomId 변경 시)
  useEffect(() => {
    if (!chatRoomId) return;

    console.log(
      `🔄 [useWebSocket] Attempting to join chat room: ${chatRoomId}`
    );
    chatSocket.joinChatRoom(chatRoomId);
    console.log(`📡 [useWebSocket] Join event emitted for: ${chatRoomId}`);

    return () => {
      chatSocket.leaveChatRoom(chatRoomId);
    };
  }, [chatRoomId]);

  // 이벤트 리스너 등록
  useEffect(() => {
    if (!workspaceId) return;

    // 메시지 수신
    // 백엔드 MessageReceive DTO: { id, chatRoomId, senderId, senderName, content, timestamp }
    const handleMessageReceive = (data: any) => {
      console.log('📨 [useWebSocket] Message received (Raw):', data);

      // 데이터 매핑 (Backend -> Frontend)
      // 백엔드는 data 자체가 메시지 객체일 가능성이 높음 (또는 data.data)
      const rawMsg = data.message || data;

      const newMessage: ChatMessage = {
        id: rawMsg.id?.toString() || Date.now().toString(),
        workspaceId: workspaceId, // 현재 보고 있는 워크스페이스 ID 주입
        senderId: rawMsg.senderId?.toString() || 'unknown',
        senderName: rawMsg.senderName || 'Unknown',
        content: rawMsg.content || '',
        timestamp: rawMsg.timestamp || new Date().toISOString(),
        type: 'text',
        // senderAvatar: ... // 백엔드에서 안 주면 없음
      };

      console.log('✨ [useWebSocket] Mapped Message:', newMessage);
      addMessage(workspaceId, newMessage);
    };

    // 타이핑 시작
    const handleTypingStart = (data: any) => {
      console.log('⌨️ [useWebSocket] Typing Start:', data);
      // memberId 안전하게 변환
      const memberId = data.memberId?.toString() || data.userId?.toString();

      // 내 자신의 타이핑 이벤트는 무시
      const currentUser = useUserStore.getState().user;
      const currentUserId =
        currentUser?.memberId?.toString() ||
        currentUser?.id?.toString() ||
        currentUser?.email;

      if (memberId === currentUserId) return;

      if (data.workspaceId === workspaceId || data.chatRoomId === chatRoomId) {
        setTyping(workspaceId, memberId, true);
      }
    };

    // 타이핑 종료
    const handleTypingStop = (data: any) => {
      // console.log('xxxx [useWebSocket] Typing Stop:', data);
      const memberId = data.memberId?.toString() || data.userId?.toString();

      // 내 자신의 타이핑 이벤트는 무시
      const currentUser = useUserStore.getState().user;
      const currentUserId =
        currentUser?.memberId?.toString() ||
        currentUser?.id?.toString() ||
        currentUser?.email;

      if (memberId === currentUserId) return;

      if (data.workspaceId === workspaceId || data.chatRoomId === chatRoomId) {
        setTyping(workspaceId, memberId, false);
      }
    };

    // 사용자 온라인 상태
    const handleUserOnline = (data: UserStatusPayload) => {
      updateParticipantStatus(data.userId, true);
    };

    const handleUserOffline = (data: UserStatusPayload) => {
      updateParticipantStatus(data.userId, false);
    };

    // 에러 처리
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (error: any) => {
      console.error('Socket error:', error);
    };

    chatSocket.on('message:receive', handleMessageReceive);
    chatSocket.on('typing:start', handleTypingStart);
    chatSocket.on('typing:stop', handleTypingStop);
    chatSocket.on('user:online', handleUserOnline);
    chatSocket.on('user:offline', handleUserOffline);
    chatSocket.on('error', handleError);

    return () => {
      chatSocket.off('message:receive', handleMessageReceive);
      chatSocket.off('typing:start', handleTypingStart);
      chatSocket.off('typing:stop', handleTypingStop);
      chatSocket.off('user:online', handleUserOnline);
      chatSocket.off('user:offline', handleUserOffline);
      chatSocket.off('error', handleError);
    };
  }, [workspaceId, chatRoomId, addMessage, setTyping, updateParticipantStatus]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string) => {
      if (!chatRoomId || !content.trim()) return;
      chatSocket.sendMessage(chatRoomId, content.trim());
    },
    [chatRoomId]
  );

  // 타이핑 시작
  const startTyping = useCallback(() => {
    if (!chatRoomId) return;
    const user = useUserStore.getState().user;
    if (user) {
      chatSocket.startTyping(
        chatRoomId,
        user.memberId?.toString() || user.id?.toString() || '',
        user.nickname || user.name
      );
    }
  }, [chatRoomId]);

  // 타이핑 종료
  const stopTyping = useCallback(() => {
    if (!chatRoomId) return;
    const user = useUserStore.getState().user;
    if (user) {
      chatSocket.stopTyping(
        chatRoomId,
        user.memberId?.toString() || user.id?.toString() || ''
      );
    }
  }, [chatRoomId]);

  return {
    sendMessage,
    startTyping,
    stopTyping,
    isConnected: useChatStore((state) => state.isConnected),
  };
};
