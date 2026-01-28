import { WebSocket } from "ws";
import { getYDocByRoom } from "../yjs/ydoc-gateway";
import { saveNodeDetailToSpring } from "../services/spring/node/node-detail.writer";
import type { EditableNodeDetail } from "../domain/node/node.detail";
import { toSendNodeDetail } from "../domain/node/node.detail";
import { addPendingPosition } from "../sync/pending-store";
import { flushWorkspace, scheduleFlush } from "../sync/debounce";
import { getRoom } from "./room-registry";

export async function handleMessage(
  ws: WebSocket,
  data: Buffer,
  room: string,
  clients: Set<WebSocket>,
) {
  let parsed: any;

  try {
    parsed = JSON.parse(data.toString());
  } catch {
    return; // Yjs binary → y-websocket 처리
  }
  // 노드 상세정보 저장 요청 처리
  if (parsed?.type === "save_node_detail") {
    const doc = getYDocByRoom(room);
    const nodeDetails = doc.getMap<EditableNodeDetail>("nodeDetails");
    const nodeData = nodeDetails.get(parsed.nodeId);
    if (!nodeData) return;

    const sendPayload = toSendNodeDetail(nodeData.toJSON());
    const workspaceId: number = Number(room);
    await saveNodeDetailToSpring({
      workspaceId,
      nodeId: Number(parsed.nodeId),
      detail: sendPayload,
    });
  }
  // 노드 위치 저장 요청 처리
  else if (parsed?.type === "save_node_position") {
    const { nodeId, requestId } = parsed;
    if (!nodeId) return;
    console.log("Saving node position:", { room, nodeId, requestId });
    const doc = getYDocByRoom(room);
    const nodes = doc.getMap<any>("nodes");
    const nodeData = nodes.get(nodeId);
    if (!nodeData) return;

    const position = nodeData.get("position");

    if (typeof position.x !== "number" || typeof position.y !== "number")
      return;
    addPendingPosition(room, {
      nodeId,
      position,
      requestId,
    });

    scheduleFlush(room);
  }

  clients.forEach((c) => {
    if (c !== ws && c.readyState === WebSocket.OPEN) {
      c.send(data);
    }
  });
}

export function onClientDisconnected(workspaceId: string) {
  const room = getRoom(workspaceId);
  if (!room || room.size > 0) return;
  // 남은 위치 변경 즉시 저장
  flushWorkspace(workspaceId).catch((err) =>
    console.error("flush on room empty failed", err),
  );
}
