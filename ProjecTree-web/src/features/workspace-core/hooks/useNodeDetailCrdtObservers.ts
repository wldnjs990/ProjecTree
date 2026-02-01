import { useEffect } from 'react';
import { nodeDetailCrdtService } from '../services/nodeDetailCrdtService';
import { useConnectionStatus } from '../stores/nodeStore';

/**
 * CRDT 옵저버 생명주기 관리 Hook
 * WorkSpacePage에서 한 번만 호출
 * CRDT 클라이언트가 연결된 후에만 옵저버 초기화
 */
export function useNodeDetailCrdtObservers() {
  const connectionStatus = useConnectionStatus();

  useEffect(() => {
    // CRDT 클라이언트가 연결된 후에만 옵저버 초기화
    if (connectionStatus !== 'connected') {
      return;
    }

    nodeDetailCrdtService.initObservers();

    return () => {
      nodeDetailCrdtService.cleanupObservers();
    };
  }, [connectionStatus]);
}
