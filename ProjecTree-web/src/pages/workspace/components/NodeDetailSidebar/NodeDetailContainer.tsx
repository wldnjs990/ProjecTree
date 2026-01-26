import type { NodeDetailData, NodeStatus, Priority, Assignee, Candidate } from './types';
import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';

interface DisplayData {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
}

interface NodeDetailHandlers {
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

interface NodeDetailContainerProps {
  nodeDetail: NodeDetailData;
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  isEdit: boolean;
  displayData: DisplayData;
  handlers: NodeDetailHandlers;
}

export default function NodeDetailContainer({
  nodeDetail,
  nodeInfo,
  isEdit,
  displayData,
  handlers,
}: NodeDetailContainerProps) {
  const {
    onClose,
    toggleEdit,
    onStatusChange,
    onPriorityChange,
    onDifficultyChange,
    onAssigneeChange,
    onNoteChange,
    onTechCompare,
    onTechAddManual,
    onCandidateClick,
    onCandidateAddManual,
  } = handlers;

  return (
    <div className="p-4 space-y-4">
      {/* 노드 헤더 */}
      <NodeHeaderSection
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

      {/* 메모 섹션 */}
      <MemoSection
        note={displayData.note}
        isEdit={isEdit}
        onNoteChange={onNoteChange}
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
        <AINodeCandidateSection
          candidates={nodeDetail.candidates}
          onCandidateClick={onCandidateClick}
          onAddManual={onCandidateAddManual}
        />
      )}
    </div>
  );
}
