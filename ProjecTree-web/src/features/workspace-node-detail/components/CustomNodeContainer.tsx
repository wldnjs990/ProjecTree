import { ArrowLeft, Sprout, Check, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import NodeHeaderButton from './NodeHeaderButton';
import { categoryTagStyles, typeTagStyles } from '@/features/workspace-core';
import type { NodeType, TaskType } from '@/features/workspace-core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CustomNodeContainerProps {
  draft: {
    name: string;
    description: string;
    nodeType: NodeType;
    taskType: TaskType;
  };
  parentNodeInfo?: {
    name: string;
  };
  onBack: () => void;
  onConfirm: () => Promise<void>;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  isCreating: boolean;
}

const getTypeStyle = (nodeType: NodeType) => {
  if (nodeType === 'ADVANCE' && typeTagStyles.ADVANCED) {
    return typeTagStyles.ADVANCED;
  }
  return typeTagStyles[nodeType];
};

export default function CustomNodeContainer({
  draft,
  parentNodeInfo,
  onBack,
  onConfirm,
  onChangeName,
  onChangeDescription,
  isCreating,
}: CustomNodeContainerProps) {
  const typeStyle = getTypeStyle(draft.nodeType);
  const categoryStyle = draft.taskType
    ? categoryTagStyles[draft.taskType]
    : null;
  const isValid = draft.name.trim().length > 0;

  return (
    <div className="p-4 space-y-4 pt-6">
      <div className="flex items-center gap-2">
        <NodeHeaderButton onClick={onBack}>
          <ArrowLeft />
        </NodeHeaderButton>
        <h3 className="text-lg font-bold text-[#0B0B0B] line-clamp-1">
          직접 추가
        </h3>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-lg border',
            typeStyle?.bg,
            typeStyle?.border,
            typeStyle?.text
          )}
        >
          {typeStyle?.label ?? draft.nodeType}
        </span>

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

      <div className="rounded-lg border border-[#E2E8F0] p-4 bg-[#FAFAFA] space-y-2">
        <label className="text-sm font-semibold text-[#0B0B0B]">이름</label>
        <input
          value={draft.name}
          onChange={(e) => onChangeName(e.target.value)}
          disabled={isCreating}
          className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C69E3]/30"
          placeholder="노드 이름을 입력하세요"
        />
      </div>

      <div className="rounded-lg border border-[#E2E8F0] p-4 bg-[#FAFAFA] space-y-2">
        <label className="text-sm font-semibold text-[#0B0B0B]">설명</label>
        <textarea
          value={draft.description}
          onChange={(e) => onChangeDescription(e.target.value)}
          disabled={isCreating}
          rows={6}
          className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C69E3]/30 resize-none"
          placeholder="노드 설명을 입력하세요 (Markdown 지원)"
        />
        <div className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2">
          <div className="text-xs text-[#636363] mb-2">미리보기</div>
          <div className="prose prose-sm max-w-none text-[#0B0B0B]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: () => null,
              }}
            >
              {draft.description || '_미리보기 내용이 없습니다._'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

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
          disabled={isCreating || !isValid}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3',
            'text-white font-medium rounded-lg transition-all duration-200',
            isCreating || !isValid
              ? 'bg-[#1C69E3]/50 cursor-not-allowed'
              : 'bg-[#1C69E3] hover:bg-[#1558C0] active:scale-[0.98]'
          )}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>노드를 생성하고 있습니다...</span>
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
