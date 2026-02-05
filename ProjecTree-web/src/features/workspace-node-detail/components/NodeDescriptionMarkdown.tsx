import { ChevronLeft, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/lib/utils';

interface NodeDescriptionMarkdownProps {
  description: string;
  onBack: () => void;
  onClose: () => void;
}

export default function NodeDescriptionMarkdown({
  description,
  onBack,
  onClose,
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
        <button
          type="button"
          onClick={onClose}
          className={cn('p-1 rounded-md hover:bg-gray-100 transition-colors')}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="pt-16 px-4 pb-6">
        {description ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-xl font-bold text-[#0B0B0B] mt-4 mb-2 first:mt-0"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-lg font-bold text-[#0B0B0B] mt-4 mb-2 first:mt-0"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-base font-semibold text-[#0B0B0B] mt-3 mb-2"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p
                    className="text-sm text-[#334155] leading-relaxed mb-3"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc ml-5 mb-3 text-sm" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal ml-5 mb-3 text-sm" {...props} />
                ),
                li: ({ ...props }) => (
                  <li
                    className="text-sm text-[#334155] leading-relaxed"
                    {...props}
                  />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#E2E8F0] pl-3 text-sm text-[#64748B] my-3"
                    {...props}
                  />
                ),
                table: ({ ...props }) => (
                  <div className="overflow-x-auto mb-3">
                    <table
                      className="w-full border-collapse border border-[#E2E8F0] text-sm"
                      {...props}
                    />
                  </div>
                ),
                thead: ({ ...props }) => (
                  <thead className="bg-[#F8F9FA]" {...props} />
                ),
                th: ({ ...props }) => (
                  <th
                    className="border border-[#E2E8F0] px-2 py-1 text-left text-xs font-semibold text-[#0B0B0B]"
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className="border border-[#E2E8F0] px-2 py-1 text-xs text-[#334155]"
                    {...props}
                  />
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code
                      className="px-1 py-0.5 bg-[#F8F8F8] text-[#C10007] rounded text-xs font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block p-2 bg-[#F8F9FA] rounded text-xs font-mono overflow-x-auto mb-2"
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
              {description}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-[#94A3B8]">
            상세 설명이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
