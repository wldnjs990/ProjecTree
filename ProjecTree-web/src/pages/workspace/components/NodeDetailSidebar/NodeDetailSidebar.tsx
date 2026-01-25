import type {
  NodeDetailData,
  NodeStatus,
  Priority,
  Assignee,
  Candidate,
  NodeData,
} from './types';
import { NodeHeader } from './NodeHeader';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeRecommendSection } from './AINodeRecommendSection';
import { MemoSection } from './MemoSection';
import { cn } from '@/lib/utils';

// 편집 가능한 데이터 타입
export interface EditableNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
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
  // 이벤트 핸들러
  onClose: () => void;
  toggleEdit: () => void;
  // 편집 핸들러
  onStatusChange?: (value: NodeStatus) => void;
  onPriorityChange?: (value: Priority) => void;
  onDifficultyChange?: (value: number) => void;
  onAssigneeChange?: (value: Assignee | null) => void;
  onNoteChange?: (value: string) => void;
  // 기타 핸들러
  onTechCompare?: () => void;
  onTechAddManual?: () => void;
  onNodeAdd?: (node: Candidate) => void;
  onNodeAddManual?: () => void;
  className?: string;
}

export function NodeDetailSidebar({
  nodeDetail,
  nodeListData,
  nodeInfo,
  isOpen,
  isEdit,
  editData,
  onClose,
  toggleEdit,
  onStatusChange,
  onPriorityChange,
  onDifficultyChange,
  onAssigneeChange,
  onNoteChange,
  onTechCompare,
  onTechAddManual,
  onNodeAdd,
  onNodeAddManual,
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
        <div className="p-4 space-y-4">
          {/* 노드 헤더 */}
          <NodeHeader
            nodeInfo={nodeInfo}
            description={nodeDetail.description}
            onClose={onClose}
            toggleEdit={toggleEdit}
            isEdit={isEdit}
          />

          {/* Status & Meta 섹션 */}
          <StatusMetaSection
            data={displayData}
            isEdit={isEdit}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
            onDifficultyChange={onDifficultyChange}
            onAssigneeChange={onAssigneeChange}
          />

          {/* AI 기술 추천 섹션 */}
          {nodeDetail.techs && nodeDetail.techs.length > 0 && (
            <AITechRecommendSection
              isEdit={isEdit}
              recommendations={nodeDetail.techs}
              comparison={nodeDetail.comparison}
              onCompare={onTechCompare}
              onAddManual={onTechAddManual}
            />
          )}

          {/* AI 다음 노드 추천 섹션 */}
          {nodeDetail.candidates && nodeDetail.candidates.length > 0 && (
            <AINodeRecommendSection
              recommendations={nodeDetail.candidates}
              onAddNode={onNodeAdd}
              onAddManual={onNodeAddManual}
            />
          )}

          {/* 메모 섹션 */}
          <MemoSection
            note={displayData.note}
            isEdit={isEdit}
            onNoteChange={onNoteChange}
          />
        </div>
      </div>
    </div>
  );
}
