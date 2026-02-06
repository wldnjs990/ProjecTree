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
      const lockedBy = (yjsNode.data as { lockedBy?: unknown })?.lockedBy;
      if (typeof lockedBy === 'string' && lockedBy.length > 0) {
        yNode.set('lockedBy', lockedBy);
      }
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

  /**
   * 특정 사용자 소유 Preview 노드만 제거 (CRDT 동기화)
   */
  clearPreviewNodesByOwner(ownerId: string): void {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[previewNodesCrdtService] CRDT 클라이언트가 없습니다.');
      return;
    }

    const yPreviewNodes = client.getYMap<Y.Map<YNodeValue>>('previewNodes');
    client.yDoc.transact(() => {
      yPreviewNodes.forEach((yNode, nodeId) => {
        const lockedBy =
          (yNode.get('lockedBy') as string | undefined) ??
          ((yNode.get('data') as { lockedBy?: string } | undefined)?.lockedBy);
        if (lockedBy === ownerId) {
          yPreviewNodes.delete(nodeId);
        }
      });
    });

    console.log('[CRDT] 소유자 Preview 노드 제거:', ownerId);
  },
};
