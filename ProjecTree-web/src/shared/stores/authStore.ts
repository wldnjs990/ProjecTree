import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      // setter
      setAccessToken: (accessToken) => {
        set({
          accessToken: accessToken,
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);

// ===== Selector hooks =====

export const useAccessToken = () => useAuthStore((state) => state.accessToken);

export const useSetAccessToken = () =>
  useAuthStore((state) => state.setAccessToken);
