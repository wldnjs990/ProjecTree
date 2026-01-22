import { useEffect, useRef, useCallback, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useReactFlow, type Node } from '@xyflow/react';
import { useNodeStore } from '../stores/nodeStore';
import type {
  FlowNode,
  FlowNodeData,
  FlowNodeType,
  YjsNode,
} from '../types/node';
import { flowNodeToYjsNode, yjsNodeToFlowNode } from '../utils/nodeTransform';

// Y.Map에 저장되는 노드 값 타입
type YNodeValue =
  | FlowNodeType
  | string
  | undefined
  | { x: number; y: number }
  | FlowNodeData;

// Awareness 상태 타입
interface AwarenessState {
  cursor?: {
    x: number;
    y: number;
  };
  user?: {
    name: string;
    color: string;
  };
}

interface UseCrdtOptions {
  roomId: string;
  initialNodes?: FlowNode[];
}

const useCrdt = ({ roomId, initialNodes = [] }: UseCrdtOptions) => {
  const { screenToFlowPosition } = useReactFlow();

  // Y.js 인스턴스 참조
  const yDocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const yNodesRef = useRef<Y.Map<Y.Map<YNodeValue>> | null>(null);

  // 다른 사용자들의 커서 상태
  const [cursors, setCursors] = useState<Map<number, AwarenessState>>(
    new Map()
  );

  // Zustand 스토어 액션
  const setNodes = useNodeStore((state) => state.setNodes);
  const updateNodePosition = useNodeStore((state) => state.updateNodePosition);
  const setConnectionStatus = useNodeStore(
    (state) => state.setConnectionStatus
  );
  const setIsSynced = useNodeStore((state) => state.setIsSynced);

  // Y.Map에서 노드 배열로 변환
  const syncFromYjs = useCallback(() => {
    if (!yNodesRef.current) return;

    const nodes: FlowNode[] = [];
    yNodesRef.current.forEach((yNode, nodeId) => {
      const rawParentId = yNode.get('parentId');
      const yjsNode: YjsNode = {
        id: nodeId,
        type: yNode.get('type') as YjsNode['type'],
        parentId:
          rawParentId === null
            ? undefined
            : (rawParentId as string | undefined),
        position: yNode.get('position') as { x: number; y: number },
        data: yNode.get('data') as YjsNode['data'],
      };
      nodes.push(yjsNodeToFlowNode(yjsNode));
    });

    setNodes(nodes);
  }, [setNodes]);

  // Y.js 초기화
  useEffect(() => {
    const yDoc = new Y.Doc();
    const serverUrl =
      import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234';
    const provider = new WebsocketProvider(serverUrl, roomId, yDoc);

    yDocRef.current = yDoc;
    providerRef.current = provider;

    // Y.Map으로 노드 관리
    const yNodes = yDoc.getMap('nodes') as Y.Map<Y.Map<YNodeValue>>;
    yNodesRef.current = yNodes;

    // 연결 상태 이벤트
    provider.on('status', ({ status }: { status: string }) => {
      if (status === 'connected') {
        setConnectionStatus('connected');
        console.log('[CRDT] 서버 연결됨');
      } else if (status === 'connecting') {
        setConnectionStatus('connecting');
        console.log('[CRDT] 연결 중...');
      } else if (status === 'disconnected') {
        setConnectionStatus('disconnected');
        console.log('[CRDT] 연결 해제됨');
      }
    });

    // 동기화 완료 이벤트
    provider.on('sync', (isSynced: boolean) => {
      setIsSynced(isSynced);
      if (isSynced) {
        console.log('[CRDT] 동기화 완료');

        // 서버에 데이터가 없으면 초기 노드로 세팅
        if (yNodes.size === 0 && initialNodes.length > 0) {
          yDoc.transact(() => {
            initialNodes.forEach((node) => {
              const yNode = new Y.Map<YNodeValue>();
              const yjsNode = flowNodeToYjsNode(node);
              yNode.set('type', yjsNode.type);
              yNode.set('parentId', yjsNode.parentId);
              yNode.set('position', yjsNode.position);
              yNode.set('data', yjsNode.data);
              yNodes.set(node.id, yNode);
            });
          });
        }

        // Y.js → Zustand 동기화
        syncFromYjs();
      }
    });

    // Y.Map 변경 감지 → Zustand 업데이트
    const observeHandler = () => {
      syncFromYjs();
    };
    yNodes.observeDeep(observeHandler);

    // Awareness (커서 동기화)
    const awareness = provider.awareness;
    awareness.on('change', () => {
      const states = new Map(awareness.getStates());
      states.delete(awareness.clientID);
      setCursors(states as Map<number, AwarenessState>);
    });

    // 클린업
    return () => {
      yNodes.unobserveDeep(observeHandler);
      provider.destroy();
      yDoc.destroy();
      yDocRef.current = null;
      providerRef.current = null;
      yNodesRef.current = null;
    };
  }, [roomId, initialNodes, setConnectionStatus, setIsSynced, syncFromYjs]);

  // 마우스 이동 핸들러 (Awareness)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const awareness = providerRef.current?.awareness;
      if (!awareness) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      awareness.setLocalStateField('cursor', {
        x: position.x,
        y: position.y,
      });
    },
    [screenToFlowPosition]
  );

  // 노드 드래그 완료 핸들러 → Y.js에 position 업데이트
  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const yNodes = yNodesRef.current;
      if (!yNodes) return;

      const yNode = yNodes.get(node.id);
      if (!yNode) return;

      // Y.Map에서 position 업데이트 → observe가 감지 → 브로드캐스트
      yNode.set('position', { x: node.position.x, y: node.position.y });

      // 로컬 스토어도 즉시 업데이트 (UX용)
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  // 노드 데이터 업데이트 (상세 페이지에서 사용)
  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<FlowNode['data']>) => {
      const yNodes = yNodesRef.current;
      if (!yNodes) return;

      const yNode = yNodes.get(nodeId);
      if (!yNode) return;

      const currentData = yNode.get('data') as FlowNode['data'];
      yNode.set('data', { ...currentData, ...data });
    },
    []
  );

  return {
    // Y.js 참조
    yDocRef,
    providerRef,
    yNodesRef,

    // 커서 상태
    cursors,

    // 핸들러
    handleMouseMove,
    handleNodeDragStop,
    updateNodeData,
  };
};

export default useCrdt;
