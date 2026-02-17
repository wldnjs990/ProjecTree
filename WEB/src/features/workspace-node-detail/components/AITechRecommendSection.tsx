import { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowLeftRight,
  Loader2,
} from 'lucide-react';
import type { TechRecommendation } from '../types';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer';
import { cn } from '@/shared/lib/utils';
import { Confirm } from '@/shared/components/Confirm';
import { ConfirmTrigger } from '@/shared/components/ConfirmTrigger';
import TechDetailContent from './TechDetailContent';
import TechDetailTitle from './TechDetailTitle';
import { CustomTechAddDialog } from './CustomTechAddDialog';
import { AiStreamingCard } from '@/shared/components/AiStreamingCard';
import {
  useSelectedNodeId,
  getCrdtClient,
  useSelectedTechId,
  useNodeDetailStore,
  useAiStream,
  getAiStreamKey,
} from '@/features/workspace-core';

interface AITechRecommendSectionProps {
  isEdit: boolean;
  recommendations: TechRecommendation[];
  comparison?: string;
  onGenerateTechs?: () => Promise<void>;
  isGenerating?: boolean;
  onAddCustomTech?: (techVocaId: number) => Promise<void>;
}

// 커스텀 기술 여부 판별 (AI 추천이 아닌 직접 추가한 기술)
function isCustomTech(tech: TechRecommendation): boolean {
  return (
    !tech.description &&
    !tech.advantage &&
    !tech.disAdvantage &&
    tech.recommendScore <= 0
  );
}

