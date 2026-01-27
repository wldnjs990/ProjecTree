import React, { useCallback, useEffect } from 'react';
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
  applyNodeChanges,
  type EdgeChange,
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
import { useNodesCrdt } from '../../hooks/useNodesCrdt';
import { useCursors } from '../../hooks/useCursors';
import { useNodes, useEdges } from '../../stores/nodeStore';
import type { FlowNode } from '../../types/node';
import CursorPointers from './CursorPointers';
import { NodeDetailSidebar } from '../NodeDetailSidebar';

interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

interface TreeCanvasProps {
  initialNodes?: FlowNode[];
  onlineUsers: OnlineUser[];
  unreadMessages?: number;
  onChatClick?: () => void;
  onNodeClick?: (nodeId: string) => void;
}

// 노드 컴포넌트 커스텀용 객체
const nodeTypes = {
  project: ProjectNode,
  epic: EpicNode,
  story: StoryNode,
  task: TaskNode,
  advanced: AdvancedNode,
};

// hideAttribution: reactflow 워터마크가 기본적으로 표시되는데, 그걸 끄는 설정
const proOptions = { hideAttribution: true };
// fitview : 캔버스 화면이 처음 로드될때, 노드가 한눈에 보이게 화면 줌과 포커스를 맞춰주는 기능
// padding: 딱 맞춘 화면의 20% 넓게 잡아줌
const fitviewOptions = { padding: 0.2 };

function TreeCanvasInner({
  initialNodes = [],
  onlineUsers,
  unreadMessages = 0,
  onChatClick,
  onNodeClick,
}: TreeCanvasProps) {
  // 노드 CRDT 훅 (Y.js 노드 동기화)
  const { handleNodeDragStop } = useNodesCrdt({ initialNodes });

  // 커서 CRDT 훅 (Awareness 커서 동기화)
  const { cursors, handleMouseMove } = useCursors();

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
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]);
    },
    [setNodes]
  );

  // 노드 클릭 핸들러
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  // 간선 변경 핸들러
  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) =>
      changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter((e) => e.id !== change.id);
        }
        return acc;
      }, eds)
    );
  };

  const handleConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-full bg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onMouseMove={handleMouseMove}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitviewOptions}
        proOptions={proOptions}
        className="bg-canvas relative"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#ababab"
        />
      </ReactFlow>

      {/* 참여자 마우스 포인터 */}
      <CursorPointers cursors={cursors} />

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

      {/* Node Detail Sidebar - props 대폭 감소 */}
      <NodeDetailSidebar />
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
