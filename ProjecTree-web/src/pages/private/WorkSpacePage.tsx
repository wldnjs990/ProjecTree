import { useState, useEffect } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useParams, useNavigate } from 'react-router';
import {
  getWorkspaceTree,
  getNodeDetail,
  getWorkspaceDetail,
} from '@/apis/workspace.api';
import { Header, type ViewTab } from '@/features/workspace-header';
import { TreeCanvas } from '@/features/workspace-canvas';
import { FeatureSpecView } from '@/features/workspace-feature-spec';
import { TechStackStatusView } from '@/features/workspace-tech-status';
import { LeftSidebar } from '@/features/workspace-aside';
import { VoiceChatBar } from '@/features/workspace-voicechat';
import {
  type FlowNode,
  type ApiNode,
  type NodeData,
  initCrdtClient,
  destroyCrdtClient,
  useConnectionStatus,
  useNodeStore,
  useWorkspaceStore,
  generateEdges,
  mockUsers,
  useNodeDetailCrdtObservers,
} from '@/features/workspace-core';
import { useNodeDetailEdit } from '@/features/workspace-node-detail';

// 임시 워크스페이스 ID (백엔드 DB 더미 데이터용)
const TEMP_WORKSPACE_ID = 8;

// API 응답을 ReactFlow 노드로 변환
const transformApiNodesToFlowNodes = (apiNodes: ApiNode[]): FlowNode[] => {
  return apiNodes.map((node, index) => ({
    id: String(node.id),
    type: node.nodeType || 'TASK',
    // position이 null인 경우 기본값 사용 (노드별로 다른 위치에 배치)
    position: {
      x: node.position?.xpos ?? index * 200,
      y: node.position?.ypos ?? index * 100,
    },
    parentId: node.parentId ? String(node.parentId) : undefined,
    data: {
      title: node.name,
      status: node.data.status,
      priority: node.data.priority,
      taskId: `#${node.data.identifier}`,
      taskType: node.data.taskType ? node.data.taskType : undefined,
      difficult: node.data.difficult,
    },
  })) as FlowNode[];
};

