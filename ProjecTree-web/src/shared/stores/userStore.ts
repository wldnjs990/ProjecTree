import type { MemberInfoResponse } from '@/apis/member.api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 사용자 상태 인터페이스
 */
interface UserState {
  user: MemberInfoResponse | null;
  isAuthenticated: boolean;
  setUser: (user: MemberInfoResponse) => void;
  updateNickname: (nickname: string) => void;
  clearUser: () => void;
}

/**
 * [Store] 사용자 정보 전역 상태 관리
 * - 로그인된 사용자의 memberId, nickname, email 등을 관리
 * - 실제 인증 구현 전까지 임시 사용자 정보 사용
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: MemberInfoResponse) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateNickname: (nickname: string) =>
        set((state) => ({
          user: state.user ? { ...state.user, nickname } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useUser = () => useUserStore((state) => state.user);
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useUpdateNickname = () =>
  useUserStore((state) => state.updateNickname);
export const useClearUser = () => useUserStore((state) => state.clearUser);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
