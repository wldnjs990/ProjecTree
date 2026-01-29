import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { GitBranch, Sparkles, Users, Layers, Zap, Shield } from "lucide-react"

const features = [
    {
        icon: GitBranch,
        title: "트리 시각화",
        description: "프로젝트 전체 구조를 한눈에 파악하세요. 복잡한 기능 계층도 직관적인 트리 뷰로 쉽게 탐색할 수 있습니다.",
        size: "large",
    },
    {
        icon: Sparkles,
        title: "AI 기술 추천",
        description: "프로젝트 요구사항에 딱 맞는 최적의 기술 스택을 AI가 추천해 드립니다.",
        size: "small",
    },
    {
        icon: Users,
        title: "실시간 협업",
        description: "라이브 커서와 실시간 동기화로 팀원들과 끊김 없이 아이디어를 공유하세요.",
        size: "small",
    },
    {
        icon: Layers,
        title: "스마트 명세서",
        description: "기능 트리에서 상세 명세서를 자동으로 생성하세요. Notion, Jira 등으로 내보낼 수 있습니다.",
        size: "medium",
    },
    {
        icon: Zap,
        title: "빠른 개발 설정",
        description: "클릭 한 번으로 필요한 개발 환경 세팅 가이드를 받아보세요.",
        size: "small",
    },
    {
        icon: Shield,
        title: "버전 관리",
        description: "모든 변경 사항을 추적하고 언제든 이전 버전으로 되돌릴 수 있습니다.",
        size: "small",
    },
]

function BentoCard({
    feature,
    index,
}: {
    feature: typeof features[0]
    index: number
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const Icon = feature.icon

    // Determine grid span based on size
    const sizeClasses = {
        large: "md:col-span-2 md:row-span-2",
        medium: "md:col-span-2",
        small: "md:col-span-1",
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 ${sizeClasses[feature.size as keyof typeof sizeClasses]}`}
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.05), transparent 40%)`,
                }}
            />

            {/* Animated Border Beam */}
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    className="h-full w-full"
                    pathLength="100"
                    strokeLinecap="round"
                    fill="none"
                    stroke="url(#emerald-gradient)"
                    strokeWidth="2"
                    style={{
                        strokeDasharray: "15 85",
                        strokeDashoffset: isHovered ? "0" : "100",
                        transition: "stroke-dashoffset 0.5s ease-out",
                    }}
                    rx="16"
                    ry="16"
                />
                <defs>
                    <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Card Content */}
            <div className={`relative z-10 p-6 ${feature.size === "large" ? "p-8" : ""}`}>
                {/* Icon with Glow */}
                <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 transition-all duration-300 group-hover:bg-emerald-100 group-hover:scale-110"
                    style={{
                        boxShadow: isHovered ? "0 0 20px rgba(16, 185, 129, 0.2)" : "none",
                    }}
                >
                    <Icon
                        className="h-6 w-6 text-emerald-600 transition-all duration-300 group-hover:text-emerald-500"
                    />
                </div>

                <h3 className={`mb-2 font-semibold text-zinc-900 ${feature.size === "large" ? "text-2xl" : "text-lg"}`}>
                    {feature.title}
                </h3>
                <p className={`text-zinc-500 leading-relaxed font-medium ${feature.size === "large" ? "text-base" : "text-sm"}`}>
                    {feature.description}
                </p>

                {/* Large card additional content */}
                {feature.size === "large" && (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {["드래그 앤 드롭", "자동 레이아웃", "줌 컨트롤", "SVG 내보내기"].map((tag) => (
                            <div
                                key={tag}
                                className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs text-emerald-600 font-medium"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default function FeaturesSection() {
    return (
        <section className="relative py-24 md:py-32">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-300/10 blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-300/10 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-600 font-semibold"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        주요 기능
                    </motion.div>
                    <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-5xl">
                        더 빠른 프로젝트 완성을 위한{" "}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            모든 도구
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-zinc-500 text-lg font-medium">
                        기획부터 개발 착수까지의 워크플로우를 혁신적으로 단축하는 강력한 기능들
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {features.map((feature, index) => (
                        <BentoCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
