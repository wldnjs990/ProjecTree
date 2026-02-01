import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginIntro() {
    return (
        <div
            className="hidden lg:flex flex-col justify-between w-1/2 min-w-[500px] max-w-[800px] p-16 relative overflow-hidden"
            style={{
                backgroundColor: '#0f4c3a',
                backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)',
                backgroundSize: '32px 32px',
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 z-10">
                <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                    <Layers className="text-white h-7 w-7" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                    ProjecTree
                </span>
            </div>

            {/* Hero Section - Vertically Centered */}
            <motion.div
                className="z-10 flex flex-col justify-center h-full max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight break-keep">
                    생각의 씨앗을
                    <br />
                    거대한 숲으로
                </h1>
                <p className="text-gray-300 text-lg lg:text-xl leading-relaxed tracking-tight break-keep max-w-lg">
                    복잡하게 얽힌 아이디어,
                    <br />
                    명확한 트리 구조로 정리하고 성공적인 프로젝트로 키워보세요.
                </p>
            </motion.div>

            {/* Footer/Copyright */}
            <div className="z-10 text-gray-400 text-sm tracking-tight">
                © 2026 ProjecTree. All rights reserved.
            </div>

            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </div>
    );
}
