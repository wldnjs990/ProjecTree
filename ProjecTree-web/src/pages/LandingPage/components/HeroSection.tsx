import React, { useRef, useMemo } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, GitBranch, Layers, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// Digital Firefly Particle Component
function Firefly({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) {
    return (
        <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
            style={{
                left: `${startX}%`,
                bottom: `${startY}%`,
                boxShadow: "0 0 6px 2px rgba(52, 211, 153, 0.6), 0 0 12px 4px rgba(52, 211, 153, 0.3)",
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

// 3D Tilting Glass Card Mockup
function GlassMockupCard({ rotateX, rotateY }: { rotateX: any; rotateY: any }) {
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
                className="absolute inset-0 -z-10 rounded-3xl bg-emerald-500/30 blur-[60px]"
            />

            {/* Glass Card Container */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-900/60 backdrop-blur-xl p-1 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                {/* Inner Border Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20" />

                {/* Mockup Content */}
                <div className="relative rounded-xl bg-zinc-950/80 p-6">
                    {/* Window Controls */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        <span className="ml-4 text-xs text-zinc-500">ProjecTree - 프로젝트 개요</span>
                    </div>

                    {/* Mockup UI */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Sidebar */}
                        <div className="col-span-1 space-y-3 rounded-lg bg-zinc-900/50 p-3">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <GitBranch className="h-4 w-4" />
                                <span className="text-xs">프로젝트 트리</span>
                            </div>
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${60 + i * 10}%` }}
                                        transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                                        className="h-2 rounded-full bg-emerald-500/30"
                                        style={{ marginLeft: `${(i - 1) * 8}px` }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-2 space-y-3 rounded-lg bg-zinc-900/50 p-3">
                            <div className="flex items-center gap-2 text-teal-400">
                                <Layers className="h-4 w-4" />
                                <span className="text-xs">기능 명세</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                                        className="rounded-lg border border-emerald-500/20 bg-zinc-800/50 p-2"
                                    >
                                        <div className="mb-2 h-1.5 w-12 rounded-full bg-emerald-400/40" />
                                        <div className="space-y-1">
                                            <div className="h-1 w-full rounded-full bg-zinc-700" />
                                            <div className="h-1 w-3/4 rounded-full bg-zinc-700" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 30, stiffness: 200 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    const rotateX = useTransform(y, [-300, 300], [8, -8])
    const rotateY = useTransform(x, [-300, 300], [-8, 8])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    // Generate fireflies with random positions
    const fireflies = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            delay: Math.random() * 8,
            duration: 6 + Math.random() * 4,
            startX: Math.random() * 100,
            startY: Math.random() * 30,
        })),
        [])

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 bg-zinc-950"
        >
            {/* Dark Background with Noise Texture */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Animated Grid Background */}
            <motion.div
                style={{ x: useTransform(x, (v) => v * 0.015), y: useTransform(y, (v) => v * 0.015) }}
                className="absolute inset-0"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_30%,transparent_100%)]" />
            </motion.div>

            {/* Emerald Gradient Orbs */}
            <motion.div
                style={{ x: useTransform(x, (v) => v * 0.04), y: useTransform(y, (v) => v * 0.04) }}
                className="absolute top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-600/15 blur-[150px]"
            />
            <motion.div
                style={{ x: useTransform(x, (v) => -v * 0.03), y: useTransform(y, (v) => -v * 0.03) }}
                className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]"
            />

            {/* Digital Fireflies / Data Spores */}
            <div className="absolute inset-0 overflow-hidden">
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
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-md px-5 py-2 text-sm text-emerald-300"
                        style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                    >
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span>당신의 상상 속 아이디어를 현실로</span>
                        <Zap className="h-4 w-4 text-teal-400" />
                    </motion.div>

                    {/* Main Heading with Gradient */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
                    >
                        <span className="text-white">아이디어를 풍성한</span>
                        <br />
                        <span
                            className="bg-gradient-to-r from-white via-emerald-300 to-emerald-500 bg-clip-text text-transparent"
                            style={{ textShadow: "0 0 80px rgba(16, 185, 129, 0.5)" }}
                        >
                            프로젝트 트리로 키워보세요.
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl leading-relaxed"
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
                                className="group relative h-14 gap-3 overflow-hidden rounded-full bg-emerald-600 px-10 text-base font-semibold text-white hover:bg-emerald-500 transition-all duration-300"
                                style={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)" }}
                            >
                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ translateX: ["100%", "-100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                                <span className="relative z-10">무료로 시작하기</span>
                                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* 3D Glass Mockup Card */}
                <GlassMockupCard rotateX={rotateX} rotateY={rotateY} />
            </div>
        </section>
    )
}