export default function WorkSpacePage() {
  const { workspaceId: paramWorkspaceId } = useParams<{
    workspaceId: string;
  }>();
  const navigate = useNavigate();
  // workspaceId가 없으면 임시 ID 사용
  const workspaceId = paramWorkspaceId || String(TEMP_WORKSPACE_ID);

  // CRDT 연결 상태
  const connectionStatus = useConnectionStatus();

  // Zustand store 액션
  const setNodeListData = useNodeStore((state) => state.setNodeListData);
  const updateNodeDetail = useNodeStore((state) => state.updateNodeDetail);
  const setWorkspaceDetail = useWorkspaceStore(
    (state) => state.setWorkspaceDetail
  );

  // 노드 상세 편집 Hook
  const { openSidebar, closeSidebar, selectedNodeId } = useNodeDetailEdit();

  // CRDT 옵저버 생명주기 관리
  useNodeDetailCrdtObservers();

  // 로컬 상태: 노드와 엣지
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // CRDT 클라이언트 초기화 및 워크스페이스 데이터 로드
  useEffect(() => {
    const loadWorkspaceData = async () => {
      try {
        setIsLoading(true);

        // workspaceId params를 받아 crdt 인스턴스 생성
        if (workspaceId) initCrdtClient(workspaceId);

        // 워크스페이스 상세 정보 조회 및 스토어 저장
        const workspaceDetail = await getWorkspaceDetail(Number(workspaceId));
        setWorkspaceDetail(workspaceDetail);
        console.log('[WorkSpacePage] workspaceDetail 저장:', workspaceDetail);

        // 워크스페이스 트리 데이터 API 호출
        const apiNodes = await getWorkspaceTree(Number(workspaceId));

        // API 응답을 ReactFlow 노드로 변환
        const flowNodes = transformApiNodesToFlowNodes(apiNodes);
        setNodes(flowNodes);

        // 엣지 생성
        const generatedEdges = generateEdges(flowNodes);
        setEdges(generatedEdges);

        // 노드 목록 데이터를 store에 로드 (id -> NodeData 매핑)
        const nodeListDataMap: Record<number, NodeData> = {};
        apiNodes.forEach((node) => {
          nodeListDataMap[node.id] = node.data;
        });
        console.log('[WorkSpacePage] nodeListData 저장:', nodeListDataMap);
        setNodeListData(nodeListDataMap);
      } catch (error: any) {
        console.error('워크스페이스 데이터 로드 실패:', error);

        const errorCode = error.response?.data?.errorCode;

        if (errorCode === 'WORKSPACE_NOT_FOUND') {
          alert('워크스페이스에 접근할 수 없습니다');
          navigate('/workspaces');
          return;
        }

        if (error.response?.status === 403 || error.response?.status === 404) {
          // 권한 없음 또는 워크스페이스 없음
          alert('접근 권한이 없습니다');
          navigate('/workspaces'); // 목록으로 이동
        }
      } finally {
        setIsLoading(false);
      }
    };
    // ...

    loadWorkspaceData();

    return () => {
      destroyCrdtClient();
    };
  }, [setNodeListData, workspaceId]);

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // 음성 채팅 상태
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false); // 연결 활성화 상태
  const [isVoiceChatBarVisible, setIsVoiceChatBarVisible] = useState(false); // UI 표시 상태

  // Event handlers
  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleVoiceCallClick = () => {
    if (!isVoiceChatActive) {
      // 처음 연결: 연결 시작 + UI 표시
      setIsVoiceChatActive(true);
      setIsVoiceChatBarVisible(true);
    } else {
      // 이미 연결된 상태: UI만 토글 (연결 유지)
      setIsVoiceChatBarVisible((prev) => !prev);
    }
  };

  // 음성 채팅 완전 종료 (나가기 버튼)
  const handleVoiceChatClose = () => {
    setIsVoiceChatActive(false);
    setIsVoiceChatBarVisible(false);
  };

  const handleInviteClick = () => {
    console.log('Invite clicked');
  };

  // 노드 클릭 시 상세정보 API 호출
  const handleNodeClick = async (nodeId: string) => {
    console.log('[handleNodeClick] 노드 클릭:', nodeId);

    if (!selectedNodeId || selectedNodeId !== nodeId) {
      // 노드 상세정보 API 호출 후 사이드바 열기
      try {
        const nodeDetail = await getNodeDetail(Number(nodeId));
        console.log('[handleNodeClick] API 응답:', nodeDetail);
        updateNodeDetail(Number(nodeId), nodeDetail);
        // API 호출 완료 후 사이드바 열기 (nodeDetail이 store에 저장된 상태)
        openSidebar(nodeId);
      } catch (error) {
        console.error('노드 상세정보 로드 실패:', error);
      }
    } else {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <Header
        projectName="AI 여행 추천 서비스"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onlineUsers={mockUsers}
        onSettingsClick={handleSettingsClick}
        onVoiceCallClick={handleVoiceCallClick}
        onInviteClick={handleInviteClick}
        isVoiceChatActive={isVoiceChatActive}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar (Resizable) */}
        <LeftSidebar
          workspaceId={workspaceId}
          workspaceName="AI 여행 추천 서비스"
          className="h-full border-r border-[#EEEEEE] w-75 flex-none z-50"
          nodes={nodes as Node[]}
          edges={edges}
        />

        {/* Canvas */}
        <main className="flex-1 min-h-0 overflow-hidden">
          {activeTab === 'tree-editor' &&
            (isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                워크스페이스 데이터 로딩 중...
              </div>
            ) : connectionStatus === 'connected' ? (
              <TreeCanvas
                initialNodes={nodes}
                onlineUsers={mockUsers}
                onNodeClick={handleNodeClick}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                CRDT 서버 연결 중...
              </div>
            ))}

          {activeTab === 'feature-spec' && (
            <FeatureSpecView onNodeClick={handleNodeClick} />
          )}

          {activeTab === 'tech-selection' && (
            <TechStackStatusView onNodeClick={handleNodeClick} />
          )}
        </main>
      </div>

      {/* 음성 채팅 바 */}
      <VoiceChatBar
        isActive={isVoiceChatActive}
        isVisible={isVoiceChatBarVisible}
        onClose={handleVoiceChatClose}
        workspaceId={workspaceId || 'default'}
      />
    </div>
  );
}
