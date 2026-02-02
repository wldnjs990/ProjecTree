import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { HomeButtonWithConfirm } from './HomeButtonWithConfirm';

/**
 * [컴포넌트] 사용자 온보딩 좌측 브랜드 패널
 * - 로고, 웨이브 배경, 히어로 콘텐츠를 포함합니다.
 */
export function BrandPanel() {
  return (
    <motion.div
      className="hidden lg:flex flex-col justify-between w-2/5 min-w-[400px] max-w-[600px] p-16 relative overflow-hidden"
      style={{
        backgroundColor: '#0f4c3a',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Organic Wave Layer 1 (Back) */}
      <div
        className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23145d48' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* Organic Wave Layer 2 (Middle) */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%231a6e56' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* Organic Wave Layer 3 (Front) */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none opacity-80"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23207f63' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

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
    </motion.div>
  );
}
