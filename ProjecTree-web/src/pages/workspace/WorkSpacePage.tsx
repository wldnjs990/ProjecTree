import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ChatPanel } from '@/features/chat/components/ChatPanel';
import { Header, type ViewTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TreeCanvas } from './components/Canvas';
import {
  NodeDetailSidebar,
  type NodeDetailData,
} from './components/NodeDetailSidebar';
import {
  mockNodes,
  mockEdges,
  mockUsers,
  mockNodeDetails,
} from './constants/mockData';
import { FeatureSpecView } from './components/FeatureSpec';
import { TechStackStatusView } from './components/TechStackStatus';

export default function WorkSpacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // Sidebar filter state
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Node detail sidebar state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isNodeDetailOpen, setIsNodeDetailOpen] = useState(false);

  // Chat state
  const [showChat, setShowChat] = useState(false);

  // Get selected node detail data
  const selectedNodeDetail: NodeDetailData | null = selectedNodeId
    ? mockNodeDetails[selectedNodeId] || null
    : null;

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
    setShowChat((prev) => !prev);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsNodeDetailOpen(true);
  };

  const handleNodeDetailClose = () => {
    setIsNodeDetailOpen(false);
  };

  const handleTechCompare = () => {
    console.log('Tech compare clicked');
  };

  const handleTechAddManual = () => {
    console.log('Tech add manual clicked');
  };

  const handleNodeAdd = () => {
    console.log('Node add clicked');
  };

  const handleNodeAddManual = () => {
    console.log('Node add manual clicked');
  };

  const handleMemoChange = (memo: string) => {
    console.log('Memo changed:', memo);
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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          nodeTypeFilter={nodeTypeFilter}
          statusFilter={statusFilter}
          onNodeTypeChange={setNodeTypeFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Canvas */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'tree-editor' && (
            <TreeCanvas
              initialNodes={mockNodes}
              initialEdges={mockEdges}
              onlineUsers={mockUsers}
              unreadMessages={2}
              onChatClick={handleChatClick}
              onNodeClick={handleNodeClick}
            />
          )}

          {activeTab === 'feature-spec' && (
            <FeatureSpecView
              nodes={mockNodes}
              edges={mockEdges}
              onNodeClick={handleNodeClick}
            />
          )}

          {activeTab === 'tech-selection' && (
            <TechStackStatusView
              nodes={mockNodes}
              edges={mockEdges}
              onNodeClick={handleNodeClick}
            />
          )}
        </main>

        {/* Node Detail Sidebar */}
        <NodeDetailSidebar
          node={selectedNodeDetail}
          isOpen={isNodeDetailOpen}
          onClose={handleNodeDetailClose}
          onTechCompare={handleTechCompare}
          onTechAddManual={handleTechAddManual}
          onNodeAdd={handleNodeAdd}
          onNodeAddManual={handleNodeAddManual}
          onMemoChange={handleMemoChange}
        />
        {/* Chat Panel */}
        {showChat && (
          <div className="w-[400px] border-l border-gray-200 bg-white shadow-xl z-20">
            <ChatPanel
              workspaceId={workspaceId!}
              workspaceName="AI 여행 추천 서비스" // TODO: 실제 워크스페이스 이름 사용
            />
          </div>
        )}


      </div>
    </div>
  );
}
