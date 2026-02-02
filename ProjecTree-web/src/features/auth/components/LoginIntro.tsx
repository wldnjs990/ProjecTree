import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import forestImage from '@/assets/images/forest.jpg';

export function LoginIntro() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 min-w-[500px] max-w-[800px] p-16 relative overflow-hidden">
      {/* Background Image */}
      <img
        src={forestImage}
        alt="Forest Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0f4c3a]/85 z-0" />

      {/* Content Container (z-10 to sit above background) */}
      <div className="flex flex-col justify-between h-full z-10 relative">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 z-10 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <Layers className="text-white h-7 w-7" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            ProjecTree
          </span>
        </Link>

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
            작은 아이디어들이 모여 울창한 숲을 이루기까지,
            <br />
            ProjecTree가 당신의 모든 과정을 함께합니다.
          </p>
        </motion.div>

        {/* Footer/Copyright */}
        <div className="z-10 text-gray-400 text-sm tracking-tight">
          © 2026 ProjecTree. All rights reserved.
        </div>
      </div>

      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
    </div>
  );
}
