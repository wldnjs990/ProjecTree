import { useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Edge } from '@xyflow/react';
import type { FlowNode } from '@/features/workspace-core';

interface UseTreeCanvasDerivedStateParams {
  storeNodes: FlowNode[];
  storeEdges: Edge[];
  previewNodes: FlowNode[];
  currentUserId: string;
  setNodes: Dispatch<SetStateAction<FlowNode[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}

const toUserId = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return '';
};

export function useTreeCanvasDerivedState({
  storeNodes,
  storeEdges,
  previewNodes,
  currentUserId,
  setNodes,
  setEdges,
}: UseTreeCanvasDerivedStateParams) {
  const lockedPreviewIds = useMemo(() => {
    const locked = new Set<string>();
    previewNodes.forEach((node) => {
      const lockedBy = toUserId(node.data.lockedBy);
      if (lockedBy && lockedBy !== currentUserId) {
        locked.add(node.id);
      }
    });
    return locked;
  }, [previewNodes, currentUserId]);

  const displayNodes = useMemo<FlowNode[]>(() => {
    const nodesForReactFlow = storeNodes.map((node) => {
      const nextNode = { ...node };
      delete nextNode.parentId;
      return nextNode;
    });

    if (previewNodes.length === 0) {
      return nodesForReactFlow;
    }

    const previewNodesWithoutParent = previewNodes.map((node) => {
      const nextNode = { ...node };
      delete nextNode.parentId;

      if (lockedPreviewIds.has(nextNode.id)) {
        return { ...nextNode, draggable: false, selectable: false };
      }
      return nextNode;
    });

    return [...nodesForReactFlow, ...previewNodesWithoutParent];
  }, [storeNodes, previewNodes, lockedPreviewIds]);

  useEffect(() => {
    setNodes(displayNodes);
  }, [displayNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  return {
    lockedPreviewIds,
  };
}
