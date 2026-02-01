import { useState } from 'react';
import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import { useSelectedNodeDetail, useNodeDetailEdit } from '../hooks';
import {
  useSelectedNodeId,
  useNodeStore,
} from '@/features/workspace-core';
import { generateNodeCandidates } from '@/apis/workspace.api';
import { postCreateNode } from '@/apis/node.api';

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
  const updateNodeDetail = useNodeStore((state) => state.updateNodeDetail);
  const { isEditing, closeSidebar, startEdit, finishEdit } =
    useNodeDetailEdit();

  // AI 생성 로딩 상태
  const [isGeneratingCandidates, setIsGeneratingCandidates] = useState(false);

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

  // 노드 후보 클릭/추가 핸들러
  const handleCandidateClick = async (nodeId: number, candidateId: number) => {
    console.log('노드 생성 시작');
    // 일단 하드코딩으로 만듬
    // TODO : 좌표설정 유틸 함수 만들기
    const requestBody = { xpos: 200, ypos: 200 };
    const response = await postCreateNode(requestBody, nodeId, candidateId);
    console.log(response);
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
      // Zustand store 업데이트
      updateNodeDetail(Number(selectedNodeId), { candidates });
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
