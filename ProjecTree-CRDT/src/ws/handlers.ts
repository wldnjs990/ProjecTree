import { WebSocket } from "ws";
import { getYDocByRoom } from "../yjs/ydoc-gateway";
import { saveNodeDetailToSpring } from "../services/spring/node/node-detail.writer";
import type { EditableNodeDetail } from "../domain/node/node.detail";
import { toSendNodeDetail } from "../domain/node/node.detail";
import { addPendingPosition } from "../sync/pending-store";
import { scheduleFlush } from "../sync/debounce";

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

  if (parsed?.type === "save_node_detail") {
    const doc = getYDocByRoom(room);
    const nodeDetails = doc.getMap<EditableNodeDetail>("nodeDetails");
    const nodeData = nodeDetails.get(parsed.nodeId);

    if (!nodeData) return;

    const sendPayload = toSendNodeDetail(nodeData.toJSON());

    await saveNodeDetailToSpring({
      workspaceId: room,
      nodeId: parsed.nodeId,
      detail: sendPayload,
    });
  } else if (parsed?.type === "save_node_position") {
    const { nodeId, requestId } = parsed;
    if (!nodeId) return;

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
