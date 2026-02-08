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
  useAiStreamingText,
  useAiStreamingType,
} from '@/features/workspace-core';
import { SubNodeCard } from './SubNodeCard';
import { CandidateEmptyState } from './CandidateEmptyState';
import { AiStreamingCard } from '@/shared/components/AiStreamingCard';

interface AINodeCandidateSectionProps {
  candidates: Candidate[];
  onCandidateClick: (
    nodeId: number,
    candidateId: number,
    body: { xpos: number; ypos: number }
  ) => void;
  onCandidateDelete?: (candidateId: number) => void;
  onLockedCandidateClick?: (candidate: Candidate) => void;
  onAddManual?: () => void;
  onGenerateCandidates?: () => Promise<void>;
  isGenerating?: boolean;
}

export function AINodeCandidateSection({
  candidates,
  onCandidateClick,
  onCandidateDelete,
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
  const streamingText = useAiStreamingText();
  const streamingType = useAiStreamingType();

  // candidates ?€?…ì¼ ?Œë§Œ ?¤íŠ¸ë¦¬ë° ?ìŠ¤???œì‹œ
  const showStreamingText = isGenerating && streamingType === 'candidates' && streamingText;

  const lockedCandidateIds = new Set(
    previewNodes
      .map((node) => node.id)
      .filter((id) => id.startsWith('preview-'))
      .map((id) => Number(id.replace('preview-', '')))
      .filter((id) => Number.isFinite(id))
  );

  const handleCandidateClick = (candidate: Candidate) => {
    if (!selectedNodeId) return;
    // locked ?„ë³´(?ì„± ì¤? ?´ë¦­ ???´ë‹¹ previewë¡??¬ì§„??
    if (lockedCandidateIds.has(candidate.id)) {
      onLockedCandidateClick?.(candidate);
      return;
    }
    const position = calculateChildNodePosition(nodes, selectedNodeId);
    onCandidateClick(Number(selectedNodeId), candidate.id, position);
  };

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      {/* ?¹ì…˜ ?¤ë” (?‘ê¸°/?¼ì¹˜ê¸? */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#FD9A00]" />
          <span className="text-xs font-medium text-[#0B0B0B]">
            ?¸ë“œ ì¶”ê? + AI ?¤ìŒ ?¸ë“œ ì¶”ì²œ
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#61626F]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#61626F]" />
        )}
      </button>

      {/* ì½˜í…ì¸?*/}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {hasCandidates ? (
            <>
              {/* ì¶”ì²œ ?¸ë“œ ëª©ë¡ */}
              <div className="space-y-2">
                {candidates.map((node) => {
                  const isLocked = lockedCandidateIds.has(node.id);
                  const isSelected = selectedCandidateIds.includes(node.id);
                  return (
                    <SubNodeCard
                      key={node.id}
                      node={node}
                      onClick={() => handleCandidateClick(node)}
                      onDelete={
                        onCandidateDelete
                          ? () => onCandidateDelete(node.id)
                          : undefined
                      }
                      isSelected={isSelected || isLocked}
                      disabled={isSelected} // locked???´ë¦­ ê°€??(?¬ì§„??, selectedë§?ë¹„í™œ?±í™”
                      deleteDisabled={isSelected || isLocked}
                    />
                  );
                })}
              </div>

              {/* AI ?¬ìƒ??ë²„íŠ¼ ?ëŠ” ?¤íŠ¸ë¦¬ë° ?ìŠ¤??*/}
              {showStreamingText ? (
                <AiStreamingCard text={streamingText} />
              ) : (
                <button
                  onClick={onGenerateCandidates}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#1C69E3] border border-[rgba(28,105,227,0.3)] rounded-lg hover:bg-[rgba(28,105,227,0.05)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      ?ì„± ì¤?..
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI ?¤ì‹œ ì¶”ì²œë°›ê¸°
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <CandidateEmptyState
              onGenerate={onGenerateCandidates}
              isGenerating={isGenerating}
            />
          )}

          {/* ì§ì ‘ ì¶”ê? ë²„íŠ¼ */}
          <button
            onClick={onAddManual}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            ì§ì ‘ ì¶”ê?
          </button>
        </div>
      )}
    </div>
  );
}



