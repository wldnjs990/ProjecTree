import { create } from 'zustand';
import type {
  ChatState,
  ChatMessage,
  ChatParticipant,
} from '../types/chat.types';
import { CHAT_PAGINATION_CONFIG } from '../types/mockData';
import { fetchMessages } from '@/apis';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  participants: {},
  activeWorkspaceId: null,
  chatRoomIds: {}, // 워크스페이스 ID -> 채팅방 ID 매핑
  typingUsers: {},
  unreadCounts: {},
  isConnected: false,

  // 페이지네이션 상태 초기화
  pagination: {
    hasMore: true,
    isLoading: false,
    oldestLoadedId: null,
    initialLoaded: false,
  },

  // 메시지 추가
  addMessage: (workspaceId: string, message: ChatMessage) => {
    set((state) => {
      const currentMessages = state.messages[workspaceId] || [];
      // 중복 체크
      if (currentMessages.some((m) => m.id === message.id)) {
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [workspaceId]: [...currentMessages, message],
        },
      };
    });

    // 현재 활성 워크스페이스가 아니면 읽지 않은 메시지 카운트 증가
    const { activeWorkspaceId } = get();
    if (activeWorkspaceId !== workspaceId) {
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [workspaceId]: (state.unreadCounts[workspaceId] || 0) + 1,
        },
      }));
    }
  },

  // 메시지 목록 설정 (히스토리 로드 시)
  setMessages: (workspaceId: string, messages: ChatMessage[]) => {
    set((state) => {
      // Map을 사용하여 ID 중복 제거
      const messageMap = new Map();
      messages.forEach((m) => messageMap.set(m.id, m));

      return {
        messages: {
          ...state.messages,
          [workspaceId]: Array.from(messageMap.values()),
        },
      };
    });
  },

  // 메시지 읽음 처리 (카운트만 감소)
  markAsRead: (workspaceId: string, messageIds: string[]) => {
    set((state) => {
      return {
        unreadCounts: {
          ...state.unreadCounts,
          [workspaceId]: Math.max(
            0,
            (state.unreadCounts[workspaceId] || 0) - messageIds.length
          ),
        },
      };
    });
  },

  // 참여자 목록 설정
  setParticipants: (workspaceId: string, participants: ChatParticipant[]) => {
    set((state) => ({
      participants: {
        ...state.participants,
        [workspaceId]: participants,
      },
    }));
  },

  // 참여자 온라인 상태 업데이트
  updateParticipantStatus: (userId: string, isOnline: boolean) => {
    set((state) => {
      const updatedParticipants = { ...state.participants };

      Object.keys(updatedParticipants).forEach((workspaceId) => {
        updatedParticipants[workspaceId] = updatedParticipants[workspaceId].map(
          (p) => (p.id === userId ? { ...p, isOnline } : p)
        );
      });

      return { participants: updatedParticipants };
    });
  },

  // 타이핑 상태 설정
  setTyping: (workspaceId: string, userId: string, isTyping: boolean) => {
    set((state) => {
      const currentTyping = state.typingUsers[workspaceId] || [];
      const updatedTyping = isTyping
        ? [...currentTyping.filter((id) => id !== userId), userId]
        : currentTyping.filter((id) => id !== userId);

      return {
        typingUsers: {
          ...state.typingUsers,
          [workspaceId]: updatedTyping,
        },
      };
    });
  },

  // 활성 워크스페이스 설정
  setActiveWorkspace: (workspaceId: string | null) => {
    set({ activeWorkspaceId: workspaceId });

    // 활성 워크스페이스의 읽지 않은 메시지 카운트 초기화
    if (workspaceId) {
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [workspaceId]: 0,
        },
      }));
    }
  },

  // 연결 상태 설정
  setConnected: (isConnected: boolean) => {
    set({ isConnected });
  },

  // 채팅방 ID 설정
  setChatRoomId: (workspaceId: string, chatRoomId: string) => {
    set((state) => ({
      chatRoomIds: {
        ...state.chatRoomIds,
        [workspaceId]: chatRoomId,
      },
    }));
  },

  // 워크스페이스 메시지 초기화
  clearWorkspaceMessages: (workspaceId: string) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [workspaceId]: _, ...remainingMessages } = state.messages;
      return { messages: remainingMessages };
    });
  },

  // 🆕 페이지네이션: 메시지 앞에 추가 (과거 메시지 로드 시)
  prependMessages: (messages: ChatMessage[]) => {
    const { activeWorkspaceId } = get();
    if (!activeWorkspaceId) return;

    set((state) => {
      const existingMessages = state.messages[activeWorkspaceId] || [];
      const newMessages = messages;

      // Map을 사용하여 ID 중복 제거 (기존 메시지 우선)
      const messageMap = new Map();

      // 새 메시지(과거) 먼저 넣고
      newMessages.forEach((m) => messageMap.set(m.id, m));
      // 기존 메시지(최신) 덮어쓰기 (혹시 겹치면 기존 상태 유지)
      existingMessages.forEach((m) => messageMap.set(m.id, m));

      // 다시 배열로 변환 (시간순 정렬되어 있다고 가정하거나 정렬 필요할 수 있음)
      // 보통 서버에서 정렬해 주므로 값만 추출
      // Map은 삽입 순서를 기억하므로 newMessages -> existingMessages 순서 유지됨

      return {
        messages: {
          ...state.messages,
          [activeWorkspaceId]: Array.from(messageMap.values()),
        },
      };
    });
  },

  // 🆕 페이지네이션: 상태 설정
  setPaginationState: (newState) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...newState,
      },
    }));
  },

  // 🆕 페이지네이션: 더 많은 메시지 로드
  loadMoreMessages: async () => {
    const {
      activeWorkspaceId,
      pagination,
      prependMessages,
      setPaginationState,
    } = get();

    if (!activeWorkspaceId) {
      return;
    }

    if (pagination.isLoading || !pagination.hasMore) {
      return; // 이미 로딩 중이거나 더 이상 메시지 없음
    }

    // 로딩 시작
    setPaginationState({ isLoading: true });

    try {
      // API 호출 (MSW가 가로챔)
      const response = await fetchMessages(activeWorkspaceId, {
        before: pagination.oldestLoadedId || undefined,
        limit: CHAT_PAGINATION_CONFIG.loadMoreSize,
      });

      // response = { status: 'success', data: ChatMessage[] }
      const olderMessages = response.data || [];

      if (olderMessages.length > 0) {
        // 메시지 추가
        prependMessages(olderMessages);

        // 페이지네이션 상태 업데이트
        setPaginationState({
          oldestLoadedId: olderMessages[olderMessages.length - 1].id,
          hasMore: olderMessages.length === CHAT_PAGINATION_CONFIG.loadMoreSize,
        });
      } else {
        // 더 이상 메시지 없음
        setPaginationState({ hasMore: false });
      }
    } catch (error) {
    } finally {
      setPaginationState({ isLoading: false });
    }
  },
}));
