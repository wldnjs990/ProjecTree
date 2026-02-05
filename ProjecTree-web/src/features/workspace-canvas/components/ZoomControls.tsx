import { Plus, Minus, Maximize2, RotateCcw, LayoutGrid } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getAutoLayoutedNodes,
  generateEdges,
  useNodeStore,
  type FlowNode,
} from '@/features/workspace-core';

interface ZoomControlsProps {
  className?: string;
}

export function ZoomControls({ className }: ZoomControlsProps) {
  const { zoomIn, zoomOut, fitView, setViewport, setNodes, getNodes } =
    useReactFlow();
  const { setNodes: setStoreNodes } = useNodeStore();

  const handleReset = () => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  const handleAutoLayout = () => {
    const currentNodes = getNodes() as FlowNode[];
    // 스토어에서 parentId 포함된 노드 가져오기
    const storeNodes = useNodeStore.getState().nodes;
    // parentId를 복원하여 edges 생성
    const nodesWithParent = currentNodes.map((node) => {
      const storeNode = storeNodes.find((n) => n.id === node.id);
      return {
        ...node,
        parentId: storeNode?.parentId,
      } as FlowNode;
    });

    const edges = generateEdges(nodesWithParent);
    const layoutedNodes = getAutoLayoutedNodes(nodesWithParent, edges);

    // ReactFlow 로컬 상태 업데이트
    setNodes(layoutedNodes);
    // Zustand 스토어도 업데이트 (CRDT 동기화용)
    setStoreNodes(layoutedNodes);

    // 정렬 후 전체 뷰에 맞춤
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            onClick={() => zoomIn()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">확대</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            onClick={() => zoomOut()}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">축소</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            onClick={() => fitView({ padding: 0.2 })}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">전체 보기</TooltipContent>
      </Tooltip>

      <div className="w-full h-px bg-gray-200 my-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white hover:bg-violet-50 hover:border-violet-300"
            onClick={handleAutoLayout}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">자동 정렬</TooltipContent>
      </Tooltip>
    </div>
  );
}
