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
import {
  useSelectedNodeId,
  useNodes,
  calculateChildNodePosition,
  useSelectedCandidateIds,
  usePreviewNodes,
} from '@/features/workspace-core';
import { SubNodeCard } from './SubNodeCard';
import { CandidateEmptyState } from './CandidateEmptyState';

interface AINodeCandidateSectionProps {
  candidates: Candidate[];
  onCandidateClick: (
    nodeId: number,
    candidateId: number,
    body: { xpos: number; ypos: number }
  ) => void;
  onLockedCandidateClick?: (candidate: Candidate) => void;
  onAddManual?: () => void;
  onGenerateCandidates?: () => Promise<void>;
  isGenerating?: boolean;
}

export function AINodeCandidateSection({
  candidates,
  onCandidateClick,
  onLockedCandidateClick,
  onAddManual,
  onGenerateCandidates,
  isGenerating = false,
}: AINodeCandidateSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasCandidates = candidates && candidates.length > 0;
  const selectedNodeId = useSelectedNodeId();
  const nodes = useNodes();
  const selectedCandidateIds = useSelectedCandidateIds();
  const previewNodes = usePreviewNodes();

  const lockedCandidateIds = new Set(
    previewNodes
      .map((node) => node.id)
      .filter((id) => id.startsWith('preview-'))
      .map((id) => Number(id.replace('preview-', '')))
      .filter((id) => Number.isFinite(id))
  );

  const handleCandidateClick = (candidate: Candidate) => {
    if (!selectedNodeId) return;
    // locked 후보(생성 중) 클릭 시 해당 preview로 재진입
    if (lockedCandidateIds.has(candidate.id)) {
      onLockedCandidateClick?.(candidate);
      return;
    }
    const position = calculateChildNodePosition(nodes, selectedNodeId);
    onCandidateClick(Number(selectedNodeId), candidate.id, position);
  };

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
                {candidates.map((node) => {
                  const isLocked = lockedCandidateIds.has(node.id);
                  const isSelected = selectedCandidateIds.includes(node.id);
                  return (
                    <SubNodeCard
                      key={node.id}
                      node={node}
                      onClick={() => handleCandidateClick(node)}
                      isSelected={isSelected || isLocked}
                      disabled={isSelected} // locked는 클릭 가능 (재진입), selected만 비활성화
                    />
                  );
                })}
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
            <CandidateEmptyState
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
