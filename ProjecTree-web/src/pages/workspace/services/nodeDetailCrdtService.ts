import * as Y from 'yjs';
import { getCrdtClient } from '../crdt/crdtClient';
import { useNodeStore, type ConfirmedNodeData } from '../stores/nodeStore';
import {
  useNodeDetailStore,
  type EditableNodeDetail,
} from '../stores/nodeDetailStore';
import type {
  NodeStatus,
  Priority,
  Assignee,
  NodeType,
} from '../components/NodeDetailSidebar/types';

// Y.Map에 저장되는 값 타입
type YNodeDetailValue = string | number | Assignee | null | undefined;

/**
 * 노드 상세 편집 CRDT 서비스 (싱글톤)
 * - Y.Map 옵저버 관리
 * - 편집 시작/완료/취소 로직
 * - 필드 업데이트 로직
 */
class NodeDetailCrdtService {
  private static instance: NodeDetailCrdtService | null = null;

  private yNodeDetailsRef: Y.Map<Y.Map<YNodeDetailValue>> | null = null;
  private yNodeTechsRef: Y.Map<number | null> | null = null;
  private yConfirmedRef: Y.Map<ConfirmedNodeData> | null = null;
  private cleanupFn: (() => void) | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NodeDetailCrdtService {
    if (!NodeDetailCrdtService.instance) {
      NodeDetailCrdtService.instance = new NodeDetailCrdtService();
    }
    return NodeDetailCrdtService.instance;
  }

  /**
   * CRDT 옵저버 초기화
   */
  initObservers(): void {
    if (this.isInitialized) {
      console.log('[NodeDetailCrdtService] 이미 초기화됨');
      return;
    }

    const client = getCrdtClient();
    if (!client) {
      console.warn('[NodeDetailCrdtService] CRDT 클라이언트가 없습니다.');
      return;
    }

    // Y.Map 참조 가져오기
    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
    const yNodeTechs = client.getYMap<number | null>('nodeTechs');
    const yConfirmed = client.getYMap<ConfirmedNodeData>('confirmedNodeData');

    // 편집 데이터 변경 감지
    const editObserveHandler = () => {
      this.syncFromYjs();
    };

    // 확정 데이터 변경 감지 → nodeStore 업데이트
    const confirmedObserveHandler = (event: Y.YMapEvent<ConfirmedNodeData>) => {
      event.keysChanged.forEach((key) => {
        const confirmedData = yConfirmed.get(key);
        if (confirmedData) {
          console.log(
            '[NodeDetailCrdtService] 확정 데이터 수신:',
            key,
            confirmedData
          );
          useNodeStore
            .getState()
            .applyConfirmedData(Number(key), confirmedData);
        }
      });
    };

    // 기술 스택 선택 변경 감지 → 편집 데이터에 반영
    const nodeTechsObserveHandler = (event: Y.YMapEvent<number | null>) => {
      const { selectedNodeId, editData, isEditing } =
        useNodeDetailStore.getState();
      if (!selectedNodeId) return;

      event.keysChanged.forEach((key) => {
        if (key !== selectedNodeId) return;
        const selectedTechId = yNodeTechs.get(key) ?? null;
        useNodeDetailStore.getState().setSelectedTechId(selectedTechId);

        if (isEditing && editData) {
          useNodeDetailStore
            .getState()
            .setEditData({ ...editData, selectedTechId });
        }
      });
    };

    yNodeDetails.observeDeep(editObserveHandler);
    yNodeTechs.observe(nodeTechsObserveHandler);
    yConfirmed.observe(confirmedObserveHandler);

    // 기존 데이터 로드 함수
    const loadExistingData = () => {
      // 기존 확정 데이터 초기 로드
      yConfirmed.forEach((confirmedData, key) => {
        console.log(
          '[NodeDetailCrdtService] 기존 확정 데이터 로드:',
          key,
          confirmedData
        );
        useNodeStore.getState().applyConfirmedData(Number(key), confirmedData);
      });

      // 기존 편집 데이터가 있으면 동기화
      const { selectedNodeId } = useNodeDetailStore.getState();
      if (selectedNodeId && yNodeDetails.has(selectedNodeId)) {
        this.syncFromYjs();
        console.log(
          '[NodeDetailCrdtService] 기존 편집 데이터 복원:',
          selectedNodeId
        );
      }
    };

    // sync 이벤트 핸들러
    const syncHandler = (isSynced: boolean) => {
      if (isSynced) {
        console.log(
          '[NodeDetailCrdtService] Y.js 동기화 완료, 기존 데이터 로드'
        );
        loadExistingData();
      }
    };

    // 이미 동기화된 상태면 바로 로드, 아니면 sync 이벤트 대기
    if (client.provider.synced) {
      console.log(
        '[NodeDetailCrdtService] 이미 동기화됨, 기존 데이터 즉시 로드'
      );
      loadExistingData();
    } else {
      client.provider.once('sync', syncHandler);
    }

    // cleanup 함수 저장
    this.cleanupFn = () => {
      yNodeDetails.unobserveDeep(editObserveHandler);
      yNodeTechs.unobserve(nodeTechsObserveHandler);
      yConfirmed.unobserve(confirmedObserveHandler);
      client.provider.off('sync', syncHandler);
    };

    this.yNodeDetailsRef = yNodeDetails;
    this.yNodeTechsRef = yNodeTechs;
    this.yConfirmedRef = yConfirmed;
    this.isInitialized = true;

    console.log('[NodeDetailCrdtService] 옵저버 초기화 완료');
  }

