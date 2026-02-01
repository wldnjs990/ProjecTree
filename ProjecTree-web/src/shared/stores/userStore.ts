import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  memberId: number;
  nickname: string;
  email: string;
}

/**
 * 사용자 상태 인터페이스
 */
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
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

      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

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
export const useClearUser = () => useUserStore((state) => state.clearUser);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
