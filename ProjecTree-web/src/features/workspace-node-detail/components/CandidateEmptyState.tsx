import { Sparkles, Loader2 } from 'lucide-react';
import { useAiStream, getAiStreamKey, useSelectedNodeId } from '@/features/workspace-core';
import { AiStreamingCard } from '@/shared/components/AiStreamingCard';

interface CandidateEmptyStateProps {
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function CandidateEmptyState({
  onGenerate,
  isGenerating,
}: CandidateEmptyStateProps) {
  const selectedNodeId = useSelectedNodeId();
  const streamKey = selectedNodeId ? getAiStreamKey('CANDIDATE', selectedNodeId) : null;
  const streamingText = useAiStream(streamKey);

  // candidates 타입일 때만 스트리밍 텍스트 표시
  const showStreamingText = isGenerating && streamingText;

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3">
      {showStreamingText ? (
        <div className="w-full px-4">
          <AiStreamingCard text={streamingText} />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