  /**
   * CRDT 옵저버 정리
   */
  cleanupObservers(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
    }

    this.yNodeDetailsRef = null;
    this.yNodeTechsRef = null;
    this.yConfirmedRef = null;
    this.cleanupFn = null;
    this.isInitialized = false;

    console.log('[NodeDetailCrdtService] 옵저버 정리 완료');
  }

  /**
   * 편집 시작
   */
  startEdit(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();
    const client = getCrdtClient();

    if (!client || !selectedNodeId) {
      console.warn('[NodeDetailCrdtService] 편집을 시작할 수 없습니다.');
      return;
    }

    // nodeStore에서 초기 데이터 가져오기
    const nodeStore = useNodeStore.getState();
    const numericId = Number(selectedNodeId);
    const nodeListData = nodeStore.nodeListData[numericId];
    const nodeDetail = nodeStore.nodeDetails[numericId];

    if (!nodeListData || !nodeDetail) {
      console.warn('[NodeDetailCrdtService] 노드 데이터가 없습니다.');
      return;
    }

    const nodeType = useNodeStore
      .getState()
      .nodes.find((n) => n.id === selectedNodeId)
      ?.type.toUpperCase() as NodeType;

    // 노드 서버 전송용 데이터타입(difficult 식별용 nodeType 추가)
    interface ServerEditableNodeDetail extends EditableNodeDetail {
      nodeType: NodeType;
    }
    const yNodeTechs = client.getYMap<number | null>('nodeTechs');
    const selectedTechIdFromMap = yNodeTechs.get(selectedNodeId) ?? null;

    const initialData: ServerEditableNodeDetail = {
      status: nodeListData.status,
      priority: nodeListData.priority,
      difficult: nodeListData.difficult,
      assignee: nodeDetail.assignee,
      note: nodeDetail.note,
      nodeType: nodeType,
      selectedTechId:
        selectedTechIdFromMap ??
        (nodeDetail.techs || []).find((tech) => tech.isSelected)?.id ??
        null,
    };

    // Y.Map에 편집 데이터 생성(없으면 생성)
    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');

    client.yDoc.transact(() => {
      const yNodeDetail = new Y.Map<YNodeDetailValue>();
      yNodeDetail.set('status', initialData.status);
      yNodeDetail.set('priority', initialData.priority);
      yNodeDetail.set('difficult', initialData.difficult);
      yNodeDetail.set('assignee', initialData.assignee);
      yNodeDetail.set('note', initialData.note);
      yNodeDetail.set('nodeType', initialData.nodeType);
      yNodeDetails.set(selectedNodeId, yNodeDetail);
    });

    // store 상태 업데이트
    const store = useNodeDetailStore.getState();
    store.setIsEditing(true);
    store.setEditData(initialData);
    store.setSelectedTechId(initialData.selectedTechId);

    console.log('[NodeDetailCrdtService] 편집 시작:', selectedNodeId);
  }

  /**
   * 편집 완료
   */
  async finishEdit(): Promise<void> {
    const { selectedNodeId, editData } = useNodeDetailStore.getState();

    if (!selectedNodeId || !editData) {
      console.warn('[NodeDetailCrdtService] 저장할 데이터가 없습니다.');
      return;
    }

    const store = useNodeDetailStore.getState();
    store.setIsSaving(true);

    try {
      const client = getCrdtClient();

      // 1. CRDT 서버를 통해 DB에 저장 요청
      if (client) {
        const requestId = client.saveNodeDetail(selectedNodeId);
        if (requestId) {
          console.log(
            '[NodeDetailCrdtService] 저장 요청 성공, requestId:',
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
          '[NodeDetailCrdtService] 확정 데이터 브로드캐스트:',
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

      store.setIsEditing(false);
      store.setEditData(null);
      console.log('[NodeDetailCrdtService] 편집 완료:', selectedNodeId);
    } catch (error) {
      console.error('[NodeDetailCrdtService] 저장 실패:', error);
      throw error;
    } finally {
      store.setIsSaving(false);
    }
  }

  /**
   * 편집 취소
   */
  cancelEdit(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!selectedNodeId) return;

    const client = getCrdtClient();
    if (client) {
      const yNodeDetails =
        client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
      yNodeDetails.delete(selectedNodeId);
    }

    const store = useNodeDetailStore.getState();
    store.setIsEditing(false);
    store.setEditData(null);

    console.log('[NodeDetailCrdtService] 편집 취소:', selectedNodeId);
  }

  /**
   * 필드 업데이트
   */
  updateField<K extends keyof EditableNodeDetail>(
    field: K,
    value: EditableNodeDetail[K]
  ): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!this.yNodeDetailsRef || !selectedNodeId) return;

    const yNodeDetail = this.yNodeDetailsRef.get(selectedNodeId);
    if (!yNodeDetail) {
      console.warn('[NodeDetailCrdtService] 편집 중인 노드가 없습니다.');
      return;
    }

    yNodeDetail.set(field, value as YNodeDetailValue);
    console.log('[NodeDetailCrdtService] 필드 업데이트:', field, value);
  }

  /**
   * 노드 기술 선택 정보(selectedTechId) 업데이트 메서드
   * 1. nodeTechs.nodeId = selectedTechId 형식으로 선택한 노드 데이터 ydoc에 업데이트 + 브로드캐스트
   * 2. CRDT 서버에 노드 기술 선택 변경사항 DB 업데이트 요청(selectNodeTech)
   */
  updateSelectedTech(nodeId: string, selectedTechId: number): void {
    const client = getCrdtClient();
    if (!client) return;

    const yNodeTechs =
      this.yNodeTechsRef ?? client.getYMap<number | null>('nodeTechs');
    // nodeTechs.nodeId = selectedTechId 형식으로 선택한 노드 데이터 ydoc에 업데이트 + 브로드캐스트
    yNodeTechs.set(nodeId, selectedTechId);
    // CRDT 서버로 select_node_tech 메시지 전송
    client.selectNodeTech(nodeId, selectedTechId);
    console.log(
      '[NodeDetailCrdtService] 필드 업데이트:',
      nodeId,
      selectedTechId
    );
  }

  /**
   * Y.js에서 로컬 store로 데이터 동기화
   */
  private syncFromYjs(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!this.yNodeDetailsRef || !selectedNodeId) return;

    const yNodeDetail = this.yNodeDetailsRef.get(selectedNodeId);
    if (!yNodeDetail) {
      // 편집 데이터가 없으면 편집 모드 종료
      const store = useNodeDetailStore.getState();
      store.setIsEditing(false);
      store.setEditData(null);
      return;
    }

    // Y.Map에서 데이터 읽어오기
    const data: EditableNodeDetail = {
      status: (yNodeDetail.get('status') as NodeStatus) || 'TODO',
      priority: yNodeDetail.get('priority') as Priority | undefined,
      difficult: (yNodeDetail.get('difficult') as number) || 1,
      assignee: yNodeDetail.get('assignee') as Assignee | null,
      note: (yNodeDetail.get('note') as string) || '',
      selectedTechId: this.yNodeTechsRef?.get(selectedNodeId) ?? null,
    };

    const store = useNodeDetailStore.getState();
    store.setEditData(data);
    store.setIsEditing(true);
    store.setSelectedTechId(data.selectedTechId);
  }

  /**
   * 사이드바 열기 시 편집 데이터 복원 확인
   */
  checkAndRestoreEditData(nodeId: string): void {
    if (this.yNodeDetailsRef && this.yNodeDetailsRef.has(nodeId)) {
      setTimeout(() => {
        this.syncFromYjs();
        console.log(
          '[NodeDetailCrdtService] 노드 선택 시 편집 데이터 복원:',
          nodeId
        );
      }, 0);
    }

    if (this.yNodeTechsRef) {
      const selectedTechId = this.yNodeTechsRef.get(nodeId) ?? null;
      useNodeDetailStore.getState().setSelectedTechId(selectedTechId);
    }
  }
}

// 싱글톤 인스턴스 export
export const nodeDetailCrdtService = NodeDetailCrdtService.getInstance();
