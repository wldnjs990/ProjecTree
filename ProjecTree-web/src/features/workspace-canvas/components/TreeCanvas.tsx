import { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { MinimapPanel } from './MinimapPanel';
import { ZoomControls } from './ZoomControls';
import { useTreeCanvasDerivedState } from '../hooks/useTreeCanvasDerivedState';
import { useTreeCanvasHandlers } from '../hooks/useTreeCanvasHandlers';
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
  useCandidatePreviewMode,
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

function TreeCanvasInner({ initialNodes = [], onNodeClick }: TreeCanvasProps) {
  const { fitView } = useReactFlow();

  // 노드 CRDT 훅 (Y.js 노드 동기화)
  const { handleNodeDragStop: handleCrdtNodeDragStop } = useNodesCrdt({
    initialNodes,
  });

  // 커서 CRDT 훅 (Awareness 커서 동기화)
  const { cursors, handleMouseMove, setUserInfo } = useCursors();

  // 유저 닉네임 가져오기(awareness 등록용)
  const nickname = useUser()?.nickname || '익명';

  useEffect(() => {
    setUserInfo(nickname, '#F24822');
  }, [nickname, setUserInfo]);

  // Undo/Redo 키보드 이벤트 훅 (Ctrl+Z, Ctrl+Shift+Z)
  useUndoRedo();

  // Preview 노드 CRDT 동기화 훅
  usePreviewNodesCrdt();

  // Zustand 스토어에서 노드/엣지 가져오기
  const storeNodes = useNodes();
  const storeEdges = useEdges();
  const selectedNodeId = useSelectedNodeId();
  const previewNodes = usePreviewNodes();
  const candidatePreviewMode = useCandidatePreviewMode();
  const currentUser = useUser();
  const currentUserId = String(currentUser?.memberId ?? currentUser?.id ?? '');

  // ReactFlow 로컬 상태 (드래그 중 즉시 반영용)
  const [nodes, setNodes] = useNodesState<FlowNode>(storeNodes);
  const [edges, setEdges] = useEdgesState(storeEdges);

  const { lockedPreviewIds } = useTreeCanvasDerivedState({
    storeNodes,
    storeEdges,
    previewNodes,
    currentUserId,
    setNodes,
    setEdges,
  });

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

  const {
    handleNodesChange,
    handleNodeClick,
    handleNodeDragStop,
    handleEdgesChange,
    handleConnect,
    handlePaneClick,
  } = useTreeCanvasHandlers({
    candidatePreviewMode,
    currentUserId,
    fitView,
    lockedPreviewIds,
    onNodeClick,
    setNodes,
    setEdges,
    handleCrdtNodeDragStop,
  });

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
        onPaneClick={handlePaneClick}
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
