import { useEffect, useCallback, useRef } from 'react';
import * as Y from 'yjs';
import type { Node } from '@xyflow/react';
import { getCrdtClient, type YNodeValue } from '../crdt/crdtClient';
import { useNodeStore } from '../stores/nodeStore';
import type { FlowNode, FlowNodeData, YjsNode } from '../types/node';
import { flowNodeToYjsNode, yjsNodeToFlowNode } from '../utils/nodeTransform';

interface UseNodesCrdtOptions {
  initialNodes?: FlowNode[];
}

/**
 * 노드 CRDT 동기화 훅
 * - Y.Map('nodes')를 구독하여 노드 변경 감지
 * - 노드 드래그/업데이트 시 Y.js에 반영
 */
export const useNodesCrdt = ({ initialNodes = [] }: UseNodesCrdtOptions = {}) => {
  const yNodesRef = useRef<Y.Map<Y.Map<YNodeValue>> | null>(null);

  // Zustand 스토어 액션
  const setNodes = useNodeStore((state) => state.setNodes);
  const updateNodePosition = useNodeStore((state) => state.updateNodePosition);

  // Y.Map에서 노드 배열로 변환 후 스토어 업데이트
  const syncFromYjs = useCallback(() => {
    if (!yNodesRef.current) return;

    const nodes: FlowNode[] = [];
    yNodesRef.current.forEach((yNode, nodeId) => {
      const rawParentId = yNode.get('parentId');
      const yjsNode: YjsNode = {
        id: nodeId,
        type: yNode.get('type') as YjsNode['type'],
        parentId:
          rawParentId === null
            ? undefined
            : (rawParentId as string | undefined),
        position: yNode.get('position') as { x: number; y: number },
        data: yNode.get('data') as YjsNode['data'],
      };
      nodes.push(yjsNodeToFlowNode(yjsNode));
    });

    setNodes(nodes);
  }, [setNodes]);

  // Y.Map 초기화 및 구독
  useEffect(() => {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[useNodesCrdt] CRDT 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    const yNodes = client.getYMap<Y.Map<YNodeValue>>('nodes');
    yNodesRef.current = yNodes;

    // 초기 동기화 완료 시 처리
    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        // 서버에 데이터가 없으면 초기 노드로 세팅
        if (yNodes.size === 0 && initialNodes.length > 0) {
          client.yDoc.transact(() => {
            initialNodes.forEach((node) => {
              const yNode = new Y.Map<YNodeValue>();
              const yjsNode = flowNodeToYjsNode(node);
              yNode.set('type', yjsNode.type);
              yNode.set('parentId', yjsNode.parentId);
              yNode.set('position', yjsNode.position);
              yNode.set('data', yjsNode.data);
              yNodes.set(node.id, yNode);
            });
          });
        }
        syncFromYjs();
      }
    };

    // Y.Map 변경 감지 → 스토어 업데이트
    const observeHandler = () => {
      syncFromYjs();
    };

    client.provider.on('sync', handleSync);
    yNodes.observeDeep(observeHandler);

    // 이미 동기화된 상태라면 즉시 처리
    if (client.provider.synced) {
      handleSync(true);
    }

    return () => {
      client.provider.off('sync', handleSync);
      yNodes.unobserveDeep(observeHandler);
      yNodesRef.current = null;
    };
  }, [initialNodes, syncFromYjs]);

  // 노드 드래그 완료 핸들러
  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const yNodes = yNodesRef.current;
      if (!yNodes) return;

      const yNode = yNodes.get(node.id);
      if (!yNode) return;

      // Y.Map에 position 업데이트 → observe가 감지 → 브로드캐스트
      yNode.set('position', { x: node.position.x, y: node.position.y });

      // 로컬 스토어도 즉시 업데이트 (UX용)
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  // 노드 데이터 업데이트
  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<FlowNodeData>) => {
      const yNodes = yNodesRef.current;
      if (!yNodes) return;

      const yNode = yNodes.get(nodeId);
      if (!yNode) return;

      const currentData = yNode.get('data') as FlowNodeData;
      yNode.set('data', { ...currentData, ...data });
    },
    []
  );

  // 노드 추가
  const addNode = useCallback((node: FlowNode) => {
    const yNodes = yNodesRef.current;
    const client = getCrdtClient();
    if (!yNodes || !client) return;

    client.yDoc.transact(() => {
      const yNode = new Y.Map<YNodeValue>();
      const yjsNode = flowNodeToYjsNode(node);
      yNode.set('type', yjsNode.type);
      yNode.set('parentId', yjsNode.parentId);
      yNode.set('position', yjsNode.position);
      yNode.set('data', yjsNode.data);
      yNodes.set(node.id, yNode);
    });
  }, []);

  // 노드 삭제
  const deleteNode = useCallback((nodeId: string) => {
    const yNodes = yNodesRef.current;
    if (!yNodes) return;

    yNodes.delete(nodeId);
  }, []);

  return {
    handleNodeDragStop,
    updateNodeData,
    addNode,
    deleteNode,
  };
};

export default useNodesCrdt;
