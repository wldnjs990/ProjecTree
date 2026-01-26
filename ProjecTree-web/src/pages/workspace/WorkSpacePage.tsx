import { useState, useEffect, useMemo } from 'react';
import { Header, type ViewTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TreeCanvas } from './components/Canvas';
import { NodeDetailSidebar } from './components/NodeDetailSidebar';
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
import {
  useNodeDetailEditStore,
  useSelectedNodeId,
} from './stores/nodeDetailEditStore';

// 임시 Room ID (나중에 워크스페이스 ID로 대체)
const ROOM_ID = 'workspace-1';

export default function WorkSpacePage() {
  // CRDT 연결 상태
  const connectionStatus = useConnectionStatus();

  // Zustand store 액션
  const setNodeDetails = useNodeStore((state) => state.setNodeDetails);
  const setNodeListData = useNodeStore((state) => state.setNodeListData);

  // NodeDetailEditStore 액션
  const openSidebar = useNodeDetailEditStore((state) => state.openSidebar);
  const initCrdtObservers = useNodeDetailEditStore(
    (state) => state.initCrdtObservers
  );
  const cleanupCrdtObservers = useNodeDetailEditStore(
    (state) => state.cleanupCrdtObservers
  );

  // 선택된 노드 ID
  const selectedNodeId = useSelectedNodeId();

  // CRDT 클라이언트 초기화 및 초기 데이터 로드
  useEffect(() => {
    initCrdtClient(ROOM_ID);

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

    // CRDT 옵저버 초기화 (연결 후)
    const timer = setTimeout(() => {
      initCrdtObservers();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupCrdtObservers();
      destroyCrdtClient();
    };
  }, [
    setNodeDetails,
    setNodeListData,
    initCrdtObservers,
    cleanupCrdtObservers,
  ]);

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // Sidebar filter state
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // 선택된 노드의 기본 정보 (헤더용)
  const selectedNodeInfo = useMemo(() => {
    if (!selectedNodeId) return undefined;
    const numericId = Number(selectedNodeId);
    const apiNode = mockNodesApiResponse.data.find((n) => n.id === numericId);
    if (!apiNode) return undefined;
    return {
      name: apiNode.name,
      nodeType: apiNode.nodeType,
      identifier: apiNode.data.identifier,
      taskType: apiNode.data.taskType,
    };
  }, [selectedNodeId]);

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
    openSidebar(nodeId);
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

        {/* Node Detail Sidebar - props 대폭 감소 */}
        <NodeDetailSidebar nodeInfo={selectedNodeInfo} />
      </div>
    </div>
  );
}
