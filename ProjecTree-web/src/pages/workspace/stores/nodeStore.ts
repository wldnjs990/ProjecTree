import { create } from 'zustand';
import type { Edge } from '@xyflow/react';
import type { FlowNode, ConnectionStatus } from '../types/node';
import { generateEdges } from '../utils/generateEdges';
import type {
  NodeDetailData,
  NodeData,
  NodeStatus,
  Priority,
  Assignee,
} from '../components/NodeDetailSidebar/types';

// 확정된 노드 데이터 (편집 완료 후 브로드캐스트되는 데이터)
export interface ConfirmedNodeData {
  // NodeData에서 (노드 목록)
  status: NodeStatus;
  priority?: Priority;
  difficult?: number; // TASK, ADVANCED 타입에만 존재
  // NodeDetailData에서 (상세 API)
  assignee: Assignee | null;
  note: string;
}

interface NodeState {
  // 상태
  nodes: FlowNode[];
  connectionStatus: ConnectionStatus;
  isSynced: boolean;

  // 노드 상세 데이터 (id -> NodeDetailData)
  nodeDetails: Record<number, NodeDetailData>;
  // 노드 목록 데이터 (id -> NodeData)
  nodeListData: Record<number, NodeData>;

  // 액션
  setNodes: (nodes: FlowNode[]) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x: number; y: number }
  ) => void;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  addNode: (node: FlowNode) => void;
  deleteNode: (nodeId: string) => void;

  // 노드 상세/목록 데이터 액션
  setNodeDetails: (details: Record<number, NodeDetailData>) => void;
  setNodeListData: (data: Record<number, NodeData>) => void;
  updateNodeDetail: (nodeId: number, updates: Partial<NodeDetailData>) => void;
  updateNodeListItem: (nodeId: number, updates: Partial<NodeData>) => void;
  // 확정 데이터 일괄 업데이트 (CRDT 브로드캐스트 수신 시)
  applyConfirmedData: (nodeId: number, data: ConfirmedNodeData) => void;

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
  nodeDetails: {} as Record<number, NodeDetailData>,
  nodeListData: {} as Record<number, NodeData>,
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

  // 노드 상세/목록 데이터 액션
  setNodeDetails: (details) => set({ nodeDetails: details }),

  setNodeListData: (data) => set({ nodeListData: data }),

  // 지금 목 데이터가 nodeId를 key값으로 사용하는 객체 배열로 만들어져서 nodeDetails가 저런식으로 만들어져있음
  // TODO : 진짜 API 연동 이후, [nodeId] 없애고 단일 state로 관리
  updateNodeDetail: (nodeId, updates) =>
    set((state) => ({
      nodeDetails: {
        ...state.nodeDetails,
        [nodeId]: state.nodeDetails[nodeId]
          ? { ...state.nodeDetails[nodeId], ...updates }
          : (updates as NodeDetailData),
      },
    })),

  updateNodeListItem: (nodeId, updates) =>
    set((state) => ({
      nodeListData: {
        ...state.nodeListData,
        [nodeId]: state.nodeListData[nodeId]
          ? { ...state.nodeListData[nodeId], ...updates }
          : (updates as NodeData),
      },
    })),

  // 확정 데이터 일괄 업데이트 (CRDT 브로드캐스트 수신 시)
  applyConfirmedData: (nodeId, data) =>
    set((state) => ({
      // nodeListData 업데이트 (status, priority, difficult)
      nodeListData: {
        ...state.nodeListData,
        [nodeId]: state.nodeListData[nodeId]
          ? {
              ...state.nodeListData[nodeId],
              status: data.status,
              priority: data.priority,
              difficult: data.difficult,
            }
          : ({
              status: data.status,
              priority: data.priority,
              difficult: data.difficult,
              identifier: '',
              taskType: null,
            } as NodeData),
      },
      // nodeDetails 업데이트 (assignee, note)
      nodeDetails: {
        ...state.nodeDetails,
        [nodeId]: state.nodeDetails[nodeId]
          ? {
              ...state.nodeDetails[nodeId],
              assignee: data.assignee,
              note: data.note,
            }
          : ({
              id: nodeId,
              assignee: data.assignee,
              note: data.note,
              description: '',
              candidates: [],
              techs: [],
              comparison: '',
            } as NodeDetailData),
      },
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setIsSynced: (synced) => set({ isSynced: synced }),

  reset: () => set(initialState),
}));

// ===== Selector hooks =====
// 컴포넌트 store 구독 최적화용

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

/** 노드 상세 데이터 선택 */
export const useNodeDetails = () => useNodeStore((state) => state.nodeDetails);

/** 특정 노드 상세 데이터 선택 */
export const useNodeDetail = (nodeId: number | null) =>
  useNodeStore((state) => (nodeId ? state.nodeDetails[nodeId] : null));

/** 노드 목록 데이터 선택 */
export const useNodeListData = () =>
  useNodeStore((state) => state.nodeListData);

/** 특정 노드 목록 데이터 선택 */
export const useNodeListItem = (nodeId: number | null) =>
  useNodeStore((state) => (nodeId ? state.nodeListData[nodeId] : null));
