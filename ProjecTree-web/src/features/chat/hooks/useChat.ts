import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import { chatSocket } from '../services/chatSocket';
import { fetchMessages, fetchParticipants } from '@/apis/chat.api';
import { CHAT_PAGINATION_CONFIG } from '../types/mockData';

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
  const setPaginationState = useChatStore((state) => state.setPaginationState);

  useEffect(() => {
    // 현재 워크스페이스가 초기화되었는지 확인
    if (initializedRef.current === workspaceId) {
      return;
    }

    // 활성 워크스페이스 설정
    setActiveWorkspace(workspaceId);

    // 🆕 페이지네이션 기반 초기 로드 (API 사용)
    const initializeChat = async () => {
      try {
        const response = await fetchMessages(workspaceId, {
          limit: CHAT_PAGINATION_CONFIG.initialLoad,
        });

        // response = { status: 'success', data: ChatMessage[] }
        const initialMessages = response.data || [];

        useChatStore.getState().setMessages(workspaceId, initialMessages);

        // 페이지네이션 상태 초기화
        setPaginationState({
          hasMore:
            initialMessages.length === CHAT_PAGINATION_CONFIG.initialLoad,
          isLoading: false,
          oldestLoadedId:
            initialMessages[initialMessages.length - 1]?.id || null,
          initialLoaded: true,
        });
      } catch (error) {
        console.error('[useChat] 메시지 로드 실패:', error);
      }
    };

    initializeChat();

    // 참여자 목록 로드 (API 사용)
    const loadParticipants = async () => {
      if (participants.length === 0) {
        try {
          const response = await fetchParticipants(workspaceId);

          // response = { status: 'success', data: ChatParticipant[] }
          const participantsList = response.data || [];

          useChatStore
            .getState()
            .setParticipants(workspaceId, participantsList);
        } catch (error) {
          console.error('[useChat] 참여자 로드 실패:', error);
        }
      }
    };

    loadParticipants();

    initializedRef.current = workspaceId;
  }, [
    workspaceId,
    messages.length,
    participants.length,
    setActiveWorkspace,
    setPaginationState,
  ]);

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
