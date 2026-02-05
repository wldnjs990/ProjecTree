import { useEffect, useCallback, useRef } from 'react';
import * as Y from 'yjs';
import { getCrdtClient, type YNodeValue } from '../crdt/crdtClient';
import { useConnectionStatus, useNodeStore } from '../stores';
import type { FlowNode, FlowNodeData, YjsNode } from '../types/node';
import { flowNodeToYjsNode, yjsNodeToFlowNode } from '../utils/nodeTransform';

/**
 * Preview 노드 CRDT 동기화 훅
 * - Y.Map('previewNodes')를 구독하여 preview 노드 변경 감지
 * - 다른 유저들에게도 노드 생성 중 UI가 보이도록 동기화
 */
export const usePreviewNodesCrdt = () => {
  const connectionStatus = useConnectionStatus();
  const yPreviewNodesRef = useRef<Y.Map<Y.Map<YNodeValue>> | null>(null);

  // Zustand 스토어 액션
  const setPreviewNodes = useNodeStore((state) => state.setPreviewNodes);

  // Y.Map에서 preview 노드 배열로 변환 후 전역 스토어 업데이트
  const syncFromYjs = useCallback(() => {
    if (!yPreviewNodesRef.current) return;

    const previewNodes: FlowNode[] = [];

    yPreviewNodesRef.current.forEach((yNode, nodeId) => {
      const rawParentId = yNode.get('parentId');
      const data = yNode.get('data') as FlowNodeData;
      const lockedBy = yNode.get('lockedBy') as string | undefined;

      const yjsNode: YjsNode = {
        id: nodeId,
        type: String(yNode.get('type')).toUpperCase() as YjsNode['type'],
        parentId:
          rawParentId === null
            ? undefined
            : (rawParentId as string | undefined),
        position: yNode.get('position') as { x: number; y: number },
        data: lockedBy ? { ...data, lockedBy } : data,
      };
      previewNodes.push(yjsNodeToFlowNode(yjsNode));
    });

    setPreviewNodes(previewNodes);
  }, [setPreviewNodes]);

  // Y.Map 초기화 및 구독
  useEffect(() => {
    const client = getCrdtClient();
    if (!client) {
      console.warn(
        '[usePreviewNodesCrdt] CRDT 클라이언트가 초기화되지 않았습니다.'
      );
      return;
    }

    // preview 노드 리스트 가져오기
    const yPreviewNodes = client.getYMap<Y.Map<YNodeValue>>('previewNodes');
    yPreviewNodesRef.current = yPreviewNodes;

    // Y.Map 변경 감지 → 스토어 업데이트
    const observeHandler = () => {
      syncFromYjs();
    };

    yPreviewNodes.observeDeep(observeHandler);

    // 초기 동기화
    if (client.provider.synced) {
      syncFromYjs();
    }

    return () => {
      yPreviewNodes.unobserveDeep(observeHandler);
      yPreviewNodesRef.current = null;
    };
  }, [syncFromYjs, connectionStatus]);

  // Preview 노드 추가 (CRDT 동기화)
  const addPreviewNode = useCallback((node: FlowNode) => {
    const yPreviewNodes = yPreviewNodesRef.current;
    const client = getCrdtClient();
    if (!yPreviewNodes || !client) return;

    client.yDoc.transact(() => {
      const yNode = new Y.Map<YNodeValue>();
      const yjsNode = flowNodeToYjsNode(node);
      yNode.set('type', yjsNode.type);
      yNode.set('parentId', yjsNode.parentId);
      yNode.set('position', yjsNode.position);
      yNode.set('data', yjsNode.data);
      yPreviewNodes.set(node.id, yNode);
    });

    console.log('[CRDT] Preview 노드 추가:', node.id);
  }, []);

  // Preview 노드 제거 (CRDT 동기화)
  const removePreviewNode = useCallback((nodeId: string) => {
    const yPreviewNodes = yPreviewNodesRef.current;
    if (!yPreviewNodes) return;

    yPreviewNodes.delete(nodeId);
    console.log('[CRDT] Preview 노드 제거:', nodeId);
  }, []);

  // 모든 Preview 노드 제거 (CRDT 동기화)
  const clearPreviewNodes = useCallback(() => {
    const yPreviewNodes = yPreviewNodesRef.current;
    const client = getCrdtClient();
    if (!yPreviewNodes || !client) return;

    client.yDoc.transact(() => {
      yPreviewNodes.clear();
    });

    console.log('[CRDT] 모든 Preview 노드 제거');
  }, []);

  return {
    addPreviewNode,
    removePreviewNode,
    clearPreviewNodes,
  };
};

export default usePreviewNodesCrdt;
