import { useState, useEffect, useMemo, useCallback } from 'react';
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
import {
  initCrdtClient,
  destroyCrdtClient,
  getCrdtClient,
} from './crdt/crdtClient';
import {
  useConnectionStatus,
  useNodeStore,
  useNodeDetail,
  useNodeListItem,
} from './stores/nodeStore';
import {
  useNodeDetailCrdt,
  type EditableNodeDetail,
} from './hooks/useNodeDetailCrdt';

// 임시 Room ID (나중에 워크스페이스 ID로 대체)
const ROOM_ID = 'workspace-1';

export default function WorkSpacePage() {
  // CRDT 연결 상태
  const connectionStatus = useConnectionStatus();

  // Zustand store 액션
  const setNodeDetails = useNodeStore((state) => state.setNodeDetails);
  const setNodeListData = useNodeStore((state) => state.setNodeListData);

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

    return () => {
      destroyCrdtClient();
    };
  }, [setNodeDetails, setNodeListData]);

  // Header state
  const [activeTab, setActiveTab] = useState<ViewTab>('tree-editor');

  // Sidebar filter state
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Node detail sidebar state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isNodeDetailOpen, setIsNodeDetailOpen] = useState(false);

  // Store에서 선택된 노드의 상세 데이터 가져오기
  const numericNodeId = selectedNodeId ? Number(selectedNodeId) : null;
  const selectedNodeDetail = useNodeDetail(numericNodeId);
  const selectedNodeListData = useNodeListItem(numericNodeId);

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

  // CRDT 편집을 위한 초기 데이터
  const initialEditData = useMemo((): EditableNodeDetail | null => {
    if (!selectedNodeListData || !selectedNodeDetail) return null;
    return {
      status: selectedNodeListData.status,
      priority: selectedNodeListData.priority,
      difficult: selectedNodeListData.difficult,
      assignee: selectedNodeDetail.assignee,
      note: selectedNodeDetail.note,
    };
  }, [selectedNodeListData, selectedNodeDetail]);

  // 서버 저장 핸들러 - CRDT 서버를 통해 DB에 저장
  const handleSaveNodeDetailToServer = useCallback(
    async (nodeId: string, data: EditableNodeDetail) => {
      console.log('[WorkSpacePage] CRDT 서버로 저장 요청:', nodeId, data);

      const client = getCrdtClient();
      if (client) {
        const requestId = client.saveNodeDetail();
        if (requestId) {
          console.log('[WorkSpacePage] 저장 요청 성공, requestId:', requestId);
        }
      } else {
        console.warn('[WorkSpacePage] CRDT 클라이언트가 초기화되지 않음');
      }
    },
    []
  );

  // CRDT 훅 사용
  const {
    isEditing: isNodeDetailEdit,
    editData,
    startEdit,
    updateField,
    finishEdit,
    cancelEdit,
  } = useNodeDetailCrdt({
    nodeId: selectedNodeId,
    initialData: initialEditData,
    onSave: handleSaveNodeDetailToServer,
  });

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
    // 기존 편집 중이면 취소
    if (isNodeDetailEdit) {
      cancelEdit();
    }
    setSelectedNodeId(nodeId);
    setIsNodeDetailOpen(true);
  };

  const handleNodeDetailClose = () => {
    // 편집 중이면 취소
    if (isNodeDetailEdit) {
      cancelEdit();
    }
    setIsNodeDetailOpen(false);
  };

  // 편집 토글 핸들러
  const handleToggleEdit = async () => {
    if (!isNodeDetailEdit) {
      // 편집 시작
      startEdit();
    } else {
      // 편집 완료 (저장)
      try {
        await finishEdit();
      } catch (error) {
        console.error('저장 실패:', error);
      }
    }
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

        {/* Node Detail Sidebar */}
        <NodeDetailSidebar
          nodeDetail={selectedNodeDetail}
          nodeListData={selectedNodeListData}
          nodeInfo={selectedNodeInfo}
          isOpen={isNodeDetailOpen}
          isEdit={isNodeDetailEdit}
          editData={editData}
          onClose={handleNodeDetailClose}
          toggleEdit={handleToggleEdit}
          onStatusChange={(value) => updateField('status', value)}
          onPriorityChange={(value) => updateField('priority', value)}
          onDifficultyChange={(value) => updateField('difficult', value)}
          onAssigneeChange={(value) => updateField('assignee', value)}
          onNoteChange={(value) => updateField('note', value)}
          onTechCompare={handleTechCompare}
          onTechAddManual={handleTechAddManual}
          onNodeAdd={handleNodeAdd}
          onNodeAddManual={handleNodeAddManual}
        />
      </div>
    </div>
  );
}
