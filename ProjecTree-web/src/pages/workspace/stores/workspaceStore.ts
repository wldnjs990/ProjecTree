import { create } from 'zustand';

interface WorkspaceState {
  roomId: string | null;
  setRoomId: (roomId: string) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  roomId: null,

  setRoomId: (roomId) => set({ roomId }),

  reset: () => set({ roomId: null }),
}));

// Selectors
export const useRoomId = () => useWorkspaceStore((state) => state.roomId);
