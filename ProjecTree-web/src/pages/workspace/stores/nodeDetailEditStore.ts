import { create } from 'zustand';
import * as Y from 'yjs';
import { getCrdtClient } from '../crdt/crdtClient';
import { useNodeStore, type ConfirmedNodeData } from './nodeStore';
import type {
  NodeStatus,
  Priority,
  Assignee,
  NodeDetailData,
  NodeData,
} from '../components/NodeDetailSidebar/types';

// 편집 가능한 노드 상세 필드 타입
export interface EditableNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
}

// Y.Map에 저장되는 값 타입
type YNodeDetailValue = string | number | Assignee | null | undefined;

interface NodeDetailEditState {
  // === 상태 ===
  selectedNodeId: string | null;
  isOpen: boolean;
  isEditing: boolean;
  editData: EditableNodeDetail | null;
  isSaving: boolean;

  // Y.Map 참조 (내부 관리)
  _yNodeDetailsRef: Y.Map<Y.Map<YNodeDetailValue>> | null;
  _yConfirmedRef: Y.Map<ConfirmedNodeData> | null;
  _cleanupFn: (() => void) | null;

  // === 액션 ===
  // 사이드바 열기/닫기
  openSidebar: (nodeId: string) => void;
  closeSidebar: () => void;

  // 편집 모드
  startEdit: () => void;
  finishEdit: () => Promise<void>;
  cancelEdit: () => void;

  // 필드 업데이트
  updateField: <K extends keyof EditableNodeDetail>(
    field: K,
    value: EditableNodeDetail[K]
  ) => void;

  // CRDT 초기화/정리
  initCrdtObservers: () => void;
  cleanupCrdtObservers: () => void;

  // 내부 동기화
  _syncFromYjs: () => void;
  _setEditData: (data: EditableNodeDetail | null) => void;
}

