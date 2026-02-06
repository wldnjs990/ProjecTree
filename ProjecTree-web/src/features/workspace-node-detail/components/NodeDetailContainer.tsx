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
  // Store?ì„œ ?íƒœ ë°??¡ì…˜ êµ¬ë…
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

  // ?¸ë“œ ?ì„¸ ?‘ê·¼ ??? íƒ??ê¸°ìˆ ?¤íƒ ID ?¤ì •
  useEffect(() => {
    if (nodeDetail?.techs) {
      const selectedTech = nodeDetail.techs.find((tech) => tech.selected);
      setSelectedTechId(selectedTech?.id ?? null);
    }
  }, [nodeDetail?.techs, setSelectedTechId]);

  // ?¸ë“œ ?ì„¸ ?‘ê·¼ ??? íƒ???„ë³´ ?¸ë“œ ID ëª©ë¡ ?¤ì •
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

  // ?¸ì§‘ ? ê? ?¸ë“¤??
  const handleToggleEdit = async () => {
    if (!isEditing) {
      startEdit();
    } else {
      try {
        await finishEdit();
      } catch (error) {
        console.error('?€???¤íŒ¨:', error);
      }
    }
  };

  // ?¸ë“œ ?„ë³´ ?´ë¦­ ??ë¯¸ë¦¬ë³´ê¸° ëª¨ë“œ ì§„ì… ?¸ë“¤??
  const handleCandidateClick = (_nodeId: number, candidateId: number) => {
    // ?„ë³´ ?¸ë“œ ì°¾ê¸°
    const candidate = nodeDetail?.candidates.find((c) => c.id === candidateId);
    if (!candidate || !selectedNodeId) return;

    // ?„ì¹˜ ê³„ì‚°
    const position = calculateChildNodePosition(nodes, selectedNodeId);

    // Preview ?¸ë“œ ?ì„± (CRDT ?™ê¸°?????¤ë¥¸ ? ì??ê²Œ???œì‹œ)
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

    // CRDTë¥??µí•´ preview ?¸ë“œ ì¶”ê? (?¤ë¥¸ ? ì??ê²Œ???™ê¸°??
    previewNodesCrdtService.addPreviewNode(previewNode);

    // ë¯¸ë¦¬ë³´ê¸° ëª¨ë“œ ì§„ì…
    enterCandidatePreview(candidate, position);

    console.log('[NodeDetailContainer] ë¯¸ë¦¬ë³´ê¸° ëª¨ë“œ ì§„ì…:', {
      candidate,
      position,
      previewNode,
    });
  };

  const handleCandidateAddManual = () => {
    console.log('Candidate add manual clicked');
  };

  // AI ê¸°ìˆ  ì¶”ì²œ ?ì„± ?¸ë“¤??
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
      console.error('AI ê¸°ìˆ  ì¶”ì²œ ?ì„± ?¤íŒ¨:', error);
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
    }
  };

  // AI ?¸ë“œ ?„ë³´ ?ì„± ?¸ë“¤??
  const handleGenerateCandidates = async () => {
    if (!selectedNodeId) return;

    nodeDetailCrdtService.setCandidatesPending(selectedNodeId, true);
    try {
      await generateNodeCandidates(Number(selectedNodeId));


      console.log('[NodeDetailContainer] AI ?¸ë“œ ?„ë³´ ?ì„± ?„ë£Œ');
    } catch (error) {
      console.error('AI ?¸ë“œ ?„ë³´ ?ì„± ?¤íŒ¨:', error);
    }
  };

  return (
    <div className="p-4 space-y-4 pt-20">
      {/* ?¸ë“œ ?¤ë” */}
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

      {/* Status & Meta ?¹ì…˜ - store ì§ì ‘ êµ¬ë… */}
      <StatusMetaSection showDifficulty={showDifficulty} />

      {/* ë©”ëª¨ ?¹ì…˜ - store ì§ì ‘ êµ¬ë… */}
      <MemoSection />

      {/* AI ê¸°ìˆ  ì¶”ì²œ ?¹ì…˜ - ??ƒ ?œì‹œ */}
      {showTechRecommend && (
        <AITechRecommendSection
          isEdit={isEditing}
          recommendations={nodeDetail.techs || []}
          comparison={nodeDetail.comparison}
          onGenerateTechs={handleGenerateTechs}
          isGenerating={isGeneratingTechs}
        />
      )}

      {/* AI ?¤ìŒ ?¸ë“œ ì¶”ì²œ ?¹ì…˜ - ??ƒ ?œì‹œ */}
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
