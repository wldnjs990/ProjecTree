import { cn } from '@/lib/utils';
import { MiniMap } from '@xyflow/react';
import { useLayoutEffect, useRef, useState } from 'react';

interface MinimapPanelProps {
  className?: string;
}

/**
 * 워크스페이스 전체 캔버스를 미니맵으로 보여주는 패널
 * nodeColor로 canvas 안에 있는 노드를 보여줄때 색깔을 지정해줄 수 있음
 */
export function MinimapPanel({ className }: MinimapPanelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const width = wrapRef.current.clientWidth;
    const height = wrapRef.current.clientHeight;
    setSize({ w: width, h: height });
  }, []);

  return (
    <div className={cn('flex flex-col items-end gap-3 ', className)}>
      {/* Minimap Container */}
      <div
        className="rounded-2xl w-48 h-36 bg-white/35 backdrop-blur-md border border-white/40 shadow-lg"
        ref={wrapRef}
      >
        <MiniMap
          className="bg-[#808080] rounded-xl absolute top-0 left-0"
          style={{ width: size.w - 28, height: size.h - 28 }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'PROJECT':
                return '#64748B';
              case 'EPIC':
                return '#8B5CF6';
              case 'STORY':
                return '#2B7FFF';
              case 'TASK':
                return '#00D492';
              case 'ADVANCE':
                return '#06B6D4';
              default:
                return '#DEDEDE';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          pannable
          zoomable
        />
      </div>
    </div>
  );
}
