import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { HomeButtonWithConfirm } from './HomeButtonWithConfirm';
import forestImage from '@/assets/images/forest2.jpg';

/**
 * [컴포넌트] 사용자 온보딩 좌측 브랜드 패널
 * - 로고, 웨이브 배경, 히어로 콘텐츠를 포함합니다.
 */
export function BrandPanel() {
  return (
    <motion.div
      className="hidden lg:flex flex-col justify-between w-1/2 min-w-[500px] max-w-[800px] p-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image */}
      <img
        src={forestImage}
        alt="Forest Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0f4c3a]/85 z-0" />

      {/* Content Container */}
      <div className="flex flex-col justify-between h-full z-10 relative">
        {/* Logo Area */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <Layers className="text-white h-7 w-7" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            ProjecTree
          </span>
          <HomeButtonWithConfirm className="-mr-2 hover:bg-white/10 text-white/70 hover:text-white ml-auto" />
        </div>

        {/* Hero Content */}
        <motion.div
          className="z-10 flex flex-col justify-center h-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight break-keep">
            함께 성장할 <br />
            <span className="text-green-300">첫 걸음</span>을 떼어보세요
          </h1>
          <p className="text-green-100 text-lg leading-relaxed tracking-tight break-keep">
            프로필을 설정하고 팀원들과 더 나은 협업을 시작하세요
            <br />
            작은 씨앗이 모여 숲이 됩니다
          </p>
        </motion.div>

        {/* Footer */}
        <div className="z-10 text-green-200/60 text-sm tracking-tight">
          © 2026 ProjecTree. All rights reserved.
        </div>
      </div>
    </motion.div>
  );
}
