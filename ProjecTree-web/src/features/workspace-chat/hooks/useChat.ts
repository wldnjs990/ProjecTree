import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import { chatSocket } from '../services/chatSocket';
import { fetchMessages, fetchParticipants } from '@/apis/chat.api';
import { getWorkspaceDetail } from '@/apis/workspace.api';
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
  const pagination = useChatStore((state) => state.pagination);

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
      if (pagination.initialLoaded) return;

      try {
        setPaginationState({ isLoading: true });

        // 1. 워크스페이스 상세 정보 조회 (ChatRoomId 획득)
        const workspaceDetail = await getWorkspaceDetail(Number(workspaceId));
        let chatRoomId = '';

        if (workspaceDetail?.teamInfo?.chatRoomId) {
          chatRoomId = workspaceDetail.teamInfo.chatRoomId;
          useChatStore.getState().setChatRoomId(workspaceId, chatRoomId);
          console.log('✅ [useChat] ChatRoomId set:', chatRoomId);
        }

        // 2. 메시지 로드 (chatRoomId가 있을 때만 요청)
        let messages: any[] = [];
        if (chatRoomId) {
          try {
            const response = await fetchMessages(chatRoomId, {
              limit: CHAT_PAGINATION_CONFIG.initialLoad,
            });
            messages = response.data || [];
          } catch (e) {
            console.warn('[useChat] 메시지 로드 실패:', e);
          }
        }

        // response = { status: 'success', data: ChatMessage[] }
        useChatStore.getState().setMessages(workspaceId, messages);

        setPaginationState({
          hasMore: messages.length === CHAT_PAGINATION_CONFIG.initialLoad,
          isLoading: false,
          oldestLoadedId:
            messages.length > 0 ? messages[messages.length - 1].id : null,
          initialLoaded: true,
        });
      } catch (error) {
        console.warn('[useChat] 초기화 실패:', error);
        // 실패 시 빈 목록으로 초기화
        setPaginationState({
          hasMore: false,
          isLoading: false,
          oldestLoadedId: null,
          initialLoaded: true,
        });
      }
    };

    initializeChat();

    // 참여자 목록 로드 (API 사용)
    const loadParticipants = async () => {
      if (participants.length === 0) {
        try {
          // Store에서 chatRoomId 가져오기 (initializeChat이 설정했을 수 있음)
          // 하지만 비동기 이슈가 있을 수 있으므로, initializeChat 이후에 실행되거나
          // 여기서도 없으면 못 가져옴.
          // 일단 workspaceId로 chatRoomId를 조회하는 API가 따로 없으므로(getWorkspaceDetail 제외),
          // Store에 있는 것을 우선 시도.
          const chatRoomId = useChatStore.getState().chatRoomIds[workspaceId];

          if (!chatRoomId) return; // ChatRoomId 없으면 스킵

          const response = await fetchParticipants(chatRoomId);

          // response = { status: 'success', data: ChatParticipant[] }
          const participantsList = response.data || [];

          useChatStore
            .getState()
            .setParticipants(workspaceId, participantsList);
        } catch (error) {
          console.warn(
            '[useChat] 참여자 로드 실패 (API 없음 또는 에러):',
            error
          );
          // 실패 시 빈 목록 유지
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
