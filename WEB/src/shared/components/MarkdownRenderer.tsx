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
      className="mt-7 mb-3 border-b border-zinc-200/80 pb-2 text-2xl font-bold tracking-tight text-zinc-900 first:mt-0"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="mt-6 mb-2 text-xl font-bold tracking-tight text-zinc-900 first:mt-0"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="mt-5 mb-2 text-lg font-semibold text-zinc-900"
      {...props}
    />
  ),
  h4: ({ ...props }) => (
    <h4 className="mt-4 mb-2 text-base font-semibold text-zinc-800" {...props} />
  ),
  p: ({ ...props }) => (
    <p
      className="mb-3 text-sm leading-7 text-zinc-700"
      {...props}
    />
  ),
  ul: ({ ...props }) => (
    <ul className="mb-3 ml-5 list-disc space-y-1.5 text-sm text-zinc-700 marker:text-zinc-500" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-1.5 text-sm text-zinc-700 marker:text-zinc-500" {...props} />
  ),
  li: ({ ...props }) => (
    <li
      className="text-sm leading-7 text-zinc-700"
      {...props}
    />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="my-4 rounded-r-lg border-l-4 border-[var(--figma-neon-green)] bg-emerald-50/40 py-2 pl-4 pr-3 text-sm italic leading-7 text-zinc-700"
      {...props}
    />
  ),
  a: ({ ...props }) => (
    <a
      className="font-medium text-[var(--figma-primary-blue)] underline decoration-[var(--figma-primary-blue)]/40 underline-offset-2 transition-colors hover:text-blue-700"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: ({ ...props }) => (
    <div className="mb-4 overflow-x-auto rounded-xl border border-zinc-200/80 bg-white">
      <table
        className="w-full border-collapse text-sm"
        {...props}
      />
    </div>
  ),
  thead: ({ ...props }) => (
    <thead className="bg-zinc-100/80" {...props} />
  ),
  th: ({ ...props }) => (
    <th
      className="border border-zinc-200/80 px-3 py-2 text-left text-xs font-semibold text-zinc-700"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td
      className="border border-zinc-200/80 px-3 py-2 text-xs text-zinc-600"
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    return isInline ? (
      <code
        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[12px] font-medium text-emerald-700"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block overflow-x-auto rounded-xl bg-zinc-900 p-4 text-xs leading-6 text-zinc-100"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ ...props }) => <pre className="mb-3 mt-2 bg-transparent p-0" {...props} />,
  hr: ({ ...props }) => <hr className="my-5 border-zinc-200/80" {...props} />,
  strong: ({ ...props }) => (
    <strong className="font-semibold text-zinc-900" {...props} />
  ),
  img: ({ alt, ...props }) => (
    <img
      alt={alt ?? 'markdown-image'}
      className="my-4 w-full rounded-xl border border-zinc-200/80 object-cover shadow-sm"
      {...props}
    />
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
    <div className={className ?? 'prose prose-sm max-w-none text-zinc-700'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
