import { useEffect } from 'react';
import { useParams } from 'react-router';
import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import { useSelectedNodeDetail, useNodeDetailEdit } from '../hooks';
import * as Y from 'yjs';
import {
  useSelectedNodeId,
  nodeDetailCrdtService,
  previewNodesCrdtService,
  useNodeDetailStore,
  useNodes,
  calculateChildNodePosition,
  getChildNodeType,
  getCrdtClient,
  type FlowNode,
  type Candidate,
} from '@/features/workspace-core';
import { useUser } from '@/shared/stores/userStore';
import { generateNodeCandidates } from '@/apis/workspace.api';
import {
  getAiNodeTechRecommendation,
  postCustomNodeTechRecommendation,
} from '@/apis/node.api';

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
  const { workspaceId: paramWorkspaceId } = useParams<{
    workspaceId: string;
  }>();
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

  // locked 후보(생성 중) 클릭 시 해당 preview로 재진입
  const handleLockedCandidateClick = (candidate: Candidate) => {
    const previewNodeId = `preview-${candidate.id}`;

    // CRDT에서 preview 노드 찾기
    const client = getCrdtClient();
    if (!client) return;

    const yPreviewNodes = client.getYMap<Y.Map<unknown>>('previewNodes');
    const yNode = yPreviewNodes.get(previewNodeId);
    if (!yNode) return;

    const position = yNode.get('position') as
      | { x?: number; y?: number }
      | undefined;
    const xpos = Number(position?.x ?? 0);
    const ypos = Number(position?.y ?? 0);

    // preview 모드 진입
    enterCandidatePreview(candidate, { xpos, ypos });

    // pending 상태 확인 및 반영
    const yNodeCreatingPending = client.getYMap<boolean>('nodeCreatingPending');
    const isPending = yNodeCreatingPending.get(previewNodeId) === true;
    if (isPending) {
      useNodeDetailStore.getState().addCreatingPreviewId(previewNodeId);
    }

    console.log('[NodeDetailContainer] Re-enter locked preview:', {
      candidate,
      previewNodeId,
      isPending,
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
    } catch (error) {
      console.error('커스텀 기술스택 추가 실패:', error);
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
    }
  };

  // 노드 삭제 핸들러
  // CRDT 서버에 삭제 요청 전송 후 Spring DELETE 호출 후 Y.Doc에서 노드+자식 일괄 삭제
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;

    const client = getCrdtClient();
    if (!client) {
      console.warn('[NodeDetailContainer] CRDT 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    // 사이드바 먼저 닫기
    closeSidebar();

    // CRDT 서버에 삭제 요청 전송
    client.deleteNode(selectedNodeId);
    console.log('[NodeDetailContainer] 노드 삭제 요청:', selectedNodeId);
  };

  // 후보 노드 삭제 핸들러
  // CRDT 서버에 삭제 요청 전송 후 Spring DELETE 호출 후 Y.Doc에서 후보 삭제 브로드캐스트
  const handleDeleteCandidate = (candidateId: number) => {
    if (!selectedNodeId) return;

    const client = getCrdtClient();
    if (!client) {
      console.warn('[NodeDetailContainer] CRDT 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    client.deleteCandidate(selectedNodeId, candidateId);
    console.log('[NodeDetailContainer] 후보 삭제 요청:', {
      nodeId: selectedNodeId,
      candidateId,
    });
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
        onDelete={handleDeleteNode}
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