export const useNodeDetailEditStore = create<NodeDetailEditState>(
  (set, get) => ({
    // === 초기 상태 ===
    selectedNodeId: null,
    isOpen: false,
    isEditing: false,
    editData: null,
    isSaving: false,
    _yNodeDetailsRef: null,
    _yConfirmedRef: null,
    _cleanupFn: null,

    // === 사이드바 열기/닫기 ===
    openSidebar: (nodeId) => {
      const { isEditing, cancelEdit, selectedNodeId, _yNodeDetailsRef } = get();

      // 다른 노드 선택 시 기존 편집 취소
      if (isEditing && selectedNodeId !== nodeId) {
        cancelEdit();
      }

      set({ selectedNodeId: nodeId, isOpen: true });

      // 선택한 노드의 편집 데이터가 Y.Map에 있으면 편집 모드로 복원
      if (_yNodeDetailsRef && _yNodeDetailsRef.has(nodeId)) {
        // 상태 업데이트 후 동기화 (다음 틱에서 실행)
        setTimeout(() => {
          get()._syncFromYjs();
          console.log(
            '[nodeDetailEditStore] 노드 선택 시 편집 데이터 복원:',
            nodeId
          );
        }, 0);
      }
    },

    closeSidebar: () => {
      const { isEditing, cancelEdit } = get();

      if (isEditing) {
        cancelEdit();
      }

      set({ isOpen: false });
    },

    // === 편집 시작 ===
    startEdit: () => {
      const { selectedNodeId } = get();
      const client = getCrdtClient();

      if (!client || !selectedNodeId) {
        console.warn('[nodeDetailEditStore] 편집을 시작할 수 없습니다.');
        return;
      }

      // nodeStore에서 초기 데이터 가져오기
      const nodeStore = useNodeStore.getState();
      const numericId = Number(selectedNodeId);
      const nodeListData = nodeStore.nodeListData[numericId];
      const nodeDetail = nodeStore.nodeDetails[numericId];

      if (!nodeListData || !nodeDetail) {
        console.warn('[nodeDetailEditStore] 노드 데이터가 없습니다.');
        return;
      }

      const initialData: EditableNodeDetail = {
        status: nodeListData.status,
        priority: nodeListData.priority,
        difficult: nodeListData.difficult,
        assignee: nodeDetail.assignee,
        note: nodeDetail.note,
      };

      // Y.Map에 편집 데이터 생성
      const yNodeDetails =
        client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');

      client.yDoc.transact(() => {
        const yNodeDetail = new Y.Map<YNodeDetailValue>();
        yNodeDetail.set('status', initialData.status);
        yNodeDetail.set('priority', initialData.priority);
        yNodeDetail.set('difficult', initialData.difficult);
        yNodeDetail.set('assignee', initialData.assignee);
        yNodeDetail.set('note', initialData.note);
        yNodeDetails.set(selectedNodeId, yNodeDetail);
      });

      set({ isEditing: true, editData: initialData });
      console.log('[nodeDetailEditStore] 편집 시작:', selectedNodeId);
    },

    // === 편집 완료 ===
    finishEdit: async () => {
      const { selectedNodeId, editData } = get();

      if (!selectedNodeId || !editData) {
        console.warn('[nodeDetailEditStore] 저장할 데이터가 없습니다.');
        return;
      }

      set({ isSaving: true });

      try {
        const client = getCrdtClient();

        // 1. CRDT 서버를 통해 DB에 저장 요청
        if (client) {
          const requestId = client.saveNodeDetail();
          if (requestId) {
            console.log(
              '[nodeDetailEditStore] 저장 요청 성공, requestId:',
              requestId
            );
          }
        }

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
          yConfirmed.set(selectedNodeId, confirmedData);
          console.log(
            '[nodeDetailEditStore] 확정 데이터 브로드캐스트:',
            selectedNodeId,
            confirmedData
          );

          // 3. 로컬 store에도 즉시 반영
          useNodeStore
            .getState()
            .applyConfirmedData(Number(selectedNodeId), confirmedData);

          // 4. 편집 데이터 삭제 (메모리 누수 방지)
          const yNodeDetails =
            client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
          yNodeDetails.delete(selectedNodeId);
        }

        set({ isEditing: false, editData: null });
        console.log('[nodeDetailEditStore] 편집 완료:', selectedNodeId);
      } catch (error) {
        console.error('[nodeDetailEditStore] 저장 실패:', error);
        throw error;
      } finally {
        set({ isSaving: false });
      }
    },

    // === 편집 취소 ===
    cancelEdit: () => {
      const { selectedNodeId } = get();

      if (!selectedNodeId) return;

      const client = getCrdtClient();
      if (client) {
        const yNodeDetails =
          client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
        yNodeDetails.delete(selectedNodeId);
      }

      set({ isEditing: false, editData: null });
      console.log('[nodeDetailEditStore] 편집 취소:', selectedNodeId);
    },

    // === 필드 업데이트 ===
    updateField: (field, value) => {
      const { selectedNodeId, _yNodeDetailsRef } = get();

      if (!_yNodeDetailsRef || !selectedNodeId) return;

      const yNodeDetail = _yNodeDetailsRef.get(selectedNodeId);
      if (!yNodeDetail) {
        console.warn('[nodeDetailEditStore] 편집 중인 노드가 없습니다.');
        return;
      }

      yNodeDetail.set(field, value as YNodeDetailValue);
      console.log('[nodeDetailEditStore] 필드 업데이트:', field, value);
    },

    // === CRDT 옵저버 초기화 ===
    initCrdtObservers: () => {
      const client = getCrdtClient();
      if (!client) {
        console.warn(
          '[nodeDetailEditStore] CRDT 클라이언트가 초기화되지 않았습니다.'
        );
        return;
      }

      // 편집 중 데이터용 Y.Map
      const yNodeDetails =
        client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');

      // 확정 데이터용 Y.Map
      const yConfirmed = client.getYMap<ConfirmedNodeData>('confirmedNodeData');

      // 편집 데이터 변경 감지
      const editObserveHandler = () => {
        get()._syncFromYjs();
      };

      // 확정 데이터 변경 감지 → Zustand store 업데이트
      const confirmedObserveHandler = (
        event: Y.YMapEvent<ConfirmedNodeData>
      ) => {
        event.keysChanged.forEach((key) => {
          const confirmedData = yConfirmed.get(key);
          if (confirmedData) {
            console.log(
              '[nodeDetailEditStore] 확정 데이터 수신:',
              key,
              confirmedData
            );
            useNodeStore.getState().applyConfirmedData(Number(key), confirmedData);
          }
        });
      };

      yNodeDetails.observeDeep(editObserveHandler);
      yConfirmed.observe(confirmedObserveHandler);

      // 기존 데이터 로드 함수
      const loadExistingData = () => {
        // 기존 확정 데이터 초기 로드
        yConfirmed.forEach((confirmedData, key) => {
          console.log(
            '[nodeDetailEditStore] 기존 확정 데이터 로드:',
            key,
            confirmedData
          );
          useNodeStore.getState().applyConfirmedData(Number(key), confirmedData);
        });

        // 기존 편집 데이터가 있으면 동기화
        const { selectedNodeId } = get();
        if (selectedNodeId && yNodeDetails.has(selectedNodeId)) {
          get()._syncFromYjs();
          console.log(
            '[nodeDetailEditStore] 기존 편집 데이터 복원:',
            selectedNodeId
          );
        }
      };

      // sync 이벤트 핸들러
      const syncHandler = (isSynced: boolean) => {
        if (isSynced) {
          console.log('[nodeDetailEditStore] Y.js 동기화 완료, 기존 데이터 로드');
          loadExistingData();
        }
      };

      // 이미 동기화된 상태면 바로 로드, 아니면 sync 이벤트 대기
      if (client.provider.synced) {
        console.log('[nodeDetailEditStore] 이미 동기화됨, 기존 데이터 즉시 로드');
        loadExistingData();
      } else {
        client.provider.once('sync', syncHandler);
      }

      const cleanupFn = () => {
        yNodeDetails.unobserveDeep(editObserveHandler);
        yConfirmed.unobserve(confirmedObserveHandler);
        client.provider.off('sync', syncHandler);
      };

      set({
        _yNodeDetailsRef: yNodeDetails,
        _yConfirmedRef: yConfirmed,
        _cleanupFn: cleanupFn,
      });

      console.log('[nodeDetailEditStore] CRDT 옵저버 초기화 완료');
    },

    // === CRDT 옵저버 정리 ===
    cleanupCrdtObservers: () => {
      const { _cleanupFn } = get();

      if (_cleanupFn) {
        _cleanupFn();
      }

      set({
        _yNodeDetailsRef: null,
        _yConfirmedRef: null,
        _cleanupFn: null,
      });

      console.log('[nodeDetailEditStore] CRDT 옵저버 정리 완료');
    },

    // === 내부: Y.js에서 데이터 동기화 ===
    _syncFromYjs: () => {
      const { _yNodeDetailsRef, selectedNodeId } = get();

      if (!_yNodeDetailsRef || !selectedNodeId) return;

      const yNodeDetail = _yNodeDetailsRef.get(selectedNodeId);
      if (!yNodeDetail) {
        // 편집 데이터가 없으면 편집 모드 종료
        set({ isEditing: false, editData: null });
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

      set({ editData: data, isEditing: true });
    },

    // === 내부: editData 설정 ===
    _setEditData: (data) => {
      set({ editData: data });
    },
  })
);

