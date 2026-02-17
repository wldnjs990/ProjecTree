import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import * as Y from 'yjs';
import {
  addEdge,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from '@xyflow/react';
import { getCrdtClient, type YNodeValue, type FlowNode } from '@/features/workspace-core';

interface UseTreeCanvasHandlersParams {
  candidatePreviewMode: boolean;
  currentUserId: string;
  fitView: ReactFlowInstance['fitView'];
  lockedPreviewIds: Set<string>;
  onNodeClick?: (nodeId: string) => void;
  setNodes: Dispatch<SetStateAction<FlowNode[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  handleCrdtNodeDragStop: (event: React.MouseEvent, node: Node) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toUserId = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return '';
};

const getLockedBy = (node: Node): string => {
  if (!isRecord(node.data)) return '';
  return toUserId(node.data.lockedBy);
};

export function useTreeCanvasHandlers({
  candidatePreviewMode,
  currentUserId,
  fitView,
  lockedPreviewIds,
  onNodeClick,
  setNodes,
  setEdges,
  handleCrdtNodeDragStop,
}: UseTreeCanvasHandlersParams) {
  const handleNodesChange = useCallback(
    (changes: NodeChange<FlowNode>[]) => {
      if (lockedPreviewIds.size > 0) {
        const filtered = changes.filter((change) => {
          if (!('id' in change)) return true;
          return !lockedPreviewIds.has(change.id);
        });

        setNodes((nds) => applyNodeChanges<FlowNode>(filtered, nds));
        return;
      }

      setNodes((nds) => applyNodeChanges<FlowNode>(changes, nds));
    },
    [setNodes, lockedPreviewIds]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (candidatePreviewMode) return;

      if (node.type === 'PREVIEW') {
        const lockedBy = getLockedBy(node);
        if (lockedBy && lockedBy !== currentUserId) return;
      }

      const client = getCrdtClient();
      if (client && node.type !== 'PREVIEW') {
        client.awareness.setLocalStateField('activeNodeId', node.id);
      }

      fitView({
        nodes: [{ id: node.id }],
        duration: 300,
      });

      onNodeClick?.(node.id);
    },
    [candidatePreviewMode, currentUserId, fitView, onNodeClick]
  );

  const handleNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === 'PREVIEW') {
        const lockedBy = getLockedBy(node);
        if (lockedBy && lockedBy !== currentUserId) return;

        const client = getCrdtClient();
        const yPreviewNodes = client?.getYMap<Y.Map<YNodeValue>>('previewNodes');
        const yNode = yPreviewNodes?.get(node.id);
        if (yNode) {
          yNode.set('position', { x: node.position.x, y: node.position.y });
        }
        return;
      }

      handleCrdtNodeDragStop(event, node);
    },
    [currentUserId, handleCrdtNodeDragStop]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) =>
        changes.reduce((acc, change) => {
          if (change.type === 'remove') {
            return acc.filter((edge) => edge.id !== change.id);
          }
          return acc;
        }, eds)
      );
    },
    [setEdges]
  );

  const handleConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handlePaneClick = useCallback(() => {
    const client = getCrdtClient();
    if (client) {
      client.awareness.setLocalStateField('activeNodeId', null);
    }
  }, []);

  return {
    handleNodesChange,
    handleNodeClick,
    handleNodeDragStop,
    handleEdgesChange,
    handleConnect,
    handlePaneClick,
  };
}
