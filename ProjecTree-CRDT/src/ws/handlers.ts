import { WebSocket } from "ws";
import { getRoomDoc } from "../yjs/yjsManager";
import { saveNodeDetailToSpring } from "../services/springSync";
import type { EditableNodeDetail } from "../domain/node/node.detail";
import { toSendNodeDetail } from "../domain/node/node.detail";

export async function handleMessage(
  ws: WebSocket,
  data: Buffer,
  room: string,
  clients: Set<WebSocket>
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
  }

  clients.forEach((c) => {
    if (c !== ws && c.readyState === WebSocket.OPEN) {
      c.send(data);
    }
  });
}