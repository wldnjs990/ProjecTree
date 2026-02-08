import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
    h1: ({ ...props }) => (
        <h1
            className="text-2xl font-bold text-zinc-800 mt-6 mb-3 first:mt-0"
            {...props}
        />
    ),
    h2: ({ ...props }) => (
        <h2
            className="text-xl font-bold text-zinc-800 mt-5 mb-2 first:mt-0"
            {...props}
        />
    ),
    h3: ({ ...props }) => (
        <h3
            className="text-lg font-semibold text-zinc-800 mt-4 mb-2"
            {...props}
        />
    ),
    p: ({ ...props }) => (
        <p
            className="text-sm text-zinc-600 leading-relaxed mb-3"
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
            className="text-sm text-zinc-600 leading-relaxed"
            {...props}
        />
    ),
    blockquote: ({ ...props }) => (
        <blockquote
            className="border-l-4 border-zinc-200 pl-4 text-sm text-zinc-500 my-3 italic"
            {...props}
        />
    ),
    table: ({ ...props }) => (
        <div className="overflow-x-auto mb-3">
            <table
                className="w-full border-collapse border border-zinc-200 text-sm"
                {...props}
            />
        </div>
    ),
    thead: ({ ...props }) => (
        <thead className="bg-zinc-100" {...props} />
    ),
    th: ({ ...props }) => (
        <th
            className="border border-zinc-200 px-3 py-2 text-left text-xs font-semibold text-zinc-700"
            {...props}
        />
    ),
    td: ({ ...props }) => (
        <td
            className="border border-zinc-200 px-3 py-2 text-xs text-zinc-600"
            {...props}
        />
    ),
    code: ({ className, children, ...props }) => {
        const isInline = !className;
        return isInline ? (
            <code
                className="px-1.5 py-0.5 bg-zinc-100 text-emerald-700 rounded text-xs font-mono"
                {...props}
            >
                {children}
            </code>
        ) : (
            <code
                className="block p-3 bg-zinc-100 rounded-lg text-xs font-mono overflow-x-auto mb-3"
                {...props}
            >
                {children}
            </code>
        );
    },
    pre: ({ ...props }) => <pre className="mb-3" {...props} />,
    strong: ({ ...props }) => (
        <strong className="font-semibold text-zinc-800" {...props} />
    ),
    a: ({ ...props }) => (
        <a
            className="text-emerald-600 hover:text-emerald-700 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
};
