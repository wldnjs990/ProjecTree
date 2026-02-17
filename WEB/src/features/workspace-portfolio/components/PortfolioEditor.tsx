import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/shared/lib/utils';
import { Loader2, Eye, Pencil } from 'lucide-react';
import type { PortfolioEditorProps } from '../types';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer';

/**
 * [컴포넌트] 포트폴리오 에디터 (편집 모드)
 * - 전체 영역을 채우는 레이아웃
 * - 마크다운 작성 지원
 */
export function PortfolioEditor({
  initialContent,
  onSave,
  onCancel,
}: PortfolioEditorProps) {
  const [content, setContent] = useState(initialContent ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const hasChanges = content !== (initialContent ?? '');

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  };

  const handleSave = async () => {
    if (!content?.trim()) return;

    setIsSaving(true);
    try {
      await onSave(content);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-zinc-800 tracking-tight">
            포트폴리오 편집
          </h2>
          <div className="flex items-center bg-zinc-100/60 rounded-lg p-0.5">
            <button
              onClick={() => setIsPreview(false)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                !isPreview
                  ? 'bg-white text-zinc-800 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Pencil className="h-3 w-3" />
              편집
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                isPreview
                  ? 'bg-white text-zinc-800 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Eye className="h-3 w-3" />
              미리보기
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className={cn(
              'rounded-xl px-4',
              'border-white/60 bg-white/60',
              'text-zinc-600 hover:bg-white/80 hover:text-zinc-900',
              'backdrop-blur-sm transition-all duration-300'
            )}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !content?.trim()}
            className={cn(
              'rounded-xl px-4',
              'bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90',
              'text-[var(--figma-tech-green)] font-semibold',
              'shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
              'disabled:opacity-50',
              'transition-all duration-300'
            )}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            저장
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {isPreview ? (
          <div className="flex-1 overflow-auto rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/30 [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="prose prose-zinc max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="포트폴리오 내용을 마크다운 형식으로 수정하세요..."
            disabled={isSaving}
            className={cn(
              'flex-1 w-full resize-none rounded-xl',
              'bg-white/50 backdrop-blur-sm',
              'border border-white/60 shadow-sm',
              'focus:bg-white focus:ring-2 focus:ring-[var(--figma-neon-green)]/40',
              'focus:border-[var(--figma-neon-green)]',
              'text-zinc-800 placeholder:text-zinc-400',
              'transition-all duration-300',
              'hover:bg-white/60',
              'font-mono text-sm leading-relaxed'
            )}
          />
        )}
        <div className="mt-3 flex justify-end">
          <span className="text-xs text-zinc-400">
            {(content ?? '').length.toLocaleString()} 자
          </span>
        </div>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>편집을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              변경된 내용이 저장되지 않고 사라집니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 편집</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>취소하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
