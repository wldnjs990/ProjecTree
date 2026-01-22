import { create } from 'zustand';
import type { Edge } from '@xyflow/react';
import type { FlowNode, ConnectionStatus } from '../types/node';
import { generateEdges } from '../utils/generateEdges';

interface NodeState {
  // 상태
  nodes: FlowNode[];
  connectionStatus: ConnectionStatus;
  isSynced: boolean;

  // 액션
  setNodes: (nodes: FlowNode[]) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  addNode: (node: FlowNode) => void;
  deleteNode: (nodeId: string) => void;

  // 연결 상태
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsSynced: (synced: boolean) => void;

  // 초기화
  reset: () => void;
}

const initialState = {
  nodes: [] as FlowNode[],
  connectionStatus: 'disconnected' as ConnectionStatus,
  isSynced: false,
};

export const useNodeStore = create<NodeState>((set) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),

  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setIsSynced: (synced) => set({ isSynced: synced }),

  reset: () => set(initialState),
}));

// ===== Selector hooks =====

/** nodes만 선택 */
export const useNodes = () => useNodeStore((state) => state.nodes);

/** edges 계산 (nodes에서 파생) */
export const useEdges = (): Edge[] => {
  const nodes = useNodeStore((state) => state.nodes);
  return generateEdges(nodes);
};

/** 연결 상태 선택 */
export const useConnectionStatus = () =>
  useNodeStore((state) => state.connectionStatus);

/** 동기화 상태 선택 */
export const useIsSynced = () => useNodeStore((state) => state.isSynced);

/** 특정 노드 선택 */
export const useNode = (nodeId: string) =>
  useNodeStore((state) => state.nodes.find((n) => n.id === nodeId));
