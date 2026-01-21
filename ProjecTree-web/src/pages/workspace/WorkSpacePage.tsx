import { useState, useEffect } from 'react';
import { Header, type ViewTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TreeCanvas } from './components/Canvas';
import {
  mockNodes,
  mockUsers,
  mockNodeDetails,
  mockNodesApiResponse,
} from './constants/mockData';
import { FeatureSpecView } from './components/FeatureSpec';
import { TechStackStatusView } from './components/TechStackStatus';
import type { FlowNode } from './types/node';
import { initCrdtClient, destroyCrdtClient } from './crdt/crdtClient';
import { useConnectionStatus, useNodeStore } from './stores/nodeStore';
import { useNodeDetailEdit, useNodeDetailCrdtObservers } from './hooks';
import { useParams } from 'react-router';

// 임시 Room ID (나중에 워크스페이스 ID로 대체)

export default function WorkSpacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  // CRDT 연결 상태
  const connectionStatus = useConnectionStatus();

  // Zustand store 액션
  const setNodeDetails = useNodeStore((state) => state.setNodeDetails);
  const setNodeListData = useNodeStore((state) => state.setNodeListData);

  // 노드 상세 편집 Hook
  const { openSidebar, closeSidebar, selectedNodeId } = useNodeDetailEdit();

  // CRDT 옵저버 생명주기 관리
  useNodeDetailCrdtObservers();

  // CRDT 클라이언트 초기화 및 초기 데이터 로드
  useEffect(() => {
    console.log(workspaceId);
    // workspaceId params를 받아 crdt 인스턴스 생성
    if (workspaceId) initCrdtClient(workspaceId);

    // 초기 목데이터를 store에 로드
    setNodeDetails(mockNodeDetails);

    // 노드 목록 데이터를 store에 로드 (id -> NodeData 매핑)
    const nodeListDataMap: Record<
      number,
      (typeof mockNodesApiResponse.data)[0]['data']
    > = {};
    mockNodesApiResponse.data.forEach((node) => {
      nodeListDataMap[node.id] = node.data;
    });
    setNodeListData(nodeListDataMap);

    return () => {
      destroyCrdtClient();
    };
  }, [setNodeDetails, setNodeListData, workspaceId]);

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // Sidebar filter state
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Event handlers
  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleVoiceCallClick = () => {
    console.log('Voice call clicked');
  };

  const handleInviteClick = () => {
    console.log('Invite clicked');
  };

  const handleChatClick = () => {
    console.log('Chat clicked');
  };

  const handleNodeClick = (nodeId: string) => {
    console.log(selectedNodeId);
    console.log(nodeId);
    if (!selectedNodeId || selectedNodeId !== nodeId) openSidebar(nodeId);
    else closeSidebar();
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
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          nodeTypeFilter={nodeTypeFilter}
          statusFilter={statusFilter}
          onNodeTypeChange={setNodeTypeFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Canvas */}
        <main className="flex-1 min-h-0 overflow-hidden">
          {activeTab === 'tree-editor' &&
            (connectionStatus === 'connected' ? (
              <TreeCanvas
                initialNodes={mockNodes as FlowNode[]}
                onlineUsers={mockUsers}
                unreadMessages={2}
                onChatClick={handleChatClick}
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
    </div>
  );
}
