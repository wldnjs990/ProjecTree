import { create } from 'zustand';
import type {
  ChatState,
  ChatMessage,
  ChatParticipant,
} from '../types/chat.types';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  participants: {},
  activeWorkspaceId: null,
  typingUsers: {},
  unreadCounts: {},
  isConnected: false,

  // 메시지 추가
  addMessage: (workspaceId: string, message: ChatMessage) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [workspaceId]: [...(state.messages[workspaceId] || []), message],
      },
    }));

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
    set((state) => ({
      messages: {
        ...state.messages,
        [workspaceId]: messages,
      },
    }));
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

  // 워크스페이스 메시지 초기화
  clearWorkspaceMessages: (workspaceId: string) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [workspaceId]: _, ...remainingMessages } = state.messages;
      return { messages: remainingMessages };
    });
  },
}));
