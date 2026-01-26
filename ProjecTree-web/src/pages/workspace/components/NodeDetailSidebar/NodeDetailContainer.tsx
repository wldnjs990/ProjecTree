import { NodeHeaderSection } from './NodeHeaderSection';
import { StatusMetaSection } from './StatusMetaSection';
import { AITechRecommendSection } from './AITechRecommendSection';
import { AINodeCandidateSection } from './AINodeCandidateSection';
import { MemoSection } from './MemoSection';
import {
  useSelectedNodeDetail,
  useNodeDetailEditStore,
} from '../../stores/nodeDetailEditStore';

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
  const isEditing = useNodeDetailEditStore((state) => state.isEditing);
  const closeSidebar = useNodeDetailEditStore((state) => state.closeSidebar);
  const startEdit = useNodeDetailEditStore((state) => state.startEdit);
  const finishEdit = useNodeDetailEditStore((state) => state.finishEdit);

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

  // 기술 비교/추가 핸들러 (추후 구현)
  const handleTechCompare = () => {
    console.log('Tech compare clicked');
  };

  const handleTechAddManual = () => {
    console.log('Tech add manual clicked');
  };

  // 노드 후보 클릭/추가 핸들러 (추후 구현)
  const handleCandidateClick = () => {
    console.log('Candidate clicked');
  };

  const handleCandidateAddManual = () => {
    console.log('Candidate add manual clicked');
  };

  return (
    <div className="p-4 space-y-4">
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
          onCompare={handleTechCompare}
          onAddManual={handleTechAddManual}
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
