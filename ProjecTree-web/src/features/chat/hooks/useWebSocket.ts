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
  const setActiveWorkspace = useChatStore((state) => state.setActiveWorkspace);

  // Store actions are stable, but we can verify this by not including them in dependency arrays or wrapping them if needed.
  // Zustand actions are stable by identity.

  // WebSocket 연결
  useEffect(() => {
    //TODO: 실제 JWT 토큰 가져오기 (예: localStorage, Context 등)
    const token = localStorage.getItem('authToken') || '';

    const socket = chatSocket.connect(token);

    // 연결 상태 업데이트
    socket.on('connect', () => {
      if (workspaceId) chatSocket.joinWorkspace(workspaceId);
      else throw new Error('Workspace ID 가 등록되지 않았습니다.');
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

  // 워크스페이스 입장/퇴장
  useEffect(() => {
    if (!workspaceId) return;
    // setActiveWorkspace(workspaceId);

    return () => {
      chatSocket.leaveWorkspace(workspaceId);
      // 언마운트 시 setActiveWorkspace(null)을 호출하면,
      // 워크스페이스 변경 시 (A -> B) A해제(null) -> B설정(id) 과정에서 불필요한 업데이트가 발생할 수 있음.
      // 여기서는 cleanup에서 state를 초기화하지 않거나, 신중하게 처리해야 함.
      // setActiveWorkspace(null); // 주석 처리하여 테스트
    };
    // setActiveWorkspace is stable from zustand
  }, [workspaceId]);

  // 이벤트 리스너 등록
  useEffect(() => {
    if (!workspaceId) return;

    // 메시지 수신
    const handleMessageReceive = (data: { message: ChatMessage }) => {
      console.log('📨 [useWebSocket] Message received:', data.message);
      addMessage(workspaceId, data.message);
    };

    // 타이핑 시작
    const handleTypingStart = (data: TypingPayload) => {
      if (data.workspaceId === workspaceId) {
        setTyping(workspaceId, data.userId, true);
      }
    };

    // 타이핑 종료
    const handleTypingStop = (data: TypingPayload) => {
      if (data.workspaceId === workspaceId) {
        setTyping(workspaceId, data.userId, false);
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
  }, [workspaceId, addMessage, setTyping, updateParticipantStatus]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string) => {
      if (!workspaceId || !content.trim()) return;
      chatSocket.sendMessage(workspaceId, content.trim());
    },
    [workspaceId]
  );

  // 타이핑 시작
  const startTyping = useCallback(() => {
    if (!workspaceId) return;
    chatSocket.startTyping(workspaceId);
  }, [workspaceId]);

  // 타이핑 종료
  const stopTyping = useCallback(() => {
    if (!workspaceId) return;
    chatSocket.stopTyping(workspaceId);
  }, [workspaceId]);

  return {
    sendMessage,
    startTyping,
    stopTyping,
    isConnected: useChatStore((state) => state.isConnected),
  };
};
