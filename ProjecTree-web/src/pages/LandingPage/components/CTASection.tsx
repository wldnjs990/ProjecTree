import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-zinc-950">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0">
        {/* Main aurora gradient rising from bottom */}
        <motion.div
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[800px] w-[1200px] rounded-full bg-gradient-to-t from-emerald-600/30 via-emerald-500/10 to-transparent blur-[100px]"
        />

        {/* Secondary aurora layers */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [-50, 50, -50],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-teal-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.3, 0.2],
            x: [50, -50, 50],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-400/15 blur-[100px]"
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-md px-4 py-2 text-sm text-emerald-300"
            style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}
          >
            <Sparkles className="h-4 w-4" />
            성장할 준비 되셨나요?
          </motion.div>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            오늘 바로 나만의{' '}
            <span
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent"
              style={{ textShadow: '0 0 60px rgba(16, 185, 129, 0.4)' }}
            >
              프로젝트 트리
            </span>{' '}
            를 심어보세요
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-400 leading-relaxed">
            수많은 개발자들이 선택한 혁신적인 기획 도구. 지금 무료로 시작하여
            확장성을 경험해 보세요.
          </p>

          {/* CTA Button with Pulse */}
          <Link to="/workspace-lounge">
            <Button
              size="lg"
              className="group relative h-16 gap-3 overflow-hidden rounded-full bg-emerald-600 px-12 text-lg font-semibold text-white hover:bg-emerald-500 transition-all duration-300"
              style={{
                boxShadow:
                  '0 0 50px rgba(16, 185, 129, 0.5), 0 0 100px rgba(16, 185, 129, 0.3)',
              }}
            >
              {/* Animated pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              />

              <span className="relative z-10">무료로 시작하기</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500"
          >
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              신용카드 필요 없음
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              평생 무료 플랜 제공
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              언제든 해지 가능
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
