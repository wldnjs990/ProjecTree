import { useEffect, useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { getCrdtClient, type AwarenessState } from '../crdt/crdtClient';

/**
 * 커서 동기화 훅
 * - Awareness를 통해 다른 사용자 커서 위치 동기화
 * - CursorPointers 컴포넌트에서만 사용하여 리렌더링 최소화
 */
export const useCursors = () => {
  const { screenToFlowPosition } = useReactFlow();
  const [cursors, setCursors] = useState<Map<number, AwarenessState>>(
    new Map()
  );

  // Awareness 구독
  useEffect(() => {
    const client = getCrdtClient();
    if (!client) {
      console.warn('[useCursors] CRDT 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    const awareness = client.awareness;

    const handleChange = () => {
      const states = new Map(awareness.getStates());
      states.delete(awareness.clientID);
      setCursors(states as Map<number, AwarenessState>);
    };

    awareness.on('change', handleChange);

    // 초기 상태 로드
    handleChange();

    return () => {
      awareness.off('change', handleChange);
    };
  }, []);

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const client = getCrdtClient();
      if (!client) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      client.awareness.setLocalStateField('cursor', {
        x: position.x,
        y: position.y,
      });
    },
    [screenToFlowPosition]
  );

  // 사용자 정보 설정
  const setUserInfo = useCallback((name: string, color: string) => {
    const client = getCrdtClient();
    if (!client) return;

    client.awareness.setLocalStateField('user', { name, color });
  }, []);

  return {
    cursors,
    handleMouseMove,
    setUserInfo,
  };
};

export default useCursors;
