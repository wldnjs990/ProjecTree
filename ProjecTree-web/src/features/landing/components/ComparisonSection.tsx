import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export function ComparisonSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-emerald-200/20 blur-[180px]" />
        <div className="absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-blue-200/20 blur-[120px]" />
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
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-600 font-medium"
          >
            <Leaf className="h-3.5 w-3.5" />
            사용 전 vs 사용 후
          </motion.div>
          <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-5xl">
            복잡한 기획을{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              구조화된 트리로
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-500 text-lg font-medium">
            슬라이더를 드래그해서 변화를 확인하세요
          </p>
        </motion.div>

        {/* Comparison Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
          className="relative mx-auto max-w-4xl aspect-video cursor-ew-resize overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Before Side */}
          <div className="absolute inset-0 bg-zinc-50">
            <img
              src="/before.png"
              alt="ProjecTree 사용 전"
              className="h-full w-full object-cover select-none pointer-events-none"
              draggable={false}
            />
            {/* Label */}
            <div className="absolute bottom-6 left-6 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm text-zinc-500 font-medium backdrop-blur-sm shadow-sm select-none pointer-events-none">
              ProjecTree 사용 전
            </div>
          </div>

          {/* After Side */}
          <div
            className="absolute inset-0 bg-white"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src="/after.png"
              alt="ProjecTree 사용 후"
              className="h-full w-full object-cover select-none pointer-events-none"
              draggable={false}
            />
            {/* Label */}
            <div className="absolute bottom-6 right-6 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-sm text-emerald-600 font-medium backdrop-blur-sm shadow-lg shadow-emerald-100/50 select-none pointer-events-none">
              ProjecTree 사용 후
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize drop-shadow-md"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Leaf-shaped handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-xl">
              <Leaf className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
