import { useState, useEffect } from 'react';
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
  type FlowNode,
} from '@/features/workspace-core';
import { generateNodeCandidates } from '@/apis/workspace.api';

interface NodeDetailContainerProps {
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
}

export default function NodeDetailContainer({
  nodeInfo,
}: NodeDetailContainerProps) {
  // Store에서 상태 및 액션 구독
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

  // AI 생성 로딩 상태
  const [isGeneratingCandidates, setIsGeneratingCandidates] = useState(false);

  // 노드 상세 접근 시 선택된 기술스택 ID 설정
  useEffect(() => {
    if (nodeDetail?.techs) {
      const selectedTech = nodeDetail.techs.find((tech) => tech.selected);
      setSelectedTechId(selectedTech?.id ?? null);
    }
  }, [nodeDetail?.techs, setSelectedTechId]);

  // 노드 상세 접근 시 선택된 후보 노드 ID 목록 설정
  useEffect(() => {
    if (nodeDetail?.candidates) {
      const selectedIds = nodeDetail.candidates
        .filter((candidate) => candidate.selected)
        .map((candidate) => candidate.id);
      setSelectedCandidateIds(selectedIds);
    }
  }, [nodeDetail?.candidates, setSelectedCandidateIds]);

  if (!nodeDetail) return null;

  // 편집 토글 핸들러
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

  // 노드 후보 클릭 → 미리보기 모드 진입 핸들러
  const handleCandidateClick = (_nodeId: number, candidateId: number) => {
    // 후보 노드 찾기
    const candidate = nodeDetail?.candidates.find((c) => c.id === candidateId);
    if (!candidate || !selectedNodeId) return;

    // 위치 계산
    const position = calculateChildNodePosition(nodes, selectedNodeId);

    // Preview 노드 생성 (CRDT 동기화 → 다른 유저에게도 표시)
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
      },
    };

    // CRDT를 통해 preview 노드 추가 (다른 유저에게도 동기화)
    previewNodesCrdtService.addPreviewNode(previewNode);

    // 미리보기 모드 진입
    enterCandidatePreview(candidate, position);

    console.log('[NodeDetailContainer] 미리보기 모드 진입:', {
      candidate,
      position,
      previewNode,
    });
  };

  const handleCandidateAddManual = () => {
    console.log('Candidate add manual clicked');
  };

  // AI 노드 후보 생성 핸들러
  const handleGenerateCandidates = async () => {
    if (!selectedNodeId) return;

    setIsGeneratingCandidates(true);
    try {
      const candidates = await generateNodeCandidates(Number(selectedNodeId));

      // CRDT 동기화 (Y.Map + 로컬 store 모두 업데이트)
      nodeDetailCrdtService.updateCandidates(selectedNodeId, candidates);

      console.log('[NodeDetailContainer] AI 노드 후보 생성 완료:', candidates);
    } catch (error) {
      console.error('AI 노드 후보 생성 실패:', error);
    } finally {
      setIsGeneratingCandidates(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pt-20">
      {/* 노드 헤더 */}
      <NodeHeaderSection
        nodeInfo={nodeInfo}
        description={nodeDetail.description}
        onClose={closeSidebar}
        toggleEdit={handleToggleEdit}
        isEdit={isEditing}
      />

      {/* Status & Meta 섹션 - store 직접 구독 */}
      <StatusMetaSection />

      {/* 메모 섹션 - store 직접 구독 */}
      <MemoSection />

      {/* AI 기술 추천 섹션 - 항상 표시 */}
      <AITechRecommendSection
        isEdit={isEditing}
        recommendations={nodeDetail.techs || []}
        comparison={nodeDetail.comparison}
      />

      {/* AI 다음 노드 추천 섹션 - 항상 표시 */}
      <AINodeCandidateSection
        candidates={nodeDetail.candidates || []}
        onCandidateClick={handleCandidateClick}
        onAddManual={handleCandidateAddManual}
        onGenerateCandidates={handleGenerateCandidates}
        isGenerating={isGeneratingCandidates}
      />
    </div>
  );
}
