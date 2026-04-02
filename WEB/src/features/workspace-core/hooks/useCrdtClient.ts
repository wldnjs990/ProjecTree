import { useEffect } from 'react';
import CrdtClient from '../crdt/crdtClient';
import { useNodeStore } from '../stores/nodeStore';
import { useWorkspaceStore } from '../stores/workspaceStore';

export function useCrdtClient(roomId: string | undefined) {
  useEffect(() => {
    if (!roomId) return;

    CrdtClient.init(roomId, {
      onStatusChange: (status) =>
        useNodeStore.getState().setConnectionStatus(status),
      onSyncChange: (isSynced) =>
        useNodeStore.getState().setIsSynced(isSynced),
      onRoomJoined: (id) => useWorkspaceStore.getState().setRoomId(id),
      onDestroy: () => {
        useWorkspaceStore.getState().reset();
        useNodeStore.getState().reset();
      },
    });

    return () => {
      CrdtClient.destroy();
    };
  }, [roomId]);
}
