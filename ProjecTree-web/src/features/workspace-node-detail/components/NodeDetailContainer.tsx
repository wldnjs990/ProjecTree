import { useEffect } from 'react';
import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import { useSelectedNodeDetail, useNodeDetailEdit } from '../hooks';
import {
  useSelectedNodeId,
  nodeDetailCrdtService,
  previewNodesCrdtService,
  useNodeDetailStore,
  useNodeStore,
  useNodes,
  calculateChildNodePosition,
  type FlowNode,
} from '@/features/workspace-core';
import { useUser } from '@/shared/stores/userStore';
import { generateNodeCandidates } from '@/apis/workspace.api';
import { getAiNodeTechRecommendation } from '@/apis/node.api';

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
  // Store state subscriptions
  const nodeDetail = useSelectedNodeDetail();
  const selectedNodeId = useSelectedNodeId();
  const nodes = useNodes();
  const { isEditing, closeSidebar, startEdit, finishEdit } =
    useNodeDetailEdit();
  const setSelectedTechId = useNodeDetailStore(
    (state) => state.setSelectedTechId
  );
  const setSelectedCandidateIds = useNodeDetailStore(
    (state) => state.setSelectedCandidateIds
  );
  const updateNodeDetail = useNodeStore((state) => state.updateNodeDetail);
  const enterCandidatePreview = useNodeDetailStore(
    (state) => state.enterCandidatePreview
  );
  const currentUser = useUser();

  const isGeneratingCandidates = nodeDetail?.candidatesPending || false;
  const isGeneratingTechs = nodeDetail?.techsPending || false;

  // Sync selected tech id on detail change
  useEffect(() => {
    if (nodeDetail?.techs) {
      const selectedTech = nodeDetail.techs.find((tech) => tech.selected);
      setSelectedTechId(selectedTech?.id ?? null);
    }
  }, [nodeDetail?.techs, setSelectedTechId]);

  // Sync selected candidate ids on detail change
  useEffect(() => {
    if (nodeDetail?.candidates) {
      const selectedIds = nodeDetail.candidates
        .filter((candidate) => candidate.selected)
        .map((candidate) => candidate.id);
      setSelectedCandidateIds(selectedIds);
    }
  }, [nodeDetail?.candidates, setSelectedCandidateIds]);

  if (!nodeDetail) return null;

  const nodeType = nodeInfo?.nodeType;
  const isTaskOrAdvance = nodeType
    ? nodeType === 'TASK' || nodeType === 'ADVANCE'
    : true;
  const showTechRecommend = isTaskOrAdvance;
  const showDifficulty = isTaskOrAdvance;
  const showCandidateSection = nodeType !== 'ADVANCE';

  // Edit toggle handler
  const handleToggleEdit = async () => {
    if (!isEditing) {
      startEdit();
    } else {
      try {
        await finishEdit();
      } catch (error) {
        console.error('저장 실패:', error);
      }
    }
  };
  const handleCandidateClick = (_nodeId: number, candidateId: number) => {
    // Find candidate
    const candidate = nodeDetail?.candidates.find((c) => c.id === candidateId);
    if (!candidate || !selectedNodeId) return;

    // Calculate position
    const position = calculateChildNodePosition(nodes, selectedNodeId);

    // Create preview node (CRDT sync)
    const currentUserId = currentUser?.memberId ?? currentUser?.id;
    const previewNode: FlowNode = {
      id: `preview-${candidateId}`,
      type: 'PREVIEW',
      position: { x: position.xpos, y: position.ypos },
      parentId: selectedNodeId,
      data: {
        title: candidate.name,
        status: 'TODO',
        taskId: '#preview',
        taskType: candidate.taskType,
        ...(currentUserId ? { lockedBy: String(currentUserId) } : {}),
      },
    };

    // Add preview node to CRDT (sync to others)
    previewNodesCrdtService.addPreviewNode(previewNode);

    // Enter preview mode
    enterCandidatePreview(candidate, position);

    console.log('[NodeDetailContainer] Enter preview mode:', {
      candidate,
      position,
      previewNode,
    });
  };

  const handleCandidateAddManual = () => {
    console.log('Candidate add manual clicked');
  };

  // AI 기술 추천 생성 핸들러
  const handleGenerateTechs = async () => {
    if (!selectedNodeId) return;

    nodeDetailCrdtService.setTechsPending(selectedNodeId, true);
    try {
      const response = await getAiNodeTechRecommendation(
        Number(selectedNodeId)
      );
      const rawTechs = response?.data?.techs;
      const techsArray = Array.isArray(rawTechs)
        ? rawTechs
        : rawTechs
          ? [rawTechs]
          : [];

      const mappedTechs = techsArray.map((tech, index) => ({
        id: tech.id ?? Date.now() + index,
        name: tech.name,
        advantage: tech.advantage ?? '',
        disAdvantage: tech.disAdvantage ?? '',
        description: tech.description ?? '',
        ref: tech.ref ?? '',
        recommendScore: tech.recommendScore ?? 0,
        selected: false,
      }));

      nodeDetailCrdtService.updateTechRecommendations(
        selectedNodeId,
        mappedTechs
      );

      if (response?.data?.comparison) {
        updateNodeDetail(Number(selectedNodeId), {
          comparison: response.data.comparison,
        });
      }
    } catch (error) {
      console.error('AI 기술 추천 생성 실패:', error);
    } finally {
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
    }
  };

  // AI 노드 후보 생성 핸들러
  const handleGenerateCandidates = async () => {
    if (!selectedNodeId) return;

    nodeDetailCrdtService.setCandidatesPending(selectedNodeId, true);
    try {
      const candidates = await generateNodeCandidates(Number(selectedNodeId));
      nodeDetailCrdtService.updateCandidates(selectedNodeId, candidates);

      console.log('[NodeDetailContainer] AI 노드 후보 생성 완료');
    } catch (error) {
      console.error('AI 노드 후보 생성 실패:', error);
    } finally {
      nodeDetailCrdtService.setCandidatesPending(selectedNodeId, false);
    }
  };


  return (
    <div className="p-4 space-y-4 pt-20">
      {/* Node header */}
      <NodeHeaderSection
        nodeInfo={nodeInfo}
        description={nodeDetail.description}
        onClose={closeSidebar}
        toggleEdit={handleToggleEdit}
        isEdit={isEditing}
        onShowDescription={onShowDescription}
        onToggleExpand={onToggleExpand}
        isExpanded={isExpanded}
      />

      {/* Status & Meta section */}
      <StatusMetaSection showDifficulty={showDifficulty} />

      {/* Memo section */}
      <MemoSection />

      {/* AI tech recommendations section */}
      {showTechRecommend && (
        <AITechRecommendSection
          isEdit={isEditing}
          recommendations={nodeDetail.techs || []}
          comparison={nodeDetail.comparison}
          onGenerateTechs={handleGenerateTechs}
          isGenerating={isGeneratingTechs}
        />
      )}

      {/* AI next-node candidates section */}
      {showCandidateSection && (
        <AINodeCandidateSection
          candidates={nodeDetail.candidates || []}
          onCandidateClick={handleCandidateClick}
          onAddManual={handleCandidateAddManual}
          onGenerateCandidates={handleGenerateCandidates}
          isGenerating={isGeneratingCandidates}
        />
      )}
    </div>
  );
}


