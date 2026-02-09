import { useCallback } from 'react';
import {
  useNodeDetailStore,
  useSelectedNodeId,
  useIsNodeDetailOpen,
  useIsEditing,
  useEditData,
  useIsSaving,
  nodeDetailCrdtService,
  previewNodesCrdtService,
  type EditableNodeDetail,
} from '@/features/workspace-core';

/**
 * 노드 상세 편집 Hook
 * - Store 상태 구독
 * - Service 메서드 래핑
 */
export function useNodeDetailEdit() {
  // Store 상태 구독
  const selectedNodeId = useSelectedNodeId();
  const isOpen = useIsNodeDetailOpen();
  const isEditing = useIsEditing();
  const editData = useEditData();
  const isSaving = useIsSaving();

  // Store 액션
  const { openSidebar: storeOpenSidebar, closeSidebar: storeCloseSidebar } =
    useNodeDetailStore.getState();

  // 사이드바 열기 (편집 데이터 복원 포함)
  const openSidebar = useCallback(
    (nodeId: string) => {
      // 다른 노드 선택 시 기존 편집 취소
      if (isEditing && selectedNodeId !== nodeId) {
        nodeDetailCrdtService.cancelEdit();
      }

      storeOpenSidebar(nodeId);

      // 편집 데이터 복원 확인
      nodeDetailCrdtService.checkAndRestoreEditData(nodeId);
    },
    [isEditing, selectedNodeId, storeOpenSidebar]
  );

  // 사이드바 닫기
  const closeSidebar = useCallback(() => {
    if (isEditing) {
      nodeDetailCrdtService.cancelEdit();
    }

    // 프리뷰 모드인 경우, pending 중이 아닌 preview 노드 제거
    // closure 문제를 피하기 위해 최신 상태를 직접 확인
    const store = useNodeDetailStore.getState();
    if (store.candidatePreviewMode) {
      let previewNodeId: string | null = null;
      if (store.previewKind === 'candidate' && store.previewCandidate) {
        previewNodeId = `preview-${store.previewCandidate.id}`;
      } else if (store.previewKind === 'custom' && store.customDraft) {
        previewNodeId = store.customDraft.previewNodeId;
      }

      if (previewNodeId && !store.creatingPreviewIds.has(previewNodeId)) {
        previewNodesCrdtService.removePreviewNode(previewNodeId);
      }
    }

    storeCloseSidebar();
  }, [isEditing, storeCloseSidebar]);

  // 편집 시작
  const startEdit = useCallback(() => {
    nodeDetailCrdtService.startEdit();
  }, []);

  // 편집 완료
  const finishEdit = useCallback(async () => {
    await nodeDetailCrdtService.finishEdit();
  }, []);

  // 편집 취소
  const cancelEdit = useCallback(() => {
    nodeDetailCrdtService.cancelEdit();
  }, []);
  /** 필드 업데이트 (field: 필드 타입(status, priority, difficult, assignee, note), value: 필드값) */
  const updateField = useCallback(
    <K extends keyof EditableNodeDetail>(
      field: K,
      value: EditableNodeDetail[K]
    ) => {
      nodeDetailCrdtService.updateField(field, value);
    },
    []
  );

  return {
    // 상태
    selectedNodeId,
    isOpen,
    isEditing,
    editData,
    isSaving,

    // 액션
    openSidebar,
    closeSidebar,
    startEdit,
    finishEdit,
    cancelEdit,
    updateField,
  };
}
