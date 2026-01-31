import { useSelectedNodeId } from '../stores/nodeDetailStore';
import { useNodeStore } from '../stores/nodeStore';
import type { NodeDetailData, NodeData } from '../components/NodeDetailSidebar/types';

/**
 * 선택된 노드 상세 데이터 Hook
 */
export function useSelectedNodeDetail(): NodeDetailData | null {
  const selectedNodeId = useSelectedNodeId();
  const numericId = selectedNodeId ? Number(selectedNodeId) : null;

  return useNodeStore((state) =>
    numericId ? state.nodeDetails[numericId] : null
  );
}

/**
 * 선택된 노드 목록 데이터 Hook
 */
export function useSelectedNodeListData(): NodeData | null {
  const selectedNodeId = useSelectedNodeId();
  const numericId = selectedNodeId ? Number(selectedNodeId) : null;

  return useNodeStore((state) =>
    numericId ? state.nodeListData[numericId] : null
  );
}
