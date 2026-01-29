import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// Digital Firefly Particle Component
function Firefly({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) {
    return (
        <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500"
            style={{
                left: `${startX}%`,
                bottom: `${startY}%`,
                boxShadow: "0 0 6px 2px rgba(16, 185, 129, 0.4), 0 0 12px 4px rgba(16, 185, 129, 0.2)",
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
                opacity: [0, 0.8, 0.4, 0.9, 0],
                y: [0, -150, -300, -450, -600],
                x: [0, 20, -10, 30, 0],
                scale: [0.5, 1, 0.8, 1.2, 0.3],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeOut",
            }}
        />
    )
}

// 3D Tilting Glass Card Mockup with Carousel
function GlassMockupCard({ rotateX, rotateY }: { rotateX: MotionValue<number>; rotateY: MotionValue<number> }) {
    const images = [
        { src: "/tree.png", alt: "ProjecTree - 트리 시각화", label: "트리 시각화" },
        { src: "/spec.png", alt: "ProjecTree - 명세서", label: "명세서 생성" },
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-rotate images every 4 seconds
    useState(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 4000)
        return () => clearInterval(interval)
    })

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: "preserve-3d"
            }}
            className="relative mx-auto mt-16 max-w-3xl"
        >
            {/* Breathing Glow Behind Card */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 -z-10 rounded-3xl bg-emerald-400/20 blur-[60px]"
            />

            {/* Glass Card Container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-1 shadow-2xl shadow-emerald-100/50">
                {/* Inner Border Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 via-transparent to-emerald-50/50" />

                {/* Mockup Content */}
                <div className="relative rounded-xl bg-white/90 p-6 shadow-inner">
                    {/* Window Controls */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                        <div className="h-3 w-3 rounded-full bg-green-400/80" />
                        <span className="ml-4 text-xs text-zinc-400">ProjecTree - {images[currentIndex].label}</span>
                    </div>

                    {/* Mockup UI - Carousel */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                        {images.map((image, index) => (
                            <motion.img
                                key={image.src}
                                src={image.src}
                                alt={image.alt}
                                className="absolute inset-0 h-full w-full object-cover object-top"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: index === currentIndex ? 1 : 0,
                                    scale: index === currentIndex ? 1 : 1.05,
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ))}

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'bg-emerald-500 w-6'
                                            : 'bg-zinc-300 hover:bg-zinc-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate fireflies with random positions (only once on mount)
  const [fireflies] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 4,
      startX: Math.random() * 100,
      startY: Math.random() * 30,
    }))
  );

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12"
        >
            {/* Animated Grid Background */}
            <motion.div
                style={{ x: useTransform(x, (v) => v * 0.015), y: useTransform(y, (v) => v * 0.015) }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_30%,transparent_100%)] opacity-50" />
            </motion.div>

            {/* Light Gradient Orbs */}
            <motion.div
                style={{ x: useTransform(x, (v) => v * 0.04), y: useTransform(y, (v) => v * 0.04) }}
                className="absolute top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-300/20 blur-[150px]"
            />
            <motion.div
                style={{ x: useTransform(x, (v) => -v * 0.03), y: useTransform(y, (v) => -v * 0.03) }}
                className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-[120px]"
            />

            {/* Digital Fireflies / Data Spores */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {fireflies.map((firefly) => (
                    <Firefly key={firefly.id} {...firefly} />
                ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 backdrop-blur-md px-5 py-2 text-sm text-emerald-700 font-medium"
                        style={{ boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)" }}
                    >
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        <span>당신의 상상 속 아이디어를 현실로</span>
                        <Zap className="h-4 w-4 text-teal-500" />
                    </motion.div>

                    {/* Main Heading with Gradient */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl text-zinc-900"
                    >
                        아이디어를 풍성한
                        <br />
                        <span
                            className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent"
                            style={{ textShadow: "0 0 40px rgba(16, 185, 129, 0.2)" }}
                        >
                            프로젝트 트리로 키워보세요.
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 md:text-xl leading-relaxed font-medium"
                    >
                        막연한 아이디어를 체계적인 개발 로드맵으로 변환해주는 AI 기반 프로젝트 플래닝.
                        <br className="hidden md:block" /> 확신을 가지고 개발을 시작하세요.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                    >
                        <Link to="/user-onboarding">
                            <Button
                                size="lg"
                                className="group relative h-14 gap-3 overflow-hidden rounded-full bg-emerald-600 px-10 text-base font-semibold text-white hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-emerald-200"
                            >
                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ translateX: ["100%", "-100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                                <span className="relative z-10">시작하기</span>
                                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

        {/* 3D Glass Mockup Card */}
        <GlassMockupCard rotateX={rotateX} rotateY={rotateY} />
      </div>
    </section>
  );
}
