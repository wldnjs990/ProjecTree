import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import { chatSocket } from '../services/chatSocket';
import { fetchMessages, fetchParticipants } from '@/apis/chat.api';
import { CHAT_PAGINATION_CONFIG } from '../types/mockData';
import { useUserStore } from '@/shared/stores/userStore';
import { useWorkspaceStore } from '@/features/workspace-core';

export const useChat = (workspaceId: string) => {
  const { startTyping, stopTyping, isConnected } = useWebSocket(workspaceId);

  const sendMessage = (content: string) => {
    if (!workspaceId || !content.trim()) return;

    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = useUserStore.getState().user;
    console.log('[DEBUG] sendMessage currentUser:', currentUser);

    if (!currentUser) return;

    // 1. 소켓 전송
    // workspaceId가 아니라 실제 chatRoomId를 사용해야 함
    const chatRoomId = useChatStore.getState().chatRoomIds[workspaceId];
    if (chatRoomId) {
      chatSocket.sendMessage(chatRoomId, content.trim());
    } else {
      console.warn(
        '[useChat] Sending message failed: chatRoomId not found for workspace',
        workspaceId
      );
      // Fallback or return? user interaction implies we should try or fail visible?
      // For now, attempting with workspaceId might be better than nothing, OR just log error.
      // Given the logic, chatRoomId is required.
      return;
    }

    // 2. Optimistic Update (내 화면에 즉시 추가)
    // 백엔드에서 보낸 사람에게는 브로드캐스트를 안 하므로 직접 추가해야 함
    const optimisticMessage: any = {
      id: Date.now().toString(), // 임시 ID
      workspaceId,
      // ChatMessageItem 로직과 일치시킴
      senderId:
        currentUser.memberId?.toString() ||
        currentUser.id?.toString() ||
        currentUser.email ||
        'unknown',
      senderName: currentUser.nickname || currentUser.name || 'Unknown',
      // senderAvatar: currentUser.profileImage || undefined,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    useChatStore.getState().addMessage(workspaceId, optimisticMessage);
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

        // 1. 워크스페이스 상세 정보는 이미 Store에 로드되어 있다고 가정 (WorkSpacePage에서 처리)
        // Store에서 데이터 가져오기
        const workspaceStore = useWorkspaceStore.getState();
        const workspaceDetail = workspaceStore.workspaceDetail;

        console.log(
          '📦 [useChat] Getting workspace detail from STORE:',
          workspaceDetail
        );

        let chatRoomId = '';

        if (workspaceDetail?.teamInfo?.chatRoomId) {
          chatRoomId = workspaceDetail.teamInfo.chatRoomId;
          useChatStore.getState().setChatRoomId(workspaceId, chatRoomId);
          console.log('✅ [useChat] ChatRoomId set in store:', chatRoomId);
        } else {
          // 아직 로드되지 않았거나 없을 수 있음.
          // 만약 WorkSpacePage가 먼저 실행되었다면 있어야 함.
          // 여기서 없으면, WorkSpacePage의 로딩을 기다려야 할 수도 있음.
          // 일단은 없으면 패스 (이후 useEffect 의존성 등으로 다시 시도하게 하거나 해야 함)
          console.warn(
            '⚠️ [useChat] chatRoomId not found workspaceDetail (might be loading or empty):',
            workspaceDetail
          );

          // Retry logic needed? Or assume it will re-render if we subscribe?
          // For now, if null, we just stop here.
        }

        // 2. 메시지 로드 (chatRoomId가 있을 때만 요청)
        let messages: any[] = [];
        // if (chatRoomId) {
        //   try {
        //     const response = await fetchMessages(chatRoomId, {
        //       limit: CHAT_PAGINATION_CONFIG.initialLoad,
        //     });
        //     messages = response.data || [];
        //   } catch (e) {
        //     console.warn('[useChat] 메시지 로드 실패:', e);
        //   }
        // }

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
