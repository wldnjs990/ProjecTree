import { create } from 'zustand';
import type { NodeStatus, Priority, Assignee } from '../types/nodeDetail';

// 편집 가능한 노드 상세 필드 타입
export interface EditableNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult?: number;
  assignee: Assignee | null;
  note: string;
}

interface NodeDetailState {
  // === 상태 ===
  selectedNodeId: string | null;
  isOpen: boolean;
  isEditing: boolean;
  editData: EditableNodeDetail | null;
  isSaving: boolean;

  // === 단순 setter ===
  setSelectedNodeId: (id: string | null) => void;
  setIsOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setEditData: (data: EditableNodeDetail | null) => void;
  setIsSaving: (saving: boolean) => void;

  // === 복합 setter ===
  openSidebar: (nodeId: string) => void;
  closeSidebar: () => void;
  reset: () => void;
}

export const useNodeDetailStore = create<NodeDetailState>((set) => ({
  // === 초기 상태 ===
  selectedNodeId: null,
  isOpen: false,
  isEditing: false,
  editData: null,
  isSaving: false,

  // === 단순 setter ===
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setIsOpen: (open) => set({ isOpen: open }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setEditData: (data) => set({ editData: data }),
  setIsSaving: (saving) => set({ isSaving: saving }),

  // === 복합 setter ===
  openSidebar: (nodeId) => {
    set({ selectedNodeId: nodeId, isOpen: true });
  },

  closeSidebar: () => {
    set({
      isOpen: false,
      selectedNodeId: null,
      isEditing: false,
      editData: null,
    });
  },

  reset: () =>
    set({
      selectedNodeId: null,
      isOpen: false,
      isEditing: false,
      editData: null,
      isSaving: false,
    }),
}));

// ===== Selector hooks =====

/** 선택된 노드 ID */
export const useSelectedNodeId = () =>
  useNodeDetailStore((state) => state.selectedNodeId);

/** 사이드바 열림 상태 */
export const useIsNodeDetailOpen = () =>
  useNodeDetailStore((state) => state.isOpen);

/** 편집 모드 상태 */
export const useIsEditing = () =>
  useNodeDetailStore((state) => state.isEditing);

/** 편집 중인 데이터 */
export const useEditData = () => useNodeDetailStore((state) => state.editData);

/** 저장 중 상태 */
export const useIsSaving = () => useNodeDetailStore((state) => state.isSaving);

/** 특정 편집 필드 값 */
export const useEditField = <K extends keyof EditableNodeDetail>(field: K) =>
  useNodeDetailStore((state) => state.editData?.[field]);
