import * as Y from 'yjs';
import { getCrdtClient, type YNodeValue } from '../crdt/crdtClient';
import type { FlowNode } from '../types/node';
import { flowNodeToYjsNode } from '../utils/nodeTransform';

/**
 * Preview 노드 CRDT 서비스
 * - 어디서든 호출 가능한 preview 노드 CRDT 조작 함수 제공
 * - 다른 유저들에게 노드 생성 중 UI가 보이도록 동기화
 */
export const previewNodesCrdtService = {
  /**
   * Preview 노드 추가 (CRDT 동기화)
   */
  addPreviewNode(node: FlowNode): void {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[previewNodesCrdtService] CRDT 클라이언트가 없습니다.');
      return;
    }

    const yPreviewNodes = client.getYMap<Y.Map<YNodeValue>>('previewNodes');

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
  },

  /**
   * Preview 노드 제거 (CRDT 동기화)
   */
  removePreviewNode(nodeId: string): void {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[previewNodesCrdtService] CRDT 클라이언트가 없습니다.');
      return;
    }

    const yPreviewNodes = client.getYMap<Y.Map<YNodeValue>>('previewNodes');
    yPreviewNodes.delete(nodeId);

    console.log('[CRDT] Preview 노드 제거:', nodeId);
  },

  /**
   * 모든 Preview 노드 제거 (CRDT 동기화)
   */
  clearPreviewNodes(): void {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[previewNodesCrdtService] CRDT 클라이언트가 없습니다.');
      return;
    }

    const yPreviewNodes = client.getYMap<Y.Map<YNodeValue>>('previewNodes');

    client.yDoc.transact(() => {
      yPreviewNodes.clear();
    });

    console.log('[CRDT] 모든 Preview 노드 제거');
  },
};