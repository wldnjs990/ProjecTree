import { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowLeftRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TechRecommendation } from './types';
import { cn } from '@/lib/utils';

interface AITechRecommendSectionProps {
  isEdit: boolean;
  recommendations: TechRecommendation[];
  comparison?: string;
  onCompare?: () => void;
  onAddManual?: () => void;
}

// 기술 카드 컴포넌트
function TechCard({
  tech,
  isSelected,
  onClick,
}: {
  tech: TechRecommendation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isHighRecommended = tech.recommendationScore >= 4;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg border text-left transition-all',
        isSelected
          ? 'bg-[rgba(28,105,227,0.05)] border-[rgba(28,105,227,0.5)]'
          : 'bg-white border-[#DEDEDE] hover:border-[rgba(28,105,227,0.3)]'
      )}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-sm font-medium text-[#0B0B0B]">{tech.name}</span>
        {isHighRecommended && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium text-[#1C69E3] bg-[rgba(28,105,227,0.1)] border border-[rgba(28,105,227,0.2)] rounded-md">
            <Sparkles className="w-3 h-3" />
            AI 추천
          </span>
        )}
      </div>

      {/* 설명 */}
      <p className="text-[10px] text-[rgba(99,99,99,0.8)] leading-relaxed mb-2">
        {tech.description}
      </p>

      {/* 장단점 태그 */}
      <div className="flex flex-wrap gap-1">
        {tech.advantage && (
          <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#ECFDF5] text-[#007A55]">
            +{tech.advantage.slice(0, 30)}...
          </span>
        )}
        {tech.disadvantage && (
          <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#F8F8F8] text-[#C10007]">
            -{tech.disadvantage.slice(0, 30)}...
          </span>
        )}
      </div>
    </button>
  );
}

// 기술 비교 마크다운 컴포넌트
function TechComparisonMarkdown({ comparison }: { comparison: string }) {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ ...props }) => (
              <h2
                className="text-base font-bold text-[#0B0B0B] mt-4 mb-2 first:mt-0"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className="text-sm font-semibold text-[#0B0B0B] mt-3 mb-2"
                {...props}
              />
            ),
            h4: ({ ...props }) => (
              <h4
                className="text-xs font-semibold text-[#0B0B0B] mt-2 mb-1"
                {...props}
              />
            ),
            p: ({ ...props }) => (
              <p
                className="text-xs text-[#4A4A4A] leading-relaxed mb-2"
                {...props}
              />
            ),
            ul: ({ ...props }) => (
              <ul className="list-none space-y-1 mb-2 text-xs" {...props} />
            ),
            li: ({ ...props }) => (
              <li
                className="text-xs text-[#4A4A4A] leading-relaxed"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-3">
                <table
                  className="w-full border-collapse border border-[#E2E8F0] text-xs"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-[#F8F9FA]" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="border border-[#E2E8F0] px-2 py-1 text-left text-[10px] font-semibold text-[#0B0B0B]"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td
                className="border border-[#E2E8F0] px-2 py-1 text-[10px] text-[#4A4A4A]"
                {...props}
              />
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="px-1 py-0.5 bg-[#F8F8F8] text-[#C10007] rounded text-[10px] font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code
                  className="block p-2 bg-[#F8F9FA] rounded text-[10px] font-mono overflow-x-auto mb-2"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ ...props }) => <pre className="mb-2" {...props} />,
            strong: ({ ...props }) => (
              <strong className="font-semibold text-[#0B0B0B]" {...props} />
            ),
          }}
        >
          {comparison}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// 기술 카드 목록
function TechCardList({
  recommendations,
}: {
  recommendations: TechRecommendation[];
}) {
  const [selectedTechId, setSelectedTechId] = useState<number | null>(
    recommendations.find((r) => r.recommendationScore >= 4)?.id ||
      recommendations[0]?.id ||
      null
  );

  return (
    <div className="space-y-2">
      {recommendations.map((tech) => (
        <TechCard
          key={tech.id}
          tech={tech}
          isSelected={selectedTechId === tech.id}
          onClick={() => setSelectedTechId(tech.id)}
        />
      ))}
    </div>
  );
}

export function AITechRecommendSection({
  recommendations,
  comparison,
  onCompare,
  onAddManual,
}: AITechRecommendSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const handleCompareClick = () => {
    setShowComparison(true);
    onCompare?.();
  };

  const handleBackToRecommendations = () => {
    setShowComparison(false);
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
            <button
              onClick={onAddManual}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              직접 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
