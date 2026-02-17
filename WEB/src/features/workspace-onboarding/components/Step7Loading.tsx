export default function Step7Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in relative z-10">

      {/* Growing Tree Animation Area */}
      <div className="relative w-48 h-48 flex items-end justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Main Trunk (줄기) - Slightly curved for organic feel */}
          <path
            d="M100 200 C100 160 100 100 100 60"
            stroke="var(--figma-neon-green)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="animate-trunk"
          />

          {/* Left Branch - Organic Curve */}
          <path
            d="M100 140 C80 130 60 110 40 70"
            stroke="var(--figma-neon-green)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="animate-branch-left"
          />

          {/* Right Branch - Organic Curve */}
          <path
            d="M100 110 C120 100 140 80 160 50"
            stroke="var(--figma-neon-green)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="animate-branch-right"
          />

          {/* Top Left Branch - Organic Curve */}
          <path
            d="M100 60 C90 50 80 45 70 40"
            stroke="var(--figma-neon-green)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="animate-branch-top"
          />

          {/* Top Right Branch - Organic Curve */}
          <path
            d="M100 60 C110 50 120 45 130 40"
            stroke="var(--figma-neon-green)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="animate-branch-top"
          />

          {/* Nodes (잎/열매) - Adjusted to new endpoints */}
          <g>
            {/* Trunk Top Node */}
            <circle cx="100" cy="50" r="5" fill="var(--figma-neon-green)" className="animate-node" />

            {/* Left Branch Tip */}
            <circle cx="40" cy="70" r="5" fill="var(--figma-neon-green)" className="animate-node" />

            {/* Right Branch Tip */}
            <circle cx="160" cy="50" r="5" fill="var(--figma-neon-green)" className="animate-node" />

            {/* Top Left Tip */}
            <circle cx="70" cy="40" r="4" fill="var(--figma-neon-green)" className="animate-node" />

            {/* Top Right Tip */}
            <circle cx="130" cy="40" r="4" fill="var(--figma-neon-green)" className="animate-node" />
          </g>

          {/* Glow Filter */}
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        <style>{`
          .animate-trunk {
            stroke-dasharray: 150;
            stroke-dashoffset: 150;
            animation: trunkCycle 5s ease-in-out infinite;
          }

          .animate-branch-left {
            stroke-dasharray: 130;
            stroke-dashoffset: 130;
            animation: branchLeftCycle 5s ease-in-out infinite;
          }

          .animate-branch-right {
            stroke-dasharray: 130;
            stroke-dashoffset: 130;
            animation: branchRightCycle 5s ease-in-out infinite;
          }

          .animate-branch-top {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: branchTopCycle 5s ease-in-out infinite;
          }

          .animate-node {
            opacity: 0;
            r: 0;
            animation: nodeCycle 5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
          }

          @keyframes trunkCycle {
            0% { stroke-dashoffset: 150; opacity: 1; }
            20% { stroke-dashoffset: 0; opacity: 1; }
            85% { stroke-dashoffset: 0; opacity: 1; }
            95% { stroke-dashoffset: 0; opacity: 0; }
            100% { stroke-dashoffset: 150; opacity: 0; }
          }

          @keyframes branchLeftCycle {
            0% { stroke-dashoffset: 130; opacity: 1; }
            10% { stroke-dashoffset: 130; opacity: 1; }
            30% { stroke-dashoffset: 0; opacity: 1; }
            85% { stroke-dashoffset: 0; opacity: 1; }
            95% { stroke-dashoffset: 0; opacity: 0; }
            100% { stroke-dashoffset: 130; opacity: 0; }
          }

          @keyframes branchRightCycle {
            0% { stroke-dashoffset: 130; opacity: 1; }
            15% { stroke-dashoffset: 130; opacity: 1; }
            35% { stroke-dashoffset: 0; opacity: 1; }
            85% { stroke-dashoffset: 0; opacity: 1; }
            95% { stroke-dashoffset: 0; opacity: 0; }
            100% { stroke-dashoffset: 130; opacity: 0; }
          }

          @keyframes branchTopCycle {
             0% { stroke-dashoffset: 60; opacity: 1; }
            25% { stroke-dashoffset: 60; opacity: 1; }
            40% { stroke-dashoffset: 0; opacity: 1; }
            85% { stroke-dashoffset: 0; opacity: 1; }
            95% { stroke-dashoffset: 0; opacity: 0; }
            100% { stroke-dashoffset: 60; opacity: 0; }
          }

          @keyframes nodeCycle {
             0% { r: 0; opacity: 0; }
            35% { r: 0; opacity: 0; }
            45% { r: 5; opacity: 1; filter: drop-shadow(0 0 6px var(--figma-neon-green)); }
            85% { r: 5; opacity: 1; filter: drop-shadow(0 0 10px var(--figma-neon-green)); }
            95% { opacity: 0; }
            100% { r: 0; opacity: 0; }
          }
        `}</style>
      </div>

      {/* 메시지 */}
      <div className="text-center space-y-2 relative z-20">
        <h3 className="text-[22px] font-bold font-['Pretendard'] text-[#1A1A1A]">
          Project Tree Growing...
        </h3>
        <p className="text-[#757575] font-['Pretendard'] font-medium text-[15px]">
          당신의 비전을 구조화하고 있습니다.
        </p>
      </div>
    </div>
  );
}
