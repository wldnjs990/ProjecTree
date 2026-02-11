import { useState, useEffect, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useParams } from 'react-router';
import {
  getWorkspaceTree,
  getNodeDetail,
  getWorkspaceDetail,
} from '@/apis/workspace.api';
import {
  Header,
  type ViewTab,
  type OnlineUser,
  MemberManagementModal,
} from '@/features/workspace-header';
import { TreeCanvas } from '@/features/workspace-canvas';
import { FeatureSpecView } from '@/features/workspace-feature-spec';
import { PortfolioContainer } from '@/features/workspace-portfolio';
import { LeftSidebar } from '@/features/workspace-aside';
import {
  VoiceChatBar,
  MicPermissionAlert,
} from '@/features/workspace-voicechat';
import { WorkspaceSettingsDialog } from '@/features/workspace-settings';
import {
  type FlowNode,
  type ApiNode,
  type NodeData,
  initCrdtClient,
  destroyCrdtClient,
  useConnectionStatus,
  useNodeStore,
  useWorkspaceStore,
  useWorkspaceDetail,
  generateEdges,
  useNodeDetailCrdtObservers,
} from '@/features/workspace-core';
import { useUserStore } from '@/shared/stores/userStore';
import { getAvatarColor } from '@/shared/lib/utils';
import { useNodeDetailEdit } from '@/features/workspace-node-detail';
import { useMemo } from 'react';

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
  const user = useUserStore((state) => state.user);
  const { workspaceId: paramWorkspaceId } = useParams<{
    workspaceId: string;
  }>();
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
  const workspaceDetail = useWorkspaceDetail();

  // 멤버 목록 가공 (API 데이터 -> UI 데이터)
  const members = useMemo<OnlineUser[]>(() => {
    return workspaceDetail?.teamInfo?.memberInfos?.map((member) => ({
      id: String(member.memberId || member.id),
      name: member.name || 'Unknown',
      nickname: member.nickname || member.name || 'Unknown',
      initials: (
        member.nickname?.[0] ||
        member.name?.[0] ||
        'U'
      ).toUpperCase(),
      color: getAvatarColor(member.memberId || member.id || member.email || '0'),
      isOnline: member.email === user?.email, // 나 자신만 온라인
      role: member.role,
      isMe: member.email === user?.email,
    })) || [];
  }, [workspaceDetail, user]);

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
        setNodeListData(nodeListDataMap);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    // ...

    loadWorkspaceData();

    return () => {
      destroyCrdtClient();
    };
  }, [setNodeListData, workspaceId, setWorkspaceDetail]);

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // 음성 채팅 상태
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false); // 연결 활성화 상태
  const [isVoiceChatBarVisible, setIsVoiceChatBarVisible] = useState(false); // UI 표시 상태
  const [micPermissionDenied, setMicPermissionDenied] = useState(false); // 마이크 권한 거부 상태
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Event handlers
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleVoiceCallClick = useCallback(async () => {
    if (!isVoiceChatActive) {
      // 마이크 권한을 먼저 확인 — 권한 없으면 VoiceChatBar를 마운트하지 않음
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setMicPermissionDenied(true);
        return;
      }
      // 권한 확인 후 연결 시작 + UI 표시
      setIsVoiceChatActive(true);
      setIsVoiceChatBarVisible(true);
    } else {
      // 이미 연결된 상태: UI만 토글 (연결 유지)
      setIsVoiceChatBarVisible((prev) => !prev);
    }
  }, [isVoiceChatActive]);

  // 음성 채팅 완전 종료 (나가기 버튼)
  const handleVoiceChatClose = () => {
    setIsVoiceChatActive(false);
    setIsVoiceChatBarVisible(false);
  };

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  // 노드 클릭 시 상세정보 API 호출
  const handleNodeClick = async (nodeId: string) => {

    if (!selectedNodeId || selectedNodeId !== nodeId) {
      // 노드 상세정보 API 호출 후 사이드바 열기
      try {
        const nodeDetail = await getNodeDetail(Number(nodeId));
        updateNodeDetail(Number(nodeId), nodeDetail);
        // API 호출 완료 후 사이드바 열기 (nodeDetail이 store에 저장된 상태)
        openSidebar(nodeId);
      } catch (error) {
      }
    } else {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <Header
        workspaceId={Number(workspaceId)}
        projectName={workspaceDetail?.name || '워크스페이스'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onlineUsers={members}
        onSettingsClick={handleSettingsClick}
        onVoiceCallClick={handleVoiceCallClick}
        onInviteClick={handleInviteClick}
        isVoiceChatActive={isVoiceChatActive}
        isVoiceChatBarVisible={isVoiceChatBarVisible}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar (Resizable) */}
        <LeftSidebar
          workspaceId={workspaceId}
          workspaceName="AI 여행 추천 서비스"
          className="h-full flex-none z-50"
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
                onlineUsers={members}
                onNodeClick={handleNodeClick}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                CRDT 서버 연결 중...
              </div>
            ))}

          {activeTab === 'feature-spec' && (
            <FeatureSpecView />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioContainer workspaceId={Number(workspaceId)} />
          )}
        </main>
      </div>

      {/* 마이크 권한 거부 알림 (VoiceChatBar 마운트 전 단계) */}
      <MicPermissionAlert
        isOpen={micPermissionDenied}
        onClose={() => setMicPermissionDenied(false)}
      />

      {/* 음성 채팅 바 */}
      <VoiceChatBar
        isActive={isVoiceChatActive}
        isVisible={isVoiceChatBarVisible}
        onClose={handleVoiceChatClose}
        workspaceId={workspaceId || 'default'}
        members={members}
      />

      <WorkspaceSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        workspaceId={Number(workspaceId)}
        workspaceDetail={workspaceDetail}
        onUpdated={(updates) => {
          if (!workspaceDetail) return;
          setWorkspaceDetail({ ...workspaceDetail, ...updates });
        }}
      />

      <MemberManagementModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onlineUsers={members}
        workspaceId={Number(workspaceId)}
      />
    </div>
  );
}
