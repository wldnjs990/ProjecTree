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

    // change 이벤트리스너 활성화
    // 서버로부터 change 이벤트 수신시, 마우스 커서 변경사항 로컬에 적용
    awareness.on('change', handleChange);

    // 초기 상태 로드
    handleChange();

    return () => {
      // change 이벤트 비활성화
      awareness.off('change', handleChange);
    };
  }, []);

  /**
   * 마우스 이동 핸들러 - 실시간 유저 마우스 포인터 공유용 함수
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const client = getCrdtClient();
      if (!client) return;

      // screenToFlowPosition: reactflow에서 제공해주는 클라이언트 캔버스 좌표 계산 함수
      // 캔버스 좌표를 고려한 유저 마우스포인터 좌표 생성 가능
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      // ydoc awareness에 유저 커서 위치 업데이트
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
