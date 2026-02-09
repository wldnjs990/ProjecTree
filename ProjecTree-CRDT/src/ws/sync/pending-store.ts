export type PendingPos = {
  nodeId: number;
  position: { x: number; y: number };
  requestId?: string;
};

export const pendingPositions = new Map<string, Map<number, PendingPos>>();

export function addPendingPosition(workspaceId: string, pos: PendingPos) {
  let wsMap = pendingPositions.get(workspaceId);
  if (!wsMap) {
    wsMap = new Map();
    pendingPositions.set(workspaceId, wsMap);
  }

  // 같은 nodeId는 항상 최신 값으로 덮어씀
  wsMap.set(pos.nodeId, pos);
}
