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

    nodeDetailCrdtService.initObservers();

    // 새로고침/재연결 시 이전 세션에서 남은 preview 노드 정리
    // pending 중인 preview 노드는 보존 (nodeCreatingPendingHandler가 완료 시 자동 정리)
    if (currentUserId) {
      nodeDetailCrdtService.clearNonPendingPreviewNodes(currentUserId);
    }

    return () => {
      nodeDetailCrdtService.cleanupObservers();
    };
  }, [connectionStatus, currentUserId]);
}
