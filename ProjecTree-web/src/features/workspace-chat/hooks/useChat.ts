import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import { chatSocket } from '../services/chatSocket';
// import { fetchMessages, fetchParticipants } from '@/apis/chat.api';
import { useUserStore } from '@/shared/stores/userStore';
import { useWorkspaceStore } from '@/features/workspace-core';
import { useAuthStore } from '@/shared/stores/authStore';

export const useChat = (workspaceId: string) => {
  const { startTyping, stopTyping, isConnected } = useWebSocket(workspaceId);

  // ... (sendMessage logic remains)

  // 🛠️ User ID Repair Logic (JWT fallback)
  // userStore에 ID가 없는 경우(API 응답 누락 등) 토큰에서 강제로 복구
  useEffect(() => {
    const user = useUserStore.getState().user;

    // ID가 마땅히 없으면 (memberId도 없고 id도 없으면)
    if (user && !user.memberId && !user.id) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        try {
          // JWT 파싱
          const payload = token.split('.')[1];
          const decoded = JSON.parse(
            atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
          );

          // ID 추출 (sub, memberId, userId 등)
          const extractedId =
            decoded.memberId || decoded.sub || decoded.userId || decoded.id;

          if (extractedId) {
            useUserStore.getState().setUser({
              ...user,
              memberId: Number(extractedId), // 숫자로 변환 시도
              id: Number(extractedId),
            });
          }
        } catch (e) {
        }
      }
    }
  }, []);

  const sendMessage = (content: string) => {
    if (!workspaceId || !content.trim()) return;

    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = useUserStore.getState().user;

    if (!currentUser) return;

    // workspaceId가 아니라 실제 chatRoomId를 사용해야 함
    const chatRoomId =
      useWorkspaceStore.getState().workspaceDetail?.teamInfo?.chatRoomId;
    if (chatRoomId) {
      chatSocket.sendMessage(chatRoomId, content.trim());
    } else {
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

  // Workspace Detail 구독 (Reactive)
  const workspaceDetail = useWorkspaceStore((state) => state.workspaceDetail);

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
    if (initializedRef.current === workspaceId && workspaceDetail) {
      // workspaceDetail이 변경되었을 수도 있으므로 체크 필요하면 여기서
    }

    // 활성 워크스페이스 설정
    setActiveWorkspace(workspaceId);

    // 🆕 페이지네이션 기반 초기 로드 (API 사용)
    const initializeChat = async () => {
      // workspaceDetail이 없으면 대기 (Re-render 될 때 다시 실행됨)
      if (!workspaceDetail) {
        return;
      }


      // chatRoomId 설정
      let chatRoomId = '';
      if (workspaceDetail.teamInfo?.chatRoomId) {
        chatRoomId = workspaceDetail.teamInfo.chatRoomId;
        useChatStore.getState().setChatRoomId(workspaceId, chatRoomId);
      } else {
        return;
      }

      if (pagination.initialLoaded) return;

      try {
        setPaginationState({ isLoading: true });

        // 2. 메시지 로드 (WebSocket chat:history 이벤트로 처리됨)
        let messages: any[] = [];
        // if (chatRoomId) {
        //   try {
        //     const response = await fetchMessages(chatRoomId, {
        //       limit: CHAT_PAGINATION_CONFIG.initialLoad,
        //     });
        //     messages = response.data || [];
        //   } catch (e) {
        //   }
        // }

        // 빈 배열로 초기화, 실제 메시지는 WebSocket chat:history에서 로드
        useChatStore.getState().setMessages(workspaceId, messages);

        // initialLoaded는 WebSocket chat:history 이벤트에서 true로 설정됨
        setPaginationState({
          hasMore: false,
          isLoading: false,
          oldestLoadedId: null,
          initialLoaded: false, // WebSocket에서 설정
        });
      } catch (error) {
        setPaginationState({
          hasMore: false,
          isLoading: false,
          oldestLoadedId: null,
          initialLoaded: false,
        });
      }
    };

    initializeChat();

    // 참여자 목록 로드 (workspaceDetail 기반으로 초기화)
    const loadParticipants = () => {
      // 이미 로드되었으면 패스 (단, workspaceDetail이 업데이트되었을 수 있으므로 체크)
      if (participants.length > 0) return;

      const memberInfos = workspaceDetail?.teamInfo?.memberInfos;
      if (memberInfos) {

        const mappedParticipants: any[] = memberInfos.map((m: any) => {
          // Safety check for ID
          const rawId = m.memberId || m.member_id || m.id;
          const safeId = rawId ? rawId.toString() : `unknown-${Math.random()}`;

          // 현재 사용자인 경우 userStore의 최신 닉네임 사용
          const currentUser = useUserStore.getState().user;
          const isMe =
            currentUser &&
            (currentUser.memberId?.toString() === safeId ||
              currentUser.id?.toString() === safeId ||
              currentUser.email === m.email);

          const finalName = isMe
            ? currentUser.nickname || currentUser.name
            : m.nickname || m.name || 'Unknown';

          return {
            id: safeId,
            name: finalName, // 현재 사용자는 userStore 닉네임 우선
            email: m.email || '',
            role:
              m.role === 'OWNER'
                ? 'owner'
                : m.role === 'EDITOR'
                  ? 'admin'
                  : 'member',
            isOnline: false, // 초기값 false, 소켓으로 업데이트
            isTyping: false,
          };
        });

        useChatStore
          .getState()
          .setParticipants(workspaceId, mappedParticipants);
      }
    };

    loadParticipants();

    // workspaceDetail이 로드 완료된 경우에만 initialized 처리
    if (workspaceDetail) {
      initializedRef.current = workspaceId;
    }
  }, [
    workspaceId,
    messages.length,
    participants.length,
    setActiveWorkspace,
    setPaginationState,
    workspaceDetail, // 의존성 추가: 이게 바뀌면 다시 실행됨
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
