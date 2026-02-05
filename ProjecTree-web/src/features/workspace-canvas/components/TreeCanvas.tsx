import React, { useCallback, useEffect, useMemo } from 'react';
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
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CollabPanel } from './CollabPanel';
import { MinimapPanel } from './MinimapPanel';
import { ZoomControls } from './ZoomControls';
import type { AvatarColor } from '@/shared/components/UserAvatar';
import {
  AdvancedNode,
  EpicNode,
  ProjectNode,
  StoryNode,
  TaskNode,
  PreviewNode,
} from './Nodes';
import {
  useNodesCrdt,
  useCursors,
  useUndoRedo,
  useNodes,
  useEdges,
  useSelectedNodeId,
  usePreviewNodes,
  usePreviewNodesCrdt,
  type FlowNode,
} from '@/features/workspace-core';
import CursorPointers from './CursorPointers';
// TODO: workspace-node-detail feature 생성 후 import 경로 수정
import { NodeDetailSidebar } from '@/features/workspace-node-detail';
import { useUser } from '@/shared/stores/userStore';

interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

interface TreeCanvasProps {
  initialNodes?: FlowNode[];
  onlineUsers: OnlineUser[];
  onNodeClick?: (nodeId: string) => void;
}

// 노드 컴포넌트 커스텀용 객체
const nodeTypes = {
  PROJECT: ProjectNode,
  EPIC: EpicNode,
  STORY: StoryNode,
  TASK: TaskNode,
  ADVANCE: AdvancedNode,
  PREVIEW: PreviewNode,
};

// hideAttribution: reactflow 워터마크가 기본적으로 표시되는데, 그걸 끄는 설정
const proOptions = { hideAttribution: true };
// fitview : 캔버스 화면이 처음 로드될때, 노드가 한눈에 보이게 화면 줌과 포커스를 맞춰주는 기능
// padding: 딱 맞춘 화면의 20% 넓게 잡아줌
const fitviewOptions = { padding: 0.2 };

function TreeCanvasInner({
  initialNodes = [],
  onlineUsers,
  onNodeClick,
}: TreeCanvasProps) {
  const { fitView } = useReactFlow();

  // 노드 CRDT 훅 (Y.js 노드 동기화)
  const { handleNodeDragStop } = useNodesCrdt({ initialNodes });

  // 커서 CRDT 훅 (Awareness 커서 동기화)
  const { cursors, handleMouseMove, setUserInfo } = useCursors();

  // 유저 닉네임 가져오기(awareness 등록용)
  const nickname = useUser()?.nickname || '익명';

  // 유저 정보 awareness 훅
  setUserInfo(nickname, '#F24822');

  // Undo/Redo 키보드 이벤트 훅 (Ctrl+Z, Ctrl+Shift+Z)
  useUndoRedo();

  // Preview 노드 CRDT 동기화 훅
  usePreviewNodesCrdt();

  // Zustand 스토어에서 노드/엣지 가져오기
  const storeNodes = useNodes();
  const storeEdges = useEdges();
  const selectedNodeId = useSelectedNodeId();
  const previewNodes = usePreviewNodes();

  // ReactFlow 로컬 상태 (드래그 중 즉시 반영용)
  const [nodes, setNodes] = useNodesState(storeNodes);
  const [edges, setEdges] = useEdgesState(storeEdges);

  // 스토어 노드 + 미리보기 노드 병합
  const displayNodes = useMemo(() => {
    // ReactFlow에 전달 시 parentId 제거 → 부모 드래그 시 자식 연동 이동 비활성화
    const nodesForReactFlow = storeNodes.map(
      ({ parentId: _, ...node }) => node
    );
    // 미리보기 노드들이 있으면 병합
    if (previewNodes.length > 0) {
      const previewNodesWithoutParent = previewNodes.map(
        ({ parentId: _, ...node }) => node
      );
      return [...nodesForReactFlow, ...previewNodesWithoutParent] as FlowNode[];
    }
    return nodesForReactFlow as FlowNode[];
  }, [storeNodes, previewNodes]);

  // 스토어 노드가 변경되면 로컬 상태에 반영
  useEffect(() => {
    if (displayNodes.length > 0) {
      setNodes(displayNodes);
    }
  }, [displayNodes, setNodes]);

  useEffect(() => {
    if (storeEdges.length > 0) {
      setEdges(storeEdges);
    }
  }, [storeEdges, setEdges]);

  // 사이드바에서 노드 선택 시 해당 노드로 포커스 이동
  useEffect(() => {
    if (selectedNodeId) {
      fitView({
        nodes: [{ id: selectedNodeId }],
        duration: 300,
        padding: 0.3,
      });
    }
  }, [selectedNodeId, fitView]);

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
      fitView({
        nodes: [{ id: node.id }],
        duration: 300,
      });
      onNodeClick?.(node.id);
    },
    [onNodeClick, fitView]
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
        minZoom={0.1}
        maxZoom={2}
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
