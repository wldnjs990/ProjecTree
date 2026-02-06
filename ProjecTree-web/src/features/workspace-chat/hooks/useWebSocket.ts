import { useAuthStore } from '@/shared/stores/authStore';
import { useUserStore } from '@/shared/stores/userStore';
import { useEffect, useCallback } from 'react';
import { chatSocket } from '../services/chatSocket';
import { useChatStore } from '../store/chatStore';
import type { ChatMessage, UserStatusPayload } from '../types/chat.types';

import { useWorkspaceStore } from '@/features/workspace-core';

export const useWebSocket = (workspaceId: string | null) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  const updateParticipantStatus = useChatStore(
    (state) => state.updateParticipantStatus
  );
  const setConnected = useChatStore((state) => state.setConnected);
  // chatRoomId 가져오기
  const chatRoomId = useWorkspaceStore(
    (state) => state.workspaceDetail?.teamInfo?.chatRoomId
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

    socket.on('disconnect', (ev) => {
      console.log('왜 꺼짐?', ev);
      setConnected(false);
    });

    return () => {
      chatSocket.disconnect();
      setConnected(false);
    };
  }, []);

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
    // 메시지 매핑 헬퍼
    const mapToChatMessage = (raw: any): ChatMessage => {
      const rawMsg = raw.message || raw;
      return {
        id: rawMsg.id?.toString() || Date.now().toString(),
        workspaceId: workspaceId,
        senderId:
          rawMsg.senderId?.toString() ||
          rawMsg.sender_id?.toString() ||
          rawMsg.memberId?.toString() ||
          rawMsg.member_id?.toString() ||
          rawMsg.userId?.toString() ||
          rawMsg.user_id?.toString() ||
          rawMsg.sender?.id?.toString() ||
          rawMsg.sender?.memberId?.toString() ||
          rawMsg.member?.id?.toString() ||
          'unknown',
        senderName:
          rawMsg.senderName ||
          rawMsg.sender_name ||
          rawMsg.nickname ||
          rawMsg.name ||
          rawMsg.sender?.name ||
          rawMsg.sender?.nickname ||
          rawMsg.member?.name ||
          'Unknown',
        content: rawMsg.content || '',
        timestamp:
          rawMsg.timestamp || rawMsg.created_at || new Date().toISOString(),
        type: 'text',
      };
    };

    // 메시지 수신
    const handleMessageReceive = (data: any) => {
      console.log('📨 [useWebSocket] Message received (Raw):', data);
      const newMessage = mapToChatMessage(data);
      console.log('✨ [useWebSocket] Mapped Message:', newMessage);
      addMessage(workspaceId, newMessage);
    };

    // 타이핑 시작
    const handleTypingStart = (data: any) => {
      // 0. 데이터 구조 유연하게 처리
      const payload = data.data || data.message || data;

      // 1. 이벤트에서 유저 ID 추출 (다양한 필드 체크)
      const eventUserId =
        payload.memberId?.toString() ||
        payload.userId?.toString() ||
        payload.senderId?.toString() ||
        payload.sender_id?.toString() ||
        payload.user_id?.toString() ||
        payload.member_id?.toString() ||
        '';

      // 2. 로컬 유저 ID 추출
      const currentUser = useUserStore.getState().user;
      const localUserId =
        currentUser?.memberId?.toString() ||
        currentUser?.id?.toString() ||
        currentUser?.email ||
        '';

      // 3. 유효성 검사 (ID가 없으면 무시 - 서버 이슈로 경고 생략)
      if (!eventUserId) {
        return;
      }

      // 4. ID 비교 (내 이벤트면 무시)
      if (localUserId && eventUserId === localUserId) {
        return;
      }

      // 5. 라우팅 체크
      const targetChatRoomId =
        payload.chatRoomId?.toString() || data.chatRoomId?.toString();
      const targetWorkspaceId =
        payload.workspaceId?.toString() || data.workspaceId?.toString();
      const currentWorkspaceIdStr = workspaceId?.toString();
      const currentChatRoomIdStr = chatRoomId?.toString();

      const isRoutingMatch =
        (targetWorkspaceId && targetWorkspaceId === currentWorkspaceIdStr) ||
        (targetChatRoomId && targetChatRoomId === currentChatRoomIdStr) ||
        (!targetWorkspaceId && !targetChatRoomId);

      if (isRoutingMatch) {
        setTyping(workspaceId, eventUserId, true);
      }
    };

    // 타이핑 종료
    const handleTypingStop = (data: any) => {
      const payload = data.data || data.message || data;

      const eventUserId =
        payload.memberId?.toString() ||
        payload.userId?.toString() ||
        payload.senderId?.toString() ||
        payload.sender_id?.toString() ||
        payload.user_id?.toString() ||
        payload.member_id?.toString() ||
        '';

      const currentUser = useUserStore.getState().user;
      const localUserId =
        currentUser?.memberId?.toString() ||
        currentUser?.id?.toString() ||
        currentUser?.email ||
        '';

      if (!eventUserId) return;

      if (localUserId && eventUserId === localUserId) {
        return;
      }

      const targetChatRoomId = payload.chatRoomId || data.chatRoomId;
      const targetWorkspaceId = payload.workspaceId || data.workspaceId;

      const isRoutingMatch =
        (targetWorkspaceId && targetWorkspaceId === workspaceId) ||
        (targetChatRoomId && targetChatRoomId === chatRoomId) ||
        (!targetWorkspaceId && !targetChatRoomId);

      if (isRoutingMatch) {
        setTyping(workspaceId, eventUserId, false);
      }
    };

    // 사용자 온라인 상태
    const handleUserOnline = (data: UserStatusPayload) => {
      updateParticipantStatus(data.userId, true);
    };

    const handleUserOffline = (data: UserStatusPayload) => {
      updateParticipantStatus(data.userId, false);
    };

    const handleChatHistory = (data: any) => {
      console.log('📨 [useWebSocket] Chat history:', data);
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const msg = mapToChatMessage(item);
          addMessage(workspaceId, msg);
        });
      } else {
        const msg = mapToChatMessage(data);
        addMessage(workspaceId, msg);
      }
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
    chatSocket.on('chat:history', handleChatHistory);
    chatSocket.on('error', handleError);

    return () => {
      chatSocket.off('message:receive', handleMessageReceive);
      chatSocket.off('typing:start', handleTypingStart);
      chatSocket.off('typing:stop', handleTypingStop);
      chatSocket.off('user:online', handleUserOnline);
      chatSocket.off('user:offline', handleUserOffline);
      chatSocket.off('chat:history', handleChatHistory);
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
