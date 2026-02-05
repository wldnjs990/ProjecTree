import { ArrowLeft, Sprout, Check, Loader2 } from 'lucide-react';
import NodeHeaderButton from './NodeHeaderButton';
import { categoryTagStyles, typeTagStyles } from '@/features/workspace-core';
import type { Candidate } from '@/features/workspace-core';
import { cn } from '@/shared/lib/utils';

interface CandidateNodeContainerProps {
  candidate: Candidate;
  parentNodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  onBack: () => void;
  onConfirm: () => Promise<void>;
  isCreating: boolean;
}

export default function CandidateNodeContainer({
  candidate,
  parentNodeInfo,
  onBack,
  onConfirm,
  isCreating,
}: CandidateNodeContainerProps) {
  // 후보 노드의 타입 스타일 (TASK로 기본 설정)
  const typeStyle = typeTagStyles.TASK;
  const categoryStyle = candidate.taskType
    ? categoryTagStyles[candidate.taskType]
    : null;

  return (
    <div className="p-4 space-y-4 pt-6">
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="flex items-center gap-2">
        <NodeHeaderButton onClick={onBack} disabled={isCreating}>
          <ArrowLeft />
        </NodeHeaderButton>
        <h3 className="text-lg font-bold text-[#0B0B0B] line-clamp-1">
          다음 노드 : {candidate.name}
        </h3>
      </div>

      {/* 태그 영역 */}
      <div className="flex items-center gap-3 mb-3">
        {/* 노드 타입 태그 */}
        <span
          className={cn(
            'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-lg border',
            typeStyle.bg,
            typeStyle.border,
            typeStyle.text
          )}
        >
          {typeStyle.label}
        </span>

        {/* 카테고리 태그 (frontend/backend) */}
        {categoryStyle && (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border',
              categoryStyle.bg,
              categoryStyle.border,
              categoryStyle.text
            )}
          >
            <Sprout className="w-3 h-3" />
            {categoryStyle.label}
          </span>
        )}
      </div>

      {/* 설명 섹션 */}
      <div className="rounded-lg border border-[#E2E8F0] p-4 bg-[#FAFAFA]">
        <h4 className="text-sm font-semibold text-[#0B0B0B] mb-2">설명</h4>
        <p className="text-sm text-[#636363] leading-relaxed whitespace-pre-wrap">
          {candidate.description || '설명이 없습니다.'}
        </p>
      </div>

      {/* 요약 섹션 */}
      {candidate.summary && (
        <div className="rounded-lg border border-[#E2E8F0] p-4">
          <h4 className="text-sm font-semibold text-[#0B0B0B] mb-2">요약</h4>
          <p className="text-sm text-[#636363] leading-relaxed">
            {candidate.summary}
          </p>
        </div>
      )}

      {/* 확정 섹션 */}
      <div className="mt-6 p-4 rounded-lg border-2 border-[#1C69E3]/30 bg-[rgba(28,105,227,0.02)]">
        <p className="text-sm text-[#0B0B0B] mb-4">
          이 노드를{' '}
          <span className="font-semibold text-[#1C69E3]">
            {parentNodeInfo?.name || '선택된 노드'}
          </span>
          의 하위 노드로 추가하시겠습니까?
        </p>

        <button
          onClick={onConfirm}
          disabled={isCreating}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3',
            'text-white font-medium rounded-lg transition-all duration-200',
            isCreating
              ? 'bg-[#1C69E3]/50 cursor-not-allowed'
              : 'bg-[#1C69E3] hover:bg-[#1558C0] active:scale-[0.98]'
          )}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI가 노드를 생성하고 있습니다...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>확정</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
