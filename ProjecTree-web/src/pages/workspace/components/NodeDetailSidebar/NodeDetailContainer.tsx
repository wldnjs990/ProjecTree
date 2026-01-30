import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import { useSelectedNodeDetail, useNodeDetailEdit } from '../../hooks';
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
  const { isEditing, closeSidebar, startEdit, finishEdit } =
    useNodeDetailEdit();

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

      {/* AI 기술 추천 섹션 */}
      {nodeDetail.techs && nodeDetail.techs.length > 0 && (
        <AITechRecommendSection
          isEdit={isEditing}
          recommendations={nodeDetail.techs}
          comparison={nodeDetail.comparison}
        />
      )}

      {/* AI 다음 노드 추천 섹션 */}
      {nodeDetail.candidates && nodeDetail.candidates.length > 0 && (
        <AINodeCandidateSection
          candidates={nodeDetail.candidates}
          onCandidateClick={handleCandidateClick}
          onAddManual={handleCandidateAddManual}
        />
      )}
    </div>
  );
}
