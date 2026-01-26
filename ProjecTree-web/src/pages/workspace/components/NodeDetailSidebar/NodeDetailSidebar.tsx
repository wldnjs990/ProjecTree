import type {
  NodeDetailData,
  NodeStatus,
  Priority,
  Assignee,
  Candidate,
  NodeData,
} from './types';
import { cn } from '@/lib/utils';
import CandidateNodeContainer from './CandidateNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';

// 편집 가능한 데이터 타입
export interface EditableNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
}

// 핸들러 타입 정의
export interface NodeDetailHandlers {
  onClose: () => void;
  toggleEdit: () => void;
  onStatusChange?: (value: NodeStatus) => void;
  onPriorityChange?: (value: Priority) => void;
  onDifficultyChange?: (value: number) => void;
  onAssigneeChange?: (value: Assignee | null) => void;
  onNoteChange?: (value: string) => void;
  onTechCompare?: () => void;
  onTechAddManual?: () => void;
  onCandidateClick?: (node: Candidate) => void;
  onCandidateAddManual?: () => void;
}

interface NodeDetailSidebarProps {
  // 노드 상세 데이터 (API에서 가져온 원본)
  nodeDetail: NodeDetailData | null;
  // 노드 목록 데이터 (status, priority, difficult)
  nodeListData: NodeData | null;
  // 노드 기본 정보 (헤더용)
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  // 상태
  isOpen: boolean;
  isEdit: boolean;
  // 편집 중인 데이터 (CRDT에서 관리)
  editData?: EditableNodeDetail | null;
  // 핸들러 (그룹화)
  handlers: NodeDetailHandlers;
  className?: string;
}

export function NodeDetailSidebar({
  nodeDetail,
  nodeListData,
  nodeInfo,
  isOpen,
  isEdit,
  editData,
  handlers,
  className,
}: NodeDetailSidebarProps) {
  if (!nodeDetail || !nodeListData) return null;

  // 편집 중일 때는 editData 사용, 아니면 원본 데이터 사용
  const displayData =
    isEdit && editData
      ? editData
      : {
          status: nodeListData.status,
          priority: nodeListData.priority,
          difficult: nodeListData.difficult,
          assignee: nodeDetail.assignee,
          note: nodeDetail.note,
        };

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-100 bg-white border-l border-[#E2E8F0] shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        className
      )}
    >
      {/* 스크롤 영역 */}
      <div className="h-full overflow-y-auto">
        <NodeDetailContainer
          nodeDetail={nodeDetail}
          nodeInfo={nodeInfo}
          isEdit={isEdit}
          displayData={displayData}
          handlers={handlers}
        />
        <CandidateNodeContainer
          nodeInfo={nodeInfo}
          description={nodeDetail.description}
        />
      </div>
    </div>
  );
}
