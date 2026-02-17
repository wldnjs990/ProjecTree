import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useUser } from '@/shared/stores/userStore';
import { Download, FileText } from 'lucide-react';
import type { PortfolioViewerProps } from '../types';
import { useWorkspaceName } from '@/features/workspace-core';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer';

/**
 * 마크다운 파일 다운로드 함수
 */
function downloadMarkdown(content: string, filename: string = 'portfolio.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * [컴포넌트] 포트폴리오 뷰어 (읽기 전용)
 * - 전체 영역을 채우는 레이아웃
 * - 마크다운 렌더링 지원
 */
export function PortfolioViewer({ content, onEdit }: PortfolioViewerProps) {
  const user = useUser();
  const nickname = user?.nickname || '사용자';
  const workspaceName = useWorkspaceName() || '프로젝트';

  const handleExport = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    downloadMarkdown(
      content,
      `포트폴리오_${workspaceName}_${nickname}_${dateStr}.md`
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/60 backdrop-blur-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-800 tracking-tight min-w-0">
          <FileText className="h-5 w-5 flex-shrink-0 text-zinc-500" />
          <span className="truncate">
            <span className="text-2xl">{nickname}</span> 님의 포트폴리오
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            className={cn(
              'rounded-xl px-4',
              'border-white/60 bg-white/60',
              'text-zinc-600 hover:bg-white/80 hover:text-zinc-900',
              'backdrop-blur-sm transition-all duration-300'
            )}
          >
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button
            onClick={onEdit}
            className={cn(
              'rounded-xl px-4',
              'bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90',
              'text-[var(--figma-tech-green)] font-semibold',
              'shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
              'transition-all duration-300'
            )}
          >
            편집
          </Button>
        </div>
      </div>

      {/* Content - Markdown */}
      <div className="flex-1 overflow-auto px-6 py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/30 [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="prose prose-zinc max-w-none">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
