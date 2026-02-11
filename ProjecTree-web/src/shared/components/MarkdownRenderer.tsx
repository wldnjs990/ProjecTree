import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  componentsOverride?: Components;
  className?: string;
}

const defaultComponents: Components = {
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
};

export default function MarkdownRenderer({
  content,
  componentsOverride,
  className,
}: MarkdownRendererProps) {
  const components = componentsOverride
    ? { ...defaultComponents, ...componentsOverride }
    : defaultComponents;

  return (
    <div className={className ?? 'prose prose-sm max-w-none'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}