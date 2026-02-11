import { useEffect } from 'react';
import { nodeDetailCrdtService } from '../services/nodeDetailCrdtService';
import { useConnectionStatus } from '../stores/nodeStore';
import { useUser } from '@/shared/stores/userStore';

/**
 * CRDT 옵저버 생명주기 관리 Hook
 * WorkSpacePage에서 한 번만 호출
 * CRDT 클라이언트가 연결된 후에만 옵저버 초기화
 */
export function useNodeDetailCrdtObservers() {
  const connectionStatus = useConnectionStatus();
  const currentUser = useUser();
  const currentUserId = String(currentUser?.memberId ?? currentUser?.id ?? '');

  useEffect(() => {
    // CRDT 클라이언트가 연결된 후에만 옵저버 초기화
    if (connectionStatus !== 'connected') {
      return;
    }

    // userId를 전달하여 sync 완료 후 loadExistingData에서
    // preview 노드 정리 + pending 상태 복원이 수행됨
    nodeDetailCrdtService.initObservers(currentUserId || undefined);

    return () => {
      nodeDetailCrdtService.cleanupObservers();
    };
  }, [connectionStatus, currentUserId]);
}
