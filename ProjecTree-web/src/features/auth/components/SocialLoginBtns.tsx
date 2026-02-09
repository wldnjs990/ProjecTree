import { Layers, Github, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { redirectToGithubOauth, redirectToGoogleOauth } from '@/apis';

export function SocialLoginBtns() {
    const handleGoogleOauth = () => {
        redirectToGoogleOauth();
    };
    const handleGithubOauth = () => {
        redirectToGithubOauth();
    };

    return (
        <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 sm:p-16 lg:p-24">
            <motion.div
                className="w-full max-w-sm flex flex-col gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="lg:hidden flex justify-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0f4c3a] p-2 rounded-lg">
                            <Layers className="text-white h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold text-[#0f4c3a] tracking-tight">
                            ProjecTree
                        </span>
                    </div>
                </div>

                <div className="text-center sm:text-left space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight break-keep">
                        오늘도 성장할
                        <br className="hidden sm:block" />
                        준비 되셨나요?
                        <Sprout
                            className="text-[#0f4c3a] h-8 w-8 inline-block ml-2 mb-1"
                            strokeWidth={2.5}
                        />
                    </h2>
                    <p className="text-gray-500 text-lg tracking-tight break-keep whitespace-pre-line">
                        아이디어를 트리 구조로 정리하고,{'\n'}팀과 함께 성장하세요.
                    </p>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                    {/* Google Login Button */}
                    <Button
                        variant="outline"
                        className="h-12 w-full text-base font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-slate-700 justify-center tracking-tight transition-all rounded-md shadow-sm"
                        onClick={handleGoogleOauth}
                    >
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google로 시작하기
                    </Button>

                    {/* GitHub Login Button */}
                    <Button
                        className="h-12 w-full text-base font-medium bg-gray-900 hover:bg-gray-800 text-white justify-center tracking-tight transition-all rounded-md shadow-lg shadow-gray-900/10"
                        onClick={handleGithubOauth}
                    >
                        <Github className="mr-3 h-5 w-5" />
                        GitHub로 시작하기
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
