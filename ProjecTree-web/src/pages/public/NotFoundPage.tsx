
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

/**
 * [페이지] 404 Not Found
 * - 존재하지 않는 페이지 접근 시 표시
 * - Minimal Layout, Solid Colors, No Background, No Animation
 * - Responsive: Splits on desktop, stacks on mobile. Allows scrolling on small screens.
 */
export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            {/* Container (Flex Row for Split Layout) */}
            <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-center gap-12 md:gap-24 relative z-10 text-center md:text-left">

                {/* Left: Solid 404 Visual (No Animation) */}
                <div className="flex items-center justify-center relative shrink-0">
                    <h1 className="
            text-[120px] sm:text-[180px] md:text-[280px] font-black tracking-tighter leading-none
            text-[var(--figma-tech-green)]
            select-none
           ">
                        404
                    </h1>
                </div>

                {/* Right: Content & Actions */}
                <div className="flex flex-col justify-center py-6 md:py-12 max-w-md">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-3 text-balance">
                                이런...
                            </h2>
                            <p className="text-lg md:text-2xl font-semibold text-zinc-600 text-balance">
                                페이지를 찾을 수 없습니다.
                            </p>
                        </div>

                        <p className="text-base text-zinc-500 leading-relaxed whitespace-pre-line text-balance">
                            존재하지 않는 주소를 입력하셨거나{'\n'}
                            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.{'\n'}
                            주소를 다시 확인해주세요.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                            <Button
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                className="h-12 px-8 rounded-xl bg-white/50 border border-zinc-200 shadow-sm text-zinc-600 hover:bg-zinc-50 transition-all duration-300"
                            >
                                이전 페이지
                            </Button>

                            <Button
                                onClick={() => navigate('/workspace-lounge')}
                                className="h-12 px-8 rounded-xl bg-[#4ADE80]/80 hover:bg-[#4ADE80]/90 text-[#064E3B] font-bold shadow-lg shadow-green-500/20 border border-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                            >
                                내 워크스페이스
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
