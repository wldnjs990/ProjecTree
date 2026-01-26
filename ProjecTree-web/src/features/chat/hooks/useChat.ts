import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import { chatSocket } from '../services/chatSocket';
import { getMockMessages, getMockParticipants } from '../types/mockData';

export const useChat = (workspaceId: string) => {
  const { startTyping, stopTyping, isConnected } = useWebSocket(workspaceId);

  const sendMessage = (content: string) => {
    if (!workspaceId || !content.trim()) return;

    // 소켓 전송 시도 (연결 안 되어 있어도 시뮬레이션 로직이 작동함)
    chatSocket.sendMessage(workspaceId, content.trim());
  };

  // Stable empty array to prevent new reference on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const EMPTY_ARRAY: any[] = [];

  const messages = useChatStore(
    (state) => state.messages[workspaceId] ?? EMPTY_ARRAY
  );
  const participants = useChatStore(
    (state) => state.participants[workspaceId] ?? EMPTY_ARRAY
  );
  const typingUsers = useChatStore(
    (state) => state.typingUsers[workspaceId] ?? EMPTY_ARRAY
  );
  const unreadCount = useChatStore(
    (state) => state.unreadCounts[workspaceId] || 0
  );

  //TODO: 메시지 히스토리 로드 (REST API)
  useEffect(() => {
    // fetchMessageHistory(workspaceId);
  }, [workspaceId]);

  // FIXME: UI 테스트를 위한 더미 데이터 주입 (백엔드 연동 시 제거)
  const initializedRef = useRef<string | null>(null);

  const setActiveWorkspace = useChatStore((state) => state.setActiveWorkspace);

  useEffect(() => {
    // 현재 워크스페이스가 초기화되었는지 확인
    if (initializedRef.current === workspaceId) return;

    // 활성 워크스페이스 설정
    setActiveWorkspace(workspaceId);

    // 이미 메시지가 있으면 스튜디오 설정에 따라 스킵할 수도 있으나,
    // 여기서는 워크스페이스가 바뀔 때마다 초기화되지 않았다면 넣어줌
    if (messages.length === 0) {
      useChatStore
        .getState()
        .setMessages(workspaceId, getMockMessages(workspaceId));
    }

    if (participants.length === 0) {
      useChatStore
        .getState()
        .setParticipants(workspaceId, getMockParticipants(workspaceId));
    }

    initializedRef.current = workspaceId;
  }, [workspaceId, messages.length, participants.length, setActiveWorkspace]);

  return {
    messages,
    participants,
    typingUsers,
    unreadCount,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
  };
};
