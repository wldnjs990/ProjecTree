import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { getPortfolio, generatePortfolio, updatePortfolio } from '@/apis/portfolio.api';
import { PortfolioSkeleton } from './PortfolioSkeleton';
import { PortfolioViewer } from './PortfolioViewer';
import { PortfolioEditor } from './PortfolioEditor';
import type { Portfolio, PortfolioContainerProps } from '../types';

/**
 * 상태 정의
 * - idle: 초기 로딩 중
 * - loading: 조회 중
 * - generating: AI 생성 중
 * - content: 포트폴리오 있음
 * - empty: 포트폴리오 없음
 * - edit: 편집 모드
 * - error: 에러 발생
 * - failed: AI 생성 실패 (content가 실패 메시지인 경우)
 */
type ViewStatus = 'idle' | 'loading' | 'generating' | 'content' | 'empty' | 'edit' | 'error' | 'failed';

// AI 생성 실패 시 반환되는 메시지
const AI_FAILURE_MESSAGE = '포트폴리오 생성에 실패했습니다.';

/**
 * 포트폴리오 content가 유효한지 검사
 * - null/undefined/빈 문자열 → false
 * - AI 실패 메시지 → false
 */
function isValidContent(content: string | null | undefined): boolean {
    if (!content || !content.trim()) return false;
    if (content.trim() === AI_FAILURE_MESSAGE) return false;
    return true;
}

/**
 * [컴포넌트] 포트폴리오 컨테이너
 * - 메인 로직 및 상태 관리
 * - API 호출 및 Toast 알림
 */
