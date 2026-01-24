import type { NodeStatus, Priority, Assignee } from './types2';
import { StatusSelect, SelectedStatus } from './NodeStatus';
import { PrioritySelect, SelectedPriority } from './NodePriority';
import { DifficultySelect, SelectedDifficulty } from './NodeDifficulty';
import { AssigneeSelect, SelectedAssignee } from './NodeAssignee';

interface StatusMetaSectionData {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
}

interface StatusMetaSectionProps {
  data: StatusMetaSectionData;
  isEdit: boolean;
  onStatusChange?: (value: NodeStatus) => void;
  onPriorityChange?: (value: Priority) => void;
  onDifficultyChange?: (value: number) => void;
  onAssigneeChange?: (value: Assignee | null) => void;
}

export function StatusMetaSection({
  data,
  isEdit,
  onStatusChange,
  onPriorityChange,
  onDifficultyChange,
  onAssigneeChange,
}: StatusMetaSectionProps) {
  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm p-4 space-y-4">
      {/* 섹션 헤더 */}
      <h3 className="text-xs font-medium text-[#61626F] uppercase tracking-wider">
        Status & Meta
      </h3>

      {/* 상태 & 우선순위 */}
      <div className="flex items-center gap-8">
        {/* 상태 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#61626F]">상태</span>
          {isEdit && onStatusChange ? (
            <StatusSelect value={data.status} onChange={onStatusChange} />
          ) : (
            <SelectedStatus status={data.status} />
          )}
        </div>

        {/* 우선순위 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#61626F]">우선순위</span>
          {isEdit && onPriorityChange ? (
            <PrioritySelect value={data.priority} onChange={onPriorityChange} />
          ) : data.priority ? (
            <SelectedPriority priority={data.priority} />
          ) : (
            <span className="text-sm text-muted-foreground">미지정</span>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[rgba(227,228,235,0.5)] pt-3 space-y-3">
        {/* 담당자 */}
        <div className="space-y-1">
          <span className="text-xs text-[#61626F]">담당자</span>
          {isEdit && onAssigneeChange ? (
            <AssigneeSelect value={data.assignee} onChange={onAssigneeChange} />
          ) : (
            <SelectedAssignee assignee={data.assignee} />
          )}
        </div>

        {/* 난이도 */}
        <div className="space-y-1">
          <span className="text-xs text-[#61626F]">난이도</span>
          {isEdit && onDifficultyChange ? (
            <DifficultySelect value={data.difficult} onChange={onDifficultyChange} />
          ) : (
            <SelectedDifficulty difficulty={data.difficult} />
          )}
        </div>
      </div>
    </div>
  );
}
