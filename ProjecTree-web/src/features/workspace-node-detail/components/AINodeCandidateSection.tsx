import { useState } from 'react';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { Candidate } from '../types';
import { selectNodeCandidates } from '@/apis/workspace.api';
import { useSelectedNodeId } from '@/features/workspace-core';

interface AINodeCandidateSectionProps {
  candidates: Candidate[];
  onCandidateClick?: (node: Candidate) => void;
  onAddManual?: () => void;
  onGenerateCandidates?: () => Promise<void>;
  isGenerating?: boolean;
}

// 하위 노드 카드 컴포넌트
interface SubNodeCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  node: Candidate;
  onClick: () => void;
}
const SubNodeCard = ({ node, onClick }: SubNodeCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col w-full items-start justify-between p-2.5 border border-[#DEDEDE] hover:bg-[#1c69e30d] rounded-lg"
    >
      <div className="flex-1 min-w-0 w-full flex items-center justify-between">
        <p className="text-xs font-medium text-[#0B0B0B] truncate">
          {node.name}
        </p>
        <div className="ml-2 p-1 text-[#636363]">
          <Plus className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-left mt-1.5">
        <p className="text-[10px] text-[#636363] mt-0.5">{node.description}</p>
      </div>
    </button>
  );
};

// 빈 상태 컴포넌트
function EmptyState({
  onGenerate,
  isGenerating,
}: {
  onGenerate?: () => void;
  isGenerating?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3">
      <div className="text-center">
        <p className="text-xs text-[#636363]">아직 추천 노드가 없습니다.</p>
        <p className="text-[10px] text-[#9CA3AF] mt-1">
          AI가 다음 노드를 추천해드립니다.
        </p>
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
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
            AI 노드 추천 받기
          </>
        )}
      </button>
    </div>
  );
}

export function AINodeCandidateSection({
  candidates,
  onCandidateClick,
  onAddManual,
  onGenerateCandidates,
  isGenerating = false,
}: AINodeCandidateSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasCandidates = candidates && candidates.length > 0;
  const selectedNodeId = useSelectedNodeId();

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      {/* 섹션 헤더 (접기/펼치기) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#FD9A00]" />
          <span className="text-xs font-medium text-[#0B0B0B]">
            노드 추가 + AI 다음 노드 추천
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
          {hasCandidates ? (
            <>
              {/* 추천 노드 목록 */}
              <div className="space-y-2">
                {candidates.map((node) => (
                  <SubNodeCard
                    key={node.id}
                    node={node}
                    onClick={() =>
                      selectNodeCandidates(Number(selectedNodeId), node.id, {
                        xpos: 200,
                        ypos: 200,
                      })
                    }
                  />
                ))}
              </div>

              {/* AI 재생성 버튼 */}
              <button
                onClick={onGenerateCandidates}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#1C69E3] border border-[rgba(28,105,227,0.3)] rounded-lg hover:bg-[rgba(28,105,227,0.05)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
              </button>
            </>
          ) : (
            <EmptyState
              onGenerate={onGenerateCandidates}
              isGenerating={isGenerating}
            />
          )}

          {/* 직접 추가 버튼 */}
          <button
            onClick={onAddManual}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            직접 추가
          </button>
        </div>
      )}
    </div>
  );
}
