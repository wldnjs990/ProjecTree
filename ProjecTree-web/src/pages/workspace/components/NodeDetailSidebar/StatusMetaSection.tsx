import type { NodeStatus, Priority, Assignee } from './types';
import { NodeStatusField } from './NodeStatus';
import { NodePriorityField } from './NodePriority';
import { NodeDifficultyField } from './NodeDifficulty';
import { NodeAssignee } from './NodeAssignee';

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
          <NodeStatusField
            value={data.status}
            isEdit={isEdit}
            onChange={onStatusChange}
          />
        </div>

        {/* 우선순위 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#61626F]">우선순위</span>
          <NodePriorityField
            value={data.priority}
            isEdit={isEdit}
            onChange={onPriorityChange}
          />
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[rgba(227,228,235,0.5)] pt-3 space-y-3">
        {/* 담당자 */}
        <div className="space-y-1">
          <span className="text-xs text-[#61626F]">담당자</span>
          <NodeAssignee
            isEdit={isEdit}
            onChange={onAssigneeChange}
            value={data.assignee}
          />
        </div>

        {/* 난이도 */}
        <div className="space-y-1">
          <span className="text-xs text-[#61626F]">난이도</span>
          <NodeDifficultyField
            value={data.difficult}
            isEdit={isEdit}
            onChange={onDifficultyChange}
          />
        </div>
      </div>
    </div>
  );
}