// 기술 카드 컴포넌트
function TechCard({
  tech,
  isSelected,
}: {
  tech: TechRecommendation;
  isSelected: boolean;
}) {
  // 추천 점수가 4점 이상이면 AI 추천 태그 붙여줌
  const isHighRecommended = tech.recommendScore >= 4;
  const isCustom = isCustomTech(tech);

  return (
    <div
      className={cn(
        'w-full p-3 rounded-lg border text-left transition-all cursor-pointer',
        isSelected
          ? 'bg-[rgba(28,105,227,0.05)] border-[rgba(28,105,227,0.5)]'
          : 'bg-white border-[#DEDEDE] hover:border-[rgba(28,105,227,0.3)]'
      )}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm font-medium text-[#0B0B0B] flex-1">
          {tech.name}
        </span>
        {isHighRecommended && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium text-[#1C69E3] bg-[rgba(28,105,227,0.1)] border border-[rgba(28,105,227,0.2)] rounded-md whitespace-nowrap shrink-0">
            <Sparkles className="w-3 h-3" />
            AI 추천
          </span>
        )}
        {isCustom && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium text-[#6363C6] bg-[rgba(99,99,198,0.1)] border border-[rgba(99,99,198,0.2)] rounded-md whitespace-nowrap shrink-0">
            <Plus className="w-3 h-3" />
            직접 추가
          </span>
        )}
      </div>

      {/* 설명 */}
      <p className="text-[10px] text-[rgba(99,99,99,0.8)] leading-relaxed mb-2">
        {isCustom
          ? '직접 추가한 기술입니다. 클릭하여 확정할 수 있습니다.'
          : tech.description}
      </p>

      {/* 장단점 태그 */}
      <div className="flex flex-wrap gap-1">
        {isCustom ? (
          <span className="px-1.5 py-0.5 text-[9px] rounded bg-[rgba(99,99,198,0.1)] text-[#6363C6] italic">
            사용자 지정 기술
          </span>
        ) : (
          <>
            {tech.advantage && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#ECFDF5] text-[#007A55]">
                +{tech.advantage.slice(0, 30)}...
              </span>
            )}
            {tech.disAdvantage && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#F8F8F8] text-[#C10007]">
                -{tech.disAdvantage.slice(0, 30)}...
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 기술 비교 마크다운 컴포넌트
function TechComparisonMarkdown({ comparison }: { comparison: string }) {
  return (
    <div className="space-y-4">
      <MarkdownRenderer content={comparison} />
    </div>
  );
}

// 기술 카드 목록
function TechCardList({
  recommendations,
}: {
  recommendations: TechRecommendation[];
}) {
  const selectedNodeId = useSelectedNodeId();
  const selectedTechId = useSelectedTechId();
  const setSelectedTechId = useNodeDetailStore(
    (state) => state.setSelectedTechId
  );

  // 기술 선택 핸들러
  const handleSelectTech = (techId: number) => {
    if (!selectedNodeId) {
      return;
    }

    const client = getCrdtClient();
    if (!client) {
      return;
    }

    // CRDT 서버에 이벤트 전송 및 YMap 브로드캐스트
    client.selectNodeTech(selectedNodeId, techId);
    setSelectedTechId(techId);
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {recommendations.map((tech) => (
          <Confirm
            key={tech.id}
            trigger={
              <ConfirmTrigger className="w-full">
                <TechCard tech={tech} isSelected={selectedTechId === tech.id} />
              </ConfirmTrigger>
            }
            title={
              <TechDetailTitle
                name={tech.name}
                recommendScore={tech.recommendScore}
              />
            }
            content={<TechDetailContent tech={tech} />}
            description="선택한 기술을 확정하시겠습니까?"
            cancelText="닫기"
            actionText="확정"
            onAction={() => handleSelectTech(tech.id)}
            isConfirmed={selectedTechId === tech.id}
          />
        ))}
      </div>
    </>
  );
}

// 빈 상태 컴포넌트
function TechEmptyState({
  onGenerate,
  isGenerating,
}: {
  onGenerate?: () => void;
  isGenerating?: boolean;
}) {
  const isDisabled = isGenerating || !onGenerate;
  const selectedNodeId = useSelectedNodeId();
  const streamKey = selectedNodeId ? getAiStreamKey('TECH', selectedNodeId) : null;
  const streamingText = useAiStream(streamKey);

  // techs 타입일 때만 스트리밍 텍스트 표시
  const showStreamingText = isGenerating && streamingText;

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3">
      {showStreamingText ? (
        <AiStreamingCard text={streamingText} />
      ) : (
        <>
          <div className="text-center">
            <p className="text-xs text-[#636363]">아직 추천 기술이 없습니다.</p>
            <p className="text-[10px] text-[#9CA3AF] mt-1">
              AI가 적합한 기술을 추천해드립니다.
            </p>
          </div>
          <button
            onClick={onGenerate}
            disabled={isDisabled}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#1C69E3] rounded-lg hover:bg-[#1557c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI 기술 추천 받기
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export function AITechRecommendSection({
  recommendations,
  comparison,
  onGenerateTechs,
  isGenerating = false,
  onAddCustomTech,
}: AITechRecommendSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasRecommendations = recommendations && recommendations.length > 0;

  const handleCompareClick = () => {
    setShowComparison(true);
  };

  const handleBackToRecommendations = () => {
    setShowComparison(false);
  };

  const handleAddTech = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      {/* 섹션 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1C69E3]" />
          <span className="text-xs font-medium text-[#0B0B0B]">
            {showComparison ? '기술 비교' : 'AI 기술 추천'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#61626F]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#61626F]" />
        )}
      </button>

      {/* 콘텐츠 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {hasRecommendations ? (
            <>
              {showComparison && comparison ? (
                <TechComparisonMarkdown comparison={comparison} />
              ) : (
                <TechCardList recommendations={recommendations} />
              )}

              {/* 액션 버튼 */}
              <div className="space-y-2">
                {comparison && (
                  <button
                    onClick={
                      showComparison
                        ? handleBackToRecommendations
                        : handleCompareClick
                    }
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    {showComparison ? '돌아가기' : '기술 비교하기'}
                  </button>
                )}

                {/* AI 재생성 버튼 - 경고 모달 포함 */}
                <Confirm
                  trigger={
                    <ConfirmTrigger
                      className={cn(
                        'w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#1C69E3] border border-[rgba(28,105,227,0.3)] rounded-lg hover:bg-[rgba(28,105,227,0.05)] transition-colors shadow-sm',
                        isGenerating && 'opacity-50 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            생성 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI 다시 추천받기
                          </>
                        )}
                      </span>
                    </ConfirmTrigger>
                  }
                  title="기술 추천을 다시 받으시겠습니까?"
                  description="AI가 새로운 기술을 추천합니다. 기존에 추천받은 기술과 직접 추가한 기술이 모두 삭제됩니다."
                  cancelText="취소"
                  actionText="다시 추천받기"
                  onAction={onGenerateTechs}
                />
              </div>
            </>
          ) : (
            <TechEmptyState
              onGenerate={onGenerateTechs}
              isGenerating={isGenerating}
            />
          )}

          {/* 직접 추가 버튼 */}
          <button
            onClick={handleAddTech}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            직접 추가
          </button>

          {/* 커스텀 기술 추가 다이얼로그 */}
          {onAddCustomTech && (
            <CustomTechAddDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onAddTech={onAddCustomTech}
              isAdding={isGenerating}
            />
          )}
        </div>
      )}
    </div>
  );
}
