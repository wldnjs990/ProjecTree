import { WebSocket } from "ws";
import { getRoomDoc } from "../yjs/yjsManager";
import { saveNodeDetailToSpring } from "../services/springSync";
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
    const doc = getRoomDoc(room);
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

    const doc = getRoomDoc(room);
    const nodes = doc.getMap<any>("nodes");
    const nodeData = nodes.get(nodeId);

    if (!nodeData) return;

    const position = nodeData.get("position");
    const x = position.x;
    const y = position.y;

    // console.log("[handleMessage] 위치 저장 예약", { room, nodeId, x, y });
    if (typeof x !== "number" || typeof y !== "number") return;

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
