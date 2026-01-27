import { pendingPositions } from "./pending-store";
import { sendBatchToSpring } from "../services/spring/node/node-position.writer";

const flushTimers = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_MS = 2000;

// 2초간 변경이 없으면 flush
export function scheduleFlush(workspaceId: string) {
  const prev = flushTimers.get(workspaceId);
  if (prev) clearTimeout(prev);

  const timer = setTimeout(() => {
    flushWorkspace(workspaceId).catch(console.error);
  }, DEBOUNCE_MS);

  flushTimers.set(workspaceId, timer);
}

async function flushWorkspace(workspaceId: string) {
  const wsMap = pendingPositions.get(workspaceId);
  if (!wsMap || wsMap.size === 0) return;

  const nodes = Array.from(wsMap.values()).map(({ nodeId, position }) => ({
    nodeId,
    position,
  }));

  try {
    await sendBatchToSpring({
      workspaceId,
      nodes,
    });

    // 성공 시에만 clear
    pendingPositions.delete(workspaceId);
  } catch (error) {
    // 다음 debounce / room empty / SIGTERM 때 재시도
    console.warn("[flushWorkspace] 실패 → pending 유지", { workspaceId });
  }
}
