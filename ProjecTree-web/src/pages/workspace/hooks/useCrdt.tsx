import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 임시 room number
const ROOM_NUMBER = 'room-1';

const useCrdt = () => {
  // websocket 클라이언트 생성
  const yDocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const [nodeState, setNodeState] = useState();

  // 다른 사용자들의 커서 상태
  const [cursors, setCursors] = useState<Map<number, any>>(new Map());

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

  return { providerRef, yDocRef, cursors };
};

export default useCrdt;
