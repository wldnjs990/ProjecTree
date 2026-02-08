import { useEffect } from 'react';
import { useParams } from 'react-router';
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
  useNodes,
  calculateChildNodePosition,
  getChildNodeType,
  type FlowNode,
} from '@/features/workspace-core';
import { useUser } from '@/shared/stores/userStore';
import { generateNodeCandidates } from '@/apis/workspace.api';
import {
  getAiNodeTechRecommendation,
  postCustomNodeTechRecommendation,
} from '@/apis/node.api';
import { toast } from 'sonner';

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
  // URL에서 workspaceId 가져오기
  const { workspaceId: paramWorkspaceId } = useParams<{ workspaceId: string }>();
  const workspaceId = paramWorkspaceId ? Number(paramWorkspaceId) : null;

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
  const enterCandidatePreview = useNodeDetailStore(
    (state) => state.enterCandidatePreview
  );
  const enterCustomPreview = useNodeDetailStore(
    (state) => state.enterCustomPreview
  );
  const currentUser = useUser();

  const isGeneratingCandidates = nodeDetail?.candidatesPending || false;
  const isGeneratingTechs = nodeDetail?.techsPending || false;

  // Sync selected tech id on detail change
  useEffect(() => {
    if (Array.isArray(nodeDetail?.techs)) {
      const selectedTech = nodeDetail.techs.find((tech) => tech.selected);
      setSelectedTechId(selectedTech?.id ?? null);
    }
  }, [nodeDetail?.techs, setSelectedTechId]);

  // Sync selected candidate ids on detail change
  useEffect(() => {
    if (Array.isArray(nodeDetail?.candidates)) {
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
    if (!selectedNodeId || !workspaceId) return;

    const parentNode = nodes.find((n) => n.id === selectedNodeId);
    if (!parentNode) return;

    const nextType = getChildNodeType(parentNode.type);
    if (!nextType) return;

    const position = calculateChildNodePosition(nodes, selectedNodeId);
    const currentUserId = currentUser?.memberId ?? currentUser?.id;
    const previewNodeId = `preview-custom-${Date.now()}`;
    const previewNode: FlowNode = {
      id: previewNodeId,
      type: 'PREVIEW',
      position: { x: position.xpos, y: position.ypos },
      parentId: selectedNodeId,
      data: {
        title: '새 노드',
        status: 'TODO',
        taskId: '#preview',
        taskType: parentNode.data.taskType ?? null,
        ...(currentUserId ? { lockedBy: String(currentUserId) } : {}),
      },
    };

    previewNodesCrdtService.addPreviewNode(previewNode);
    enterCustomPreview(
      {
        name: '',
        description: '',
        nodeType: nextType,
        taskType: parentNode.data.taskType ?? null,
        parentNodeId: Number(selectedNodeId),
        workspaceId,
        previewNodeId,
      },
      position
    );
  };

  // AI 기술 추천 생성 핸들러
  // 클라이언트: pending=true 전송 + API 호출만 수행
  // CRDT 서버: Spring 응답 받으면 Y.Array 업데이트 + pending=false 브로드캐스트
  const handleGenerateTechs = async () => {
    if (!selectedNodeId || !workspaceId) return;

    nodeDetailCrdtService.setTechsPending(selectedNodeId, true);
    try {
      await getAiNodeTechRecommendation(Number(selectedNodeId), workspaceId);
      // 성공 시: CRDT 서버가 Spring 응답을 받아 Y.Array 업데이트 + pending=false 브로드캐스트
      console.log('[NodeDetailContainer] AI 기술 추천 요청 완료');
    } catch (error) {
      console.error('AI 기술 추천 생성 실패:', error);
      toast.error('AI 기술 추천 생성에 실패했습니다.');
      // 에러 시에만 클라이언트에서 pending=false 전송 (서버 응답 없으므로)
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
    }
  };

  // AI 노드 후보 생성 핸들러
  // 클라이언트: pending=true 전송 + API 호출만 수행
  // CRDT 서버: Spring 응답 받으면 nodeCandidates 업데이트 + pending=false 브로드캐스트
  const handleGenerateCandidates = async () => {
    if (!selectedNodeId || !workspaceId) return;

    nodeDetailCrdtService.setCandidatesPending(selectedNodeId, true);
    try {
      await generateNodeCandidates(Number(selectedNodeId), workspaceId);
      console.log('[NodeDetailContainer] AI 노드 후보 생성 요청 완료');
    } catch (error) {
      console.error('AI 노드 후보 생성 실패:', error);
      toast.error('AI 노드 후보 생성에 실패했습니다.');
      nodeDetailCrdtService.setCandidatesPending(selectedNodeId, false);
    }
  };

  // 커스텀 기술스택 추가 핸들러
  // 클라이언트: pending=true 전송 + API 호출만 수행
  // CRDT 서버: Spring 응답 받으면 Y.Array에 append + pending=false 브로드캐스트
  const handleAddCustomTech = async (techVocaId: number) => {
    if (!selectedNodeId || !workspaceId) return;

    nodeDetailCrdtService.setTechsPending(selectedNodeId, true);

    try {
      await postCustomNodeTechRecommendation(Number(selectedNodeId), {
        workspaceId,
        techVocaId,
      });
      toast.success('기술스택이 추가되었습니다.');
    } catch (error) {
      console.error('커스텀 기술스택 추가 실패:', error);
      toast.error('기술스택 추가에 실패했습니다.');
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
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
          onAddCustomTech={handleAddCustomTech}
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


