import { ChevronLeft, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer';

interface NodeDescriptionMarkdownProps {
  description: string;
  onBack: () => void;
  onClose: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export default function NodeDescriptionMarkdown({
  description,
  onBack,
  onClose,
  onToggleExpand,
  isExpanded,
}: NodeDescriptionMarkdownProps) {
  return (
    <div className="h-full">
      <div className="flex px-4 py-4 justify-between absolute top-0 left-0 w-full bg-white z-10 border-b border-[#EEEEEE]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium text-[#475569] px-2 py-1 rounded-md',
              'hover:bg-gray-100 transition-colors'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            상세정보로 돌아가기
          </button>
        </div>
        <div className="flex items-center gap-2">
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className={cn(
                'p-1 rounded-md hover:bg-gray-100 transition-colors'
              )}
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-gray-500" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-500" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn('p-1 rounded-md hover:bg-gray-100 transition-colors')}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="pt-16 px-4 pb-6">
        {description ? (
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={description} />
          </div>
        ) : (
          <div className="text-sm text-[#94A3B8]">상세 설명이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
