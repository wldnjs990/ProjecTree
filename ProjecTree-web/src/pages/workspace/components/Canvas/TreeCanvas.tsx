import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProjectNode } from './nodes/ProjectNode';
import { EpicNode } from './nodes/EpicNode';
import { StoryNode } from './nodes/StoryNode';
import { CollabPanel } from './CollabPanel';
import { MinimapPanel } from './MinimapPanel';
import { ZoomControls } from './ZoomControls';
import type { AvatarColor } from '@/components/custom/UserAvatar';
import ChatButton from './ChatButton';
import { AdvancedNode, TaskNode } from './nodes';
import useCrdt from '../../hooks/useCrdt';
import { MousePointer2 } from 'lucide-react';

interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

interface TreeCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onlineUsers: OnlineUser[];
  unreadMessages?: number;
  onChatClick?: () => void;
  onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
  project: ProjectNode,
  epic: EpicNode,
  story: StoryNode,
  task: TaskNode,
  advanced: AdvancedNode,
};

function TreeCanvasInner({
  initialNodes,
  initialEdges,
  onlineUsers,
  unreadMessages = 0,
  onChatClick,
  onNodeClick,
}: TreeCanvasProps) {
  // useReactFlow 유틸 함수 flowToScreenPosition
  const { flowToScreenPosition } = useReactFlow();

  // crdt 훅
  const { cursors, handleMouseMove } = useCrdt();

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className="relative w-full h-full bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onMouseMove={handleMouseMove}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={proOptions}
        className="bg-canvas relative"
      >
        {/* 도트 배경 깔아주기 */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#DEDEDE"
        />
      </ReactFlow>
      {/* 참여자 마우스 포인터 */}
      {[...cursors.entries()].map(([clientId, state]) => {
        if (!state.cursor) return;
        // flow 좌표 → 화면 좌표로 변환
        const screenPos = flowToScreenPosition({
          x: state.cursor.x,
          y: state.cursor.y,
        });
        return (
          state.cursor && (
            <div
              key={clientId}
              style={{
                position: 'fixed',
                left: screenPos.x,
                top: screenPos.y,
                zIndex: 10,
                transform: 'translate(-50%, -50%)',
                transformOrigin: 'center',
                pointerEvents: 'none', // 클릭 방해 안 하도록
              }}
            >
              <MousePointer2 className="text-primary" />
              <span className="absolute left-full text-xs">{clientId}</span>
            </div>
          )
        );
      })}

      {/* Collaboration Panel - Top Left */}
      <CollabPanel users={onlineUsers} className="absolute top-6 left-6 z-10" />

      {/* Minimap Panel - Bottom Right */}
      <MinimapPanel className="absolute bottom-6 right-6 z-10" />

      {/* ReactFlow 캔버스 컨트롤 버튼 - Bottom Left */}
      <ZoomControls className="absolute bottom-6 left-6 z-10" />

      {/* chat button - 마우스 드래그로 이동 */}
      <ChatButton
        className="absolute bottom-6 left-16 z-10"
        unreadMessages={unreadMessages}
        onChatClick={onChatClick}
      />
    </div>
  );
}

// Wrap with ReactFlowProvider
export function TreeCanvas(props: TreeCanvasProps) {
  return (
    <ReactFlowProvider>
      <TreeCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
