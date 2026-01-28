import {
  useIsEditing,
  useEditData,
  useSelectedNodeId,
  type EditableNodeDetail,
} from '../stores/nodeDetailStore';
import { useNodeStore } from '../stores/nodeStore';

/**
 * 표시용 데이터 Hook
 * 편집 중이면 editData, 아니면 store 원본 데이터
 */
export function useDisplayData(): EditableNodeDetail | null {
  const isEditing = useIsEditing();
  const editData = useEditData();
  const selectedNodeId = useSelectedNodeId();

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
}
