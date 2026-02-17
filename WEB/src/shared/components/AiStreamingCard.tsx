import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface AiStreamingCardProps {
  text: string;
  title?: string;
  compact?: boolean;
  className?: string;
}

export function AiStreamingCard({
  text,
  title = 'AI 추론 중...',
  compact = false,
  className,
}: AiStreamingCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border',
        'border-[#B9C7F6]/60 bg-gradient-to-br from-[#F5F8FF] via-[#FDFEFF] to-[#EEF4FF]',
        'shadow-[0_6px_16px_rgba(28,105,227,0.08)]',
        compact ? 'p-2 text-[10px]' : 'p-3 text-xs',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(28,105,227,0.15),_transparent_60%)]" />
      <div className="relative flex items-start gap-2">
        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C69E3]/15 text-[#1C69E3]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#1C69E3]">
              {title}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1C69E3]/10 px-2 py-0.5 text-[10px] font-medium text-[#1C69E3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1C69E3] animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="mt-1 text-[#3A4A66] leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
