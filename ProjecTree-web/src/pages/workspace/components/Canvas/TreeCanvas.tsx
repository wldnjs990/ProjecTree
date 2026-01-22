import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type NodeChange,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
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
import { useNodes, useEdges } from '../../stores/nodeStore';
import type { FlowNode } from '../../types/node';

interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

interface TreeCanvasProps {
  roomId: string;
  initialNodes?: FlowNode[];
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
  roomId,
  initialNodes = [],
  onlineUsers,
  unreadMessages = 0,
  onChatClick,
  onNodeClick,
}: TreeCanvasProps) {
  const { flowToScreenPosition } = useReactFlow();

  // CRDT 훅 (Y.js + 스토어 연동)
  const { cursors, handleMouseMove, handleNodeDragStop } = useCrdt({
    roomId,
    initialNodes,
  });

  // Zustand 스토어에서 노드/엣지 가져오기
  const storeNodes = useNodes();
  const storeEdges = useEdges();

  // ReactFlow 로컬 상태 (드래그 중 즉시 반영용)
  const [nodes, setNodes] = useNodesState(storeNodes);
  const [edges, setEdges] = useEdgesState(storeEdges);

  // 스토어 노드가 변경되면 로컬 상태에 반영
  useEffect(() => {
    if (storeNodes.length > 0) {
      setNodes(storeNodes);
    }
  }, [storeNodes, setNodes]);

  useEffect(() => {
    if (storeEdges.length > 0) {
      setEdges(storeEdges);
    }
  }, [storeEdges, setEdges]);

  // 노드 변경 핸들러 (드래그 중 로컬 즉시 반영)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]);
    },
    [setNodes]
  );

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
        onEdgesChange={(changes) =>
          setEdges((eds) =>
            changes.reduce((acc, change) => {
              if (change.type === 'remove') {
                return acc.filter((e) => e.id !== change.id);
              }
              return acc;
            }, eds)
          )
        }
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={proOptions}
        className="bg-canvas relative"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#DEDEDE"
        />
      </ReactFlow>

      {/* 참여자 마우스 포인터 */}
      {[...cursors.entries()].map(([clientId, state]) => {
        if (!state.cursor) return null;
        const screenPos = flowToScreenPosition({
          x: state.cursor.x,
          y: state.cursor.y,
        });
        return (
          <div
            key={clientId}
            style={{
              position: 'fixed',
              left: screenPos.x,
              top: screenPos.y,
              zIndex: 10,
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center',
              pointerEvents: 'none',
            }}
          >
            <MousePointer2 className="text-primary" />
            <span className="absolute left-full text-xs">{clientId}</span>
          </div>
        );
      })}

      {/* Collaboration Panel - Top Left */}
      <CollabPanel users={onlineUsers} className="absolute top-6 left-6 z-10" />

      {/* Minimap Panel - Bottom Right */}
      <MinimapPanel className="absolute bottom-6 right-6 z-10" />

      {/* ReactFlow 캔버스 컨트롤 버튼 - Bottom Left */}
      <ZoomControls className="absolute bottom-6 left-6 z-10" />

      {/* chat button */}
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
