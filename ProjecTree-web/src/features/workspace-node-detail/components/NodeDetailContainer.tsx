import { useParams } from 'react-router';
import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import {
  useSelectedNodeDetail,
  useNodeDetailEdit,
  useNodeDetailActions,
  useSyncNodeDetailSelections,
} from '../hooks';
import { useSelectedNodeId, useNodes } from '@/features/workspace-core';
import { useUser } from '@/shared/stores/userStore';

interface NodeDetailContainerProps {
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  onShowDescription?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export default function NodeDetailContainer({
  nodeInfo,
  onShowDescription,
  onToggleExpand,
  isExpanded,
}: NodeDetailContainerProps) {
  const { workspaceId: paramWorkspaceId } = useParams<{ workspaceId: string }>();
  const workspaceId = paramWorkspaceId ? Number(paramWorkspaceId) : null;

  const nodeDetail = useSelectedNodeDetail();
  const selectedNodeId = useSelectedNodeId();
  const nodes = useNodes();
  const { isEditing, closeSidebar, startEdit, finishEdit } = useNodeDetailEdit();
  const currentUser = useUser();
  const currentUserId = String(currentUser?.memberId ?? currentUser?.id ?? '');

  useSyncNodeDetailSelections(nodeDetail);

  const isGeneratingCandidates = nodeDetail?.candidatesPending || false;
  const isGeneratingTechs = nodeDetail?.techsPending || false;

  const {
    handleCandidateClick,
    handleLockedCandidateClick,
    handleCandidateAddManual,
    handleGenerateTechs,
    handleGenerateCandidates,
    handleAddCustomTech,
    handleDeleteNode,
    handleDeleteCandidate,
  } = useNodeDetailActions({
    nodeDetail,
    selectedNodeId,
    workspaceId,
    nodes,
    currentUserId,
    closeSidebar,
  });

  if (!nodeDetail) return null;

  const nodeType = nodeInfo?.nodeType;
  const isTaskOrAdvance = nodeType ? nodeType === 'TASK' || nodeType === 'ADVANCE' : true;
  const showTechRecommend = isTaskOrAdvance;
  const showDifficulty = isTaskOrAdvance;
  const showCandidateSection = nodeType !== 'ADVANCE';

  const handleToggleEdit = async () => {
    if (!isEditing) {
      startEdit();
      return;
    }

    try {
      await finishEdit();
    } catch {
      return;
    }
  };

  return (
    <div className="p-4 space-y-4 pt-20">
      <NodeHeaderSection
        nodeInfo={nodeInfo}
        description={nodeDetail.description}
        onClose={closeSidebar}
        toggleEdit={handleToggleEdit}
        isEdit={isEditing}
        onShowDescription={onShowDescription}
        onToggleExpand={onToggleExpand}
        isExpanded={isExpanded}
        onDelete={handleDeleteNode}
      />

      <StatusMetaSection showDifficulty={showDifficulty} />

      <MemoSection />

      {showTechRecommend && (
        <AITechRecommendSection
          isEdit={isEditing}
          recommendations={nodeDetail.techs || []}
          comparison={nodeDetail.comparison}
          onGenerateTechs={handleGenerateTechs}
          isGenerating={isGeneratingTechs}
          onAddCustomTech={handleAddCustomTech}
        />
      )}

      {showCandidateSection && (
        <AINodeCandidateSection
          candidates={nodeDetail.candidates || []}
          onCandidateClick={handleCandidateClick}
          onCandidateDelete={handleDeleteCandidate}
          onLockedCandidateClick={handleLockedCandidateClick}
          onAddManual={handleCandidateAddManual}
          onGenerateCandidates={handleGenerateCandidates}
          isGenerating={isGeneratingCandidates}
        />
      )}
    </div>
  );
}