export function PortfolioContainer({ workspaceId }: PortfolioContainerProps) {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [status, setStatus] = useState<ViewStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    // 포트폴리오 조회
    const fetchPortfolio = useCallback(async () => {
        try {
            setStatus('loading');
            setError(null);
            const data = await getPortfolio(workspaceId);

            if (data && isValidContent(data.content)) {
                // 유효한 포트폴리오 존재
                setPortfolio(data);
                setStatus('content');
            } else if (data && data.content?.trim() === AI_FAILURE_MESSAGE) {
                // AI 생성 실패 상태
                setPortfolio(data);
                setStatus('failed');
            } else {
                // 포트폴리오 없음 또는 content가 null
                setPortfolio(data);
                setStatus('empty');
            }
        } catch (err) {
            console.error('포트폴리오 조회 실패:', err);
            setError('포트폴리오를 불러오는 데 실패했습니다.');
            setStatus('error');
        }
    }, [workspaceId]);

    // 초기 로드
    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    // 포트폴리오 생성 (AI 생성)
    const handleGenerate = async () => {
        try {
            setStatus('generating');
            setError(null);
            const created = await generatePortfolio(workspaceId);

            // AI 생성 결과 검증
            if (isValidContent(created.content)) {
                setPortfolio(created);
                setStatus('content');
                toast.success('포트폴리오가 생성되었습니다.');
            } else {
                // AI가 실패 메시지를 반환한 경우
                setPortfolio(created);
                setStatus('failed');
                toast.error('포트폴리오 생성에 실패했습니다.');
            }
        } catch (err) {
            console.error('포트폴리오 생성 실패:', err);
            setError('서버 오류로 포트폴리오 생성에 실패했습니다.');
            toast.error('포트폴리오 생성에 실패했습니다.');
            setStatus('error');
        }
    };

    // 포트폴리오 수정
    const handleUpdate = async (content: string) => {
        if (!portfolio) return;

        try {
            const updated = await updatePortfolio(portfolio.id, content);
            setPortfolio(updated);
            setStatus('content');
            toast.success('포트폴리오가 저장되었습니다.');
        } catch (err) {
            console.error('포트폴리오 수정 실패:', err);
            toast.error('저장에 실패했습니다.');
            throw err;
        }
    };

    // 초기 로딩 / 조회 중
    if (status === 'idle' || status === 'loading') {
        return <PortfolioSkeleton />;
    }

    // AI 생성 중
    if (status === 'generating') {
        return (
            <div className="flex h-full flex-col items-center justify-center text-zinc-500">
                <div className="relative mb-6">
                    <Loader2 className="h-16 w-16 animate-spin text-[var(--figma-neon-green)]" />
                    <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-[var(--figma-neon-green)]/20" />
                </div>
                <p className="text-xl font-bold text-zinc-700 mb-2">
                    🤖 포트폴리오를 생성하고 있습니다
                </p>
                <p className="text-sm text-zinc-500 text-center max-w-md">
                    프로젝트 정보와 담당 업무를 AI가 분석하여
                </p>
                <p className="text-sm text-zinc-500 text-center max-w-md">
                    맞춤형 포트폴리오를 자동으로 작성합니다.
                </p>
                <p className="text-xs text-zinc-400 mt-4">
                    약 10~30초 정도 소요될 수 있습니다
                </p>
            </div>
        );
    }

    // 에러 상태 (서버 오류)
    if (status === 'error') {
        return (
            <div className="flex h-full flex-col items-center justify-center text-zinc-500">
                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-lg font-bold text-zinc-700 mb-1">
                    오류가 발생했습니다
                </p>
                <p className="text-sm text-red-500 text-center mb-4">
                    {error}
                </p>
                <Button
                    onClick={portfolio ? fetchPortfolio : handleGenerate}
                    className={cn(
                        'rounded-xl px-6',
                        'bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90',
                        'text-[var(--figma-tech-green)] font-semibold',
                        'shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
                        'transition-all duration-300'
                    )}
                >
                    다시 시도
                </Button>
            </div>
        );
    }

    // AI 생성 실패 상태 (content가 실패 메시지인 경우)
    if (status === 'failed') {
        return (
            <div className="flex h-full flex-col items-center justify-center text-zinc-500">
                <AlertCircle className="h-12 w-12 text-amber-400 mb-4" />
                <p className="text-lg font-bold text-zinc-700 mb-2">
                    포트폴리오를 생성할 수 없습니다
                </p>
                <div className="text-sm text-zinc-500 text-center max-w-md mb-2">
                    <p>현재 이 워크스페이스에서 담당한 업무가 부족하거나,</p>
                    <p>AI 분석에 필요한 정보가 충분하지 않습니다.</p>
                </div>
                <div className="text-sm text-zinc-400 text-center max-w-md mb-6 bg-zinc-100 rounded-lg p-4">
                    <p className="font-medium text-zinc-600 mb-2">💡 포트폴리오를 생성하려면:</p>
                    <ul className="text-left space-y-1">
                        <li>• 트리 에디터에서 <strong>Task</strong> 또는 <strong>Advance</strong> 노드를 생성하세요</li>
                        <li>• 노드에 본인을 담당자로 지정하세요</li>
                        <li>• 노드에 설명과 노트를 충분히 작성하세요</li>
                    </ul>
                </div>
                <Button
                    onClick={handleGenerate}
                    className={cn(
                        'rounded-xl px-6',
                        'bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90',
                        'text-[var(--figma-tech-green)] font-semibold',
                        'shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
                        'transition-all duration-300'
                    )}
                >
                    다시 시도
                </Button>
            </div>
        );
    }

    // 빈 상태 (포트폴리오 없음)
    if (status === 'empty') {
        return (
            <div className="flex h-full flex-col items-center justify-center text-zinc-500">
                <FileText className="h-12 w-12 text-zinc-300 mb-4" />
                <p className="text-lg font-bold text-zinc-700 mb-2">
                    아직 포트폴리오가 없습니다
                </p>
                <div className="text-sm text-zinc-500 text-center max-w-md mb-2">
                    <p>프로젝트 정보와 담당 업무를 바탕으로</p>
                    <p>AI가 맞춤형 포트폴리오를 자동 생성합니다.</p>
                </div>
                <div className="text-sm text-zinc-400 text-center max-w-md mb-6 bg-zinc-100 rounded-lg p-4">
                    <p className="font-medium text-zinc-600 mb-2">📋 포트폴리오에 포함되는 정보:</p>
                    <ul className="text-left space-y-1">
                        <li>• 프로젝트 개요 및 기술 스택</li>
                        <li>• 본인이 담당한 Task / Advance 업무</li>
                        <li>• 기술 선정 이유 및 성장 포인트</li>
                    </ul>
                </div>
                <Button
                    onClick={handleGenerate}
                    className={cn(
                        'rounded-xl px-6 py-3',
                        'bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90',
                        'text-[var(--figma-tech-green)] font-semibold',
                        'shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
                        'transition-all duration-300'
                    )}
                >
                    🚀 포트폴리오 생성하기
                </Button>
            </div>
        );
    }

    // 편집 모드
    if (status === 'edit' && portfolio) {
        return (
            <PortfolioEditor
                initialContent={portfolio.content}
                onSave={handleUpdate}
                onCancel={() => setStatus('content')}
            />
        );
    }

    // 뷰 모드
    if (status === 'content' && portfolio) {
        return (
            <PortfolioViewer
                content={portfolio.content}
                onEdit={() => setStatus('edit')}
            />
        );
    }

    return null;
}
