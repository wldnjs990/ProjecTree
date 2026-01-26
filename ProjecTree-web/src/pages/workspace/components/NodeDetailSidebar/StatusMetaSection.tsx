import { NodeStatusField } from './NodeStatus';
import { NodePriorityField } from './NodePriority';
import { NodeDifficultyField } from './NodeDifficulty';
import { NodeAssignee } from './NodeAssignee';
import {
  useDisplayData,
  useIsEditing,
  useNodeDetailEditStore,
} from '../../stores/nodeDetailEditStore';
import type { NodeStatus, Priority, Assignee } from './types';

export function StatusMetaSection() {
  // Store에서 상태 구독
  const displayData = useDisplayData();
  const isEdit = useIsEditing();
  const updateField = useNodeDetailEditStore((state) => state.updateField);

  if (!displayData) return null;

  // 필드 변경 핸들러
  const handleStatusChange = (value: NodeStatus) => {
    updateField('status', value);
  };

  const handlePriorityChange = (value: Priority) => {
    updateField('priority', value);
  };

  const handleDifficultyChange = (value: number) => {
    updateField('difficult', value);
  };

  const handleAssigneeChange = (value: Assignee | null) => {
    updateField('assignee', value);
  };

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
            value={displayData.status}
            isEdit={isEdit}
            onChange={handleStatusChange}
          />
        </div>

        {/* 우선순위 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#61626F]">우선순위</span>
          <NodePriorityField
            value={displayData.priority}
            isEdit={isEdit}
            onChange={handlePriorityChange}
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
            onChange={handleAssigneeChange}
            value={displayData.assignee}
          />
        </div>

        {/* 난이도 */}
        <div className="space-y-1">
          <span className="text-xs text-[#61626F]">난이도</span>
          <NodeDifficultyField
            value={displayData.difficult}
            isEdit={isEdit}
            onChange={handleDifficultyChange}
          />
        </div>
      </div>
    </div>
  );
}
