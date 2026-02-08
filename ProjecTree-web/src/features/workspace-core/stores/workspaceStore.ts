import { create } from 'zustand';
import type { WorkspaceDetailData } from '@/apis/workspace.api';

interface WorkspaceState {
  roomId: string | null;
  workspaceDetail: WorkspaceDetailData | null;
  workspaceName: string | null;
  setRoomId: (roomId: string) => void;
  setWorkspaceDetail: (detail: WorkspaceDetailData) => void;
  setWorkspaceName: (name: string) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  roomId: null,
  workspaceDetail: null,
  workspaceName: null,

  setRoomId: (roomId) => set({ roomId }),
  setWorkspaceDetail: (detail) => set({ workspaceDetail: detail }),
  setWorkspaceName: (name) => set({ workspaceName: name }),

  reset: () => set({ roomId: null, workspaceDetail: null, workspaceName: null }),
}));

// Selectors
export const useRoomId = () => useWorkspaceStore((state) => state.roomId);
export const useWorkspaceDetail = () =>
  useWorkspaceStore((state) => state.workspaceDetail);
export const useWorkspaceName = () =>
  useWorkspaceStore((state) => state.workspaceName);
