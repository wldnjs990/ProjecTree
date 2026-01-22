import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { mockNodes } from '../constants/mockData';
import { useReactFlow, type Node, type NodeChange } from '@xyflow/react';

// 내가 사용할 awareness 상태들
// 유저 정보도 실시간으로 받을거니깐 미리 추가
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

// 임시 room number
const ROOM_NUMBER = 'room-1';

const useCrdt = () => {
  // useReactFlow 유틸 함수 screenToFlowPosition
  // react-flow의 줌, 이동 여부 등을 계산한 좌표를 제공해줌
  const { screenToFlowPosition } = useReactFlow();

  // websocket 클라이언트 생성
  const yDocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  // const [nodeState, setNodeState] = useState();

  // 다른 사용자들의 커서 상태
  const [cursors, setCursors] = useState<Map<number, AwarenessState>>(
    new Map()
  );

  useEffect(() => {
    // yjs 동시편집 관리 클라이언트
    const yDoc = new Y.Doc();
    const provider = new WebsocketProvider(
      import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234',
      ROOM_NUMBER,
      yDoc
    );

    // 훅 제공용 ref객체
    yDocRef.current = yDoc;
    providerRef.current = provider;

    // ydoc로 생성한 노드데이터 저장소
    const yNodes = yDocRef.current.getArray('nodes');
    // 노드 상세 페이지도 저장해야할듯

    // provider 이벤트 연결 상태
    provider.on('status', ({ status }) => {
      if (status === 'connected') console.log('연결 완료');
      else if (status === 'connecting') console.log('연결중입니다..');
      else if (status === 'disconnected') provider.destroy();
    });

    // 초기 동기화 상태
    provider.on('sync', (isSynced) => {
      if (isSynced) console.log('서버 연결 완료~~');
    });

    // Awareness 인스턴스(마우스 위치용)
    const awareness = provider.awareness;

    awareness.on('change', () => {
      // ydoc에 저장되어있는 모든 사용자 정보
      const states = new Map(awareness.getStates());
      // 본인 제외
      states.delete(awareness.clientID);
      // 커서 위치 동기화
      setCursors(states);
    });

    // 클린업
    return () => {
      provider.destroy();
      yDoc.destroy();
    };
  }, []);

  // 내 마우스 이동 여부
  const handleMouseMove = (e: React.MouseEvent) => {
    const awareness = providerRef.current?.awareness;
    if (!awareness) return;

    // 화면 좌표 → flow 캔버스 좌표로 변환 (줌/패닝 자동 반영)
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    awareness.setLocalStateField('cursor', {
      x: position.x,
      y: position.y,
    });
  };

  return { providerRef, yDocRef, cursors, handleMouseMove };
};

export default useCrdt;
