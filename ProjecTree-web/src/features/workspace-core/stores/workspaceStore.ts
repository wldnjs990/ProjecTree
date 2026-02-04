import { create } from 'zustand';
import type { WorkspaceDetailData } from '@/apis/workspace.api';

interface WorkspaceState {
  roomId: string | null;
  workspaceDetail: WorkspaceDetailData | null;
  setRoomId: (roomId: string) => void;
  setWorkspaceDetail: (detail: WorkspaceDetailData) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  roomId: null,
  workspaceDetail: null,

  setRoomId: (roomId) => set({ roomId }),
  setWorkspaceDetail: (detail) => set({ workspaceDetail: detail }),

  reset: () => set({ roomId: null, workspaceDetail: null }),
}));

// Selectors
export const useRoomId = () => useWorkspaceStore((state) => state.roomId);
export const useWorkspaceDetail = () =>
  useWorkspaceStore((state) => state.workspaceDetail);