// ===== Selector hooks =====

/** 선택된 노드 ID */
export const useSelectedNodeId = () =>
  useNodeDetailEditStore((state) => state.selectedNodeId);

/** 사이드바 열림 상태 */
export const useIsNodeDetailOpen = () =>
  useNodeDetailEditStore((state) => state.isOpen);

/** 편집 모드 상태 */
export const useIsEditing = () =>
  useNodeDetailEditStore((state) => state.isEditing);

/** 편집 중인 데이터 */
export const useEditData = () =>
  useNodeDetailEditStore((state) => state.editData);

/** 저장 중 상태 */
export const useIsSaving = () =>
  useNodeDetailEditStore((state) => state.isSaving);

/** 특정 편집 필드 값 */
export const useEditField = <K extends keyof EditableNodeDetail>(field: K) =>
  useNodeDetailEditStore((state) => state.editData?.[field]);

/** 표시용 데이터 (편집 중이면 editData, 아니면 store 원본) */
export const useDisplayData = () => {
  const isEditing = useNodeDetailEditStore((state) => state.isEditing);
  const editData = useNodeDetailEditStore((state) => state.editData);
  const selectedNodeId = useNodeDetailEditStore(
    (state) => state.selectedNodeId
  );

  const numericId = selectedNodeId ? Number(selectedNodeId) : null;
  const nodeListData = useNodeStore((state) =>
    numericId ? state.nodeListData[numericId] : null
  );
  const nodeDetail = useNodeStore((state) =>
    numericId ? state.nodeDetails[numericId] : null
  );

  if (isEditing && editData) {
    return editData;
  }

  if (nodeListData && nodeDetail) {
    return {
      status: nodeListData.status,
      priority: nodeListData.priority,
      difficult: nodeListData.difficult,
      assignee: nodeDetail.assignee,
      note: nodeDetail.note,
    };
  }

  return null;
};

/** 선택된 노드 상세 데이터 */
export const useSelectedNodeDetail = (): NodeDetailData | null => {
  const selectedNodeId = useNodeDetailEditStore(
    (state) => state.selectedNodeId
  );
  const numericId = selectedNodeId ? Number(selectedNodeId) : null;

  return useNodeStore((state) =>
    numericId ? state.nodeDetails[numericId] : null
  );
};

/** 선택된 노드 목록 데이터 */
export const useSelectedNodeListData = (): NodeData | null => {
  const selectedNodeId = useNodeDetailEditStore(
    (state) => state.selectedNodeId
  );
  const numericId = selectedNodeId ? Number(selectedNodeId) : null;

  return useNodeStore((state) =>
    numericId ? state.nodeListData[numericId] : null
  );
};
