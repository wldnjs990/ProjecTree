/**
 * [컴포넌트] 포트폴리오 로딩 스켈레톤
 * - 전체 영역을 채우는 레이아웃
 * - 텍스트 라인들이 깜빡이는 shimmer 효과
 */
export function PortfolioSkeleton() {
    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/60 backdrop-blur-sm">
                <div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-200/60" />
                <div className="h-9 w-20 animate-pulse rounded-xl bg-zinc-200/60" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 overflow-auto px-6 py-6">
                <div className="space-y-4">
                    {/* Title line */}
                    <div className="h-7 w-2/3 animate-pulse rounded-lg bg-zinc-200/50" />

                    {/* Paragraph lines */}
                    <div className="space-y-3 pt-4">
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-200/40" />
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-200/40" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200/40" />
                    </div>

                    {/* Another paragraph */}
                    <div className="space-y-3 pt-6">
                        <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-200/50" />
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-200/40" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200/40" />
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-200/40" />
                    </div>

                    {/* Third paragraph */}
                    <div className="space-y-3 pt-6">
                        <div className="h-5 w-1/4 animate-pulse rounded bg-zinc-200/50" />
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-200/40" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200/40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
