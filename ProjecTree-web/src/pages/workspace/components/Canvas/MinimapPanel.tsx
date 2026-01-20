import { cn } from "@/lib/utils";
import { MiniMap } from "@xyflow/react";

interface MinimapPanelProps {
  className?: string;
}

/**
 * 워크스페이스 전체 캔버스를 미니맵으로 보여주는 패널
 * nodeColor로 canvas 안에 있는 노드를 보여줄때 색깔을 지정해줄 수 있음
 */
export function MinimapPanel({ className }: MinimapPanelProps) {
  return (
    <div className={cn("flex flex-col items-end gap-3", className)}>
      {/* Minimap Container */}
      <div className="glass rounded-3xl overflow-hidden shadow-lg border border-white/20">
        <div className="w-43.25 h-33 bg-[#808080] rounded-3xl overflow-hidden">
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case "project":
                  return "#64748B";
                case "epic":
                  return "#8B5CF6";
                case "story":
                  return "#2B7FFF";
                case "frontendTask":
                  return "#00D492";
                case "backendTask":
                  return "#06B6D4";
                case "frontendAdvanced":
                  return "#00D492";
                case "backendAdvanced":
                  return "#0891B2";
                default:
                  return "#DEDEDE";
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            className="bg-[#808080]"
            pannable
            zoomable
          />
        </div>
      </div>
    </div>
  );
}
