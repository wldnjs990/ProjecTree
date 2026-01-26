import { useEffect, useCallback, useRef, useState } from 'react';
import * as Y from 'yjs';
import { getCrdtClient } from '../crdt/crdtClient';
import { useNodeStore, type ConfirmedNodeData } from '../stores/nodeStore';
import type {
  NodeStatus,
  Priority,
  Assignee,
} from '../components/NodeDetailSidebar/types';

// 편집 가능한 노드 상세 필드 타입
export interface EditableNodeDetail {
  // NodeData에서 (노드 목록)
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  // NodeDetailData에서 (상세 API)
  assignee: Assignee | null;
  note: string;
}

// Y.Map에 저장되는 값 타입
type YNodeDetailValue = string | number | Assignee | null | undefined;

interface UseNodeDetailCrdtOptions {
  nodeId: string | null;
  initialData: EditableNodeDetail | null;
  onSave?: () => Promise<void>;
}

/**
 * 노드 상세 CRDT 동기화 훅
 * - 편집 시작 시 Y.Map('nodeDetails')에 데이터 생성
 * - 실시간 편집 내용 동기화
 * - 편집 완료 시 Y.Map('confirmedNodeData')에 확정 데이터 저장 및 브로드캐스트
 */
export const useNodeDetailCrdt = ({
  nodeId,
  initialData,
  onSave,
}: UseNodeDetailCrdtOptions) => {
  const yNodeDetailsRef = useRef<Y.Map<Y.Map<YNodeDetailValue>> | null>(null);
  const yConfirmedRef = useRef<Y.Map<ConfirmedNodeData> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableNodeDetail | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Zustand store에서 확정 데이터 업데이트 함수 가져오기
  const applyConfirmedData = useNodeStore((state) => state.applyConfirmedData);

  // Y.Map에서 현재 노드의 편집 데이터를 로컬 상태로 동기화
  const syncFromYjs = useCallback(() => {
    if (!yNodeDetailsRef.current || !nodeId) return;

    const yNodeDetail = yNodeDetailsRef.current.get(nodeId);
    if (!yNodeDetail) {
      // 편집 데이터가 없으면 편집 모드 종료
      setIsEditing(false);
      setEditData(null);
      return;
    }

    // Y.Map에서 데이터 읽어오기
    const data: EditableNodeDetail = {
      status: (yNodeDetail.get('status') as NodeStatus) || 'TODO',
      priority: yNodeDetail.get('priority') as Priority | undefined,
      difficult: (yNodeDetail.get('difficult') as number) || 1,
      assignee: yNodeDetail.get('assignee') as Assignee | null,
      note: (yNodeDetail.get('note') as string) || '',
    };

    setEditData(data);
    setIsEditing(true);
  }, [nodeId]);

  // Y.Map 초기화 및 구독
  useEffect(() => {
    const client = getCrdtClient();
    if (!client) {
      console.warn(
        '[useNodeDetailCrdt] CRDT 클라이언트가 초기화되지 않았습니다.'
      );
      return;
    }

    // 편집 중 데이터용 Y.Map
    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
    yNodeDetailsRef.current = yNodeDetails;

    // 확정 데이터용 Y.Map
    const yConfirmed = client.getYMap<ConfirmedNodeData>('confirmedNodeData');
    yConfirmedRef.current = yConfirmed;

    // 편집 데이터 변경 감지 → 로컬 상태 업데이트
    const editObserveHandler = () => {
      syncFromYjs();
    };

    // 확정 데이터 변경 감지 → Zustand store 업데이트
    const confirmedObserveHandler = (event: Y.YMapEvent<ConfirmedNodeData>) => {
      event.keysChanged.forEach((key) => {
        const confirmedData = yConfirmed.get(key);
        if (confirmedData) {
          console.log(
            '[useNodeDetailCrdt] 확정 데이터 수신:',
            key,
            confirmedData
          );
          applyConfirmedData(Number(key), confirmedData);
        }
      });
    };

    yNodeDetails.observeDeep(editObserveHandler);
    yConfirmed.observe(confirmedObserveHandler);

    // 현재 노드의 편집 데이터가 이미 있다면 동기화
    if (nodeId && yNodeDetails.has(nodeId)) {
      syncFromYjs();
    }

    return () => {
      yNodeDetails.unobserveDeep(editObserveHandler);
      yConfirmed.unobserve(confirmedObserveHandler);
      yNodeDetailsRef.current = null;
      yConfirmedRef.current = null;
    };
  }, [nodeId, syncFromYjs, applyConfirmedData]);

  // 편집 시작: Y.Map에 현재 데이터 생성
  const startEdit = useCallback(() => {
    const client = getCrdtClient();
    if (!client || !nodeId || !initialData) {
      console.warn('[useNodeDetailCrdt] 편집을 시작할 수 없습니다.');
      return;
    }

    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');

    client.yDoc.transact(() => {
      const yNodeDetail = new Y.Map<YNodeDetailValue>();
      yNodeDetail.set('status', initialData.status);
      yNodeDetail.set('priority', initialData.priority);
      yNodeDetail.set('difficult', initialData.difficult);
      yNodeDetail.set('assignee', initialData.assignee);
      yNodeDetail.set('note', initialData.note);
      yNodeDetails.set(nodeId, yNodeDetail);
    });

    setIsEditing(true);
    setEditData(initialData);
    console.log('[useNodeDetailCrdt] 편집 시작:', nodeId);
  }, [nodeId, initialData]);

  // 필드 업데이트: Y.Map에 변경사항 반영 (자동 브로드캐스트)
  const updateField = useCallback(
    <K extends keyof EditableNodeDetail>(
      field: K,
      value: EditableNodeDetail[K]
    ) => {
      if (!yNodeDetailsRef.current || !nodeId) return;

      const yNodeDetail = yNodeDetailsRef.current.get(nodeId);
      if (!yNodeDetail) {
        console.warn('[useNodeDetailCrdt] 편집 중인 노드가 없습니다.');
        return;
      }

      yNodeDetail.set(field, value as YNodeDetailValue);
      console.log('[useNodeDetailCrdt] 필드 업데이트:', field, value);
    },
    [nodeId]
  );

  // 편집 완료: 서버에 저장 + 확정 데이터 브로드캐스트 + 편집 데이터 삭제
  const finishEdit = useCallback(async () => {
    if (!nodeId || !editData) {
      console.warn('[useNodeDetailCrdt] 저장할 데이터가 없습니다.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. 서버에 저장
      if (onSave) {
        await onSave();
      }

      const client = getCrdtClient();
      if (client) {
        // 2. 확정 데이터를 Y.Map에 저장 (다른 클라이언트에 브로드캐스트)
        const yConfirmed =
          client.getYMap<ConfirmedNodeData>('confirmedNodeData');
        const confirmedData: ConfirmedNodeData = {
          status: editData.status,
          priority: editData.priority,
          difficult: editData.difficult,
          assignee: editData.assignee,
          note: editData.note,
        };
        yConfirmed.set(nodeId, confirmedData);
        console.log(
          '[useNodeDetailCrdt] 확정 데이터 브로드캐스트:',
          nodeId,
          confirmedData
        );

        // 3. 로컬 store에도 즉시 반영
        applyConfirmedData(Number(nodeId), confirmedData);

        // 4. 편집 데이터 삭제 (메모리 누수 방지)
        const yNodeDetails =
          client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
        yNodeDetails.delete(nodeId);
      }

      setIsEditing(false);
      console.log('[useNodeDetailCrdt] 편집 완료 및 저장:', nodeId);
    } catch (error) {
      console.error('[useNodeDetailCrdt] 저장 실패:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [nodeId, editData, onSave, applyConfirmedData]);

  // 편집 취소: Y.Map에서 삭제 (저장 없이)
  const cancelEdit = useCallback(() => {
    if (!nodeId) return;

    const client = getCrdtClient();
    if (client) {
      const yNodeDetails =
        client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
      yNodeDetails.delete(nodeId);
    }

    setIsEditing(false);
    setEditData(null);
    console.log('[useNodeDetailCrdt] 편집 취소:', nodeId);
  }, [nodeId]);

  return {
    isEditing,
    editData,
    isSaving,
    startEdit,
    updateField,
    finishEdit,
    cancelEdit,
  };
};

export default useNodeDetailCrdt;
