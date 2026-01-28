import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Leaf } from "lucide-react"

export default function ComparisonSection() {
    const [sliderPosition, setSliderPosition] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPosition(percentage)
    }

    const handleMouseDown = () => {
        isDragging.current = true
    }

    const handleMouseUp = () => {
        isDragging.current = false
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return
        handleMove(e.clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX)
    }

    return (
        <section className="relative py-24 md:py-32 bg-zinc-950">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-emerald-600/5 blur-[180px]" />
                <div className="absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[120px]" />
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
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-4 py-1.5 text-sm text-emerald-400"
                    >
                        <Leaf className="h-3.5 w-3.5" />
                        Before & After
                    </motion.div>
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                        From chaos to{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            clarity
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-zinc-400 text-lg">
                        Drag the slider to see the transformation
                    </p>
                </motion.div>

                {/* Comparison Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    ref={containerRef}
                    className="relative mx-auto max-w-4xl aspect-video cursor-ew-resize overflow-hidden rounded-2xl border border-zinc-800/50"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                >
                    {/* Before Side (Chaos) */}
                    <div className="absolute inset-0 bg-zinc-950">
                        {/* Noise texture */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />
                        {/* Chaotic wireframe lines */}
                        <svg className="absolute inset-0 h-full w-full opacity-30">
                            {[...Array(15)].map((_, i) => (
                                <line
                                    key={i}
                                    x1={`${Math.random() * 100}%`}
                                    y1={`${Math.random() * 100}%`}
                                    x2={`${Math.random() * 100}%`}
                                    y2={`${Math.random() * 100}%`}
                                    stroke="#71717a"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                            ))}
                        </svg>
                        {/* Scattered boxes */}
                        <div className="absolute inset-0 p-8">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute border border-zinc-700/50 bg-zinc-900/30 rounded"
                                    style={{
                                        left: `${10 + Math.random() * 70}%`,
                                        top: `${10 + Math.random() * 70}%`,
                                        width: `${60 + Math.random() * 80}px`,
                                        height: `${40 + Math.random() * 60}px`,
                                        transform: `rotate(${-15 + Math.random() * 30}deg)`,
                                    }}
                                />
                            ))}
                        </div>
                        {/* Label */}
                        <div className="absolute bottom-6 left-6 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-sm">
                            Without ProjecTree
                        </div>
                    </div>

                    {/* After Side (Order) */}
                    <div
                        className="absolute inset-0 bg-zinc-950"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        {/* Emerald glow background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-zinc-950 to-teal-950/30" />

                        {/* Organized tree structure */}
                        <svg className="absolute inset-0 h-full w-full">
                            {/* Glowing lines */}
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Main trunk */}
                            <line x1="50%" y1="85%" x2="50%" y2="50%" stroke="url(#line-gradient)" strokeWidth="3" filter="url(#glow)" />

                            {/* Branches */}
                            <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="url(#line-gradient)" strokeWidth="2" filter="url(#glow)" />
                            <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="url(#line-gradient)" strokeWidth="2" filter="url(#glow)" />
                            <line x1="25%" y1="30%" x2="15%" y2="15%" stroke="url(#line-gradient)" strokeWidth="1.5" filter="url(#glow)" />
                            <line x1="25%" y1="30%" x2="35%" y2="15%" stroke="url(#line-gradient)" strokeWidth="1.5" filter="url(#glow)" />
                            <line x1="75%" y1="30%" x2="65%" y2="15%" stroke="url(#line-gradient)" strokeWidth="1.5" filter="url(#glow)" />
                            <line x1="75%" y1="30%" x2="85%" y2="15%" stroke="url(#line-gradient)" strokeWidth="1.5" filter="url(#glow)" />
                        </svg>

                        {/* Nodes */}
                        {[
                            { x: 50, y: 85, size: 16 },
                            { x: 50, y: 50, size: 14 },
                            { x: 25, y: 30, size: 12 },
                            { x: 75, y: 30, size: 12 },
                            { x: 15, y: 15, size: 10 },
                            { x: 35, y: 15, size: 10 },
                            { x: 65, y: 15, size: 10 },
                            { x: 85, y: 15, size: 10 },
                        ].map((node, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-emerald-500 border-2 border-emerald-400"
                                style={{
                                    left: `${node.x}%`,
                                    top: `${node.y}%`,
                                    width: node.size,
                                    height: node.size,
                                    transform: "translate(-50%, -50%)",
                                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)",
                                }}
                            />
                        ))}

                        {/* Label */}
                        <div
                            className="absolute bottom-6 right-6 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-4 py-2 text-sm text-emerald-300 backdrop-blur-sm"
                            style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)" }}
                        >
                            With ProjecTree
                        </div>
                    </div>

                    {/* Slider Handle */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
                        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                    >
                        {/* Leaf-shaped handle */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-400 bg-zinc-900"
                            style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}
                        >
                            <Leaf className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
