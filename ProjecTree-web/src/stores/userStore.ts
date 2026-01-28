import { create } from 'zustand';

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
export const useUserStore = create<UserState>((set) => ({
  // 임시 사용자 정보 (실제 인증 구현 시 null로 변경)
  user: {
    memberId: 1,
    nickname: '김싸피',
    email: 'ssafy@example.com',
  },
  isAuthenticated: true,

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
}));
