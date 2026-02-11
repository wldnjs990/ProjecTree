import { useEffect, useState, useCallback } from 'react';
import { getCrdtClient, type AwarenessState } from '../crdt/crdtClient';
import { useConnectionStatus } from '../stores';

export interface NodePresenceUser {
  id: number;
  name: string;
  initials: string;
  color: string;
}

const getInitials = (name?: string) => {
  const trimmed = name?.trim();
  if (!trimmed) return '?';
  return trimmed[0]?.toUpperCase() ?? '?';
};

export const useNodePresence = () => {
  const connectionStatus = useConnectionStatus();
  const [presenceMap, setPresenceMap] = useState<
    Map<string, NodePresenceUser[]>
  >(new Map());

  useEffect(() => {
    const client = getCrdtClient();
    if (!client) {
      return;
    }

    const awareness = client.awareness;

    const handleChange = () => {
      const states = new Map(awareness.getStates());
      states.delete(awareness.clientID);

      const next = new Map<string, NodePresenceUser[]>();
      states.forEach((state, clientId) => {
        const typed = state as AwarenessState;
        const activeNodeId = typed.activeNodeId;
        const user = typed.user;
        if (!activeNodeId || !user) return;

        const list = next.get(activeNodeId) ?? [];
        list.push({
          id: clientId,
          name: user.name ?? 'User',
          initials: getInitials(user.name),
          color: user.color ?? '#1C69E3',
        });
        next.set(activeNodeId, list);
      });

      setPresenceMap(next);
    };

    awareness.on('change', handleChange);
    handleChange();

    return () => {
      awareness.off('change', handleChange);
    };
  }, [connectionStatus]);

  const getUsersForNode = useCallback(
    (nodeId: string) => presenceMap.get(nodeId) ?? [],
    [presenceMap]
  );

  return { getUsersForNode };
};

export default useNodePresence;
