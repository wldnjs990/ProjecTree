import { WebSocket } from "ws";
import { getYDocByRoom } from "../yjs/ydoc-gateway";
import { saveNodeDetailToSpring } from "../services/spring/node/node-detail.writer";
import { saveNodeTechToSpring } from "../services/spring/node/node-tech.writer";
import type { EditableNodeDetail } from "../domain/node/node.detail";
import { toSendNodeDetail } from "../domain/node/node.detail";
import { addPendingPosition } from "./sync/pending-store";
import { flushWorkspace, scheduleFlush } from "./sync/debounce";
import { getRoom } from "./room-registry";
import { deleteNodeToSpring } from "../services/spring/node/node-delete.writer";

function sendError(
  ws: WebSocket,
  payload: {
    type: "save_error";
    action: "save_node_detail" | "select_node_tech" | "delete_node";
    message: string;
    requestId?: string;
    workspaceId?: number;
    nodeId?: number;
    selectedTechId?: number;
    prevDetail?: unknown;
  },
) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

export async function handleMessage(ws: WebSocket, data: Buffer, room: string) {
  let parsed: any;

  try {
    parsed = JSON.parse(data.toString());
  } catch {
    return; // Yjs binary → y-websocket 처리
  }
  // 노드 상세정보 저장 요청 처리
  if (parsed?.type === "save_node_detail") {
    const { requestId, prevDetail } = parsed;
    const doc = getYDocByRoom(room);
    const nodeDetails = doc.getMap<EditableNodeDetail>("nodeDetails");
    const nodeData = nodeDetails.get(parsed.nodeId);
    if (!nodeData) return;

    const sendPayload = toSendNodeDetail(nodeData.toJSON());
    const nodeIdValue = Number(parsed.nodeId);
    if (!Number.isFinite(nodeIdValue)) return;
    const saved = await saveNodeDetailToSpring({
      nodeId: nodeIdValue,
      detail: sendPayload,
    });
    if (!saved) {
      sendError(ws, {
        type: "save_error",
        action: "save_node_detail",
        message: "spring_save_failed",
        requestId,
        nodeId: nodeIdValue,
        prevDetail,
      });
    }
  }
  // select node tech request
  else if (parsed?.type === "select_node_tech") {
    const { nodeId, selectedTechId, requestId } = parsed;
    if (!nodeId || typeof selectedTechId !== "number") return;

    const nodeIdValue = Number(nodeId);
    if (!Number.isFinite(nodeIdValue)) return;

    const saved = await saveNodeTechToSpring({
      nodeId: nodeIdValue,
      selectedTechId,
      requestId,
    });
    if (!saved) {
      sendError(ws, {
        type: "save_error",
        action: "select_node_tech",
        message: "spring_save_failed",
        requestId,
        nodeId: nodeIdValue,
        selectedTechId,
      });
    }
  }
  // save node position request
  else if (parsed?.type === "save_node_position") {
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
  // delete node
  else if (parsed?.type === "delete_node") {
    const { nodeId } = parsed;
    if (!nodeId) return;

    const nodeIdValue = Number(nodeId);
    if (!Number.isFinite(nodeIdValue)) return;

    const deleted = await deleteNodeToSpring({
      nodeId: nodeIdValue,
    });
    if (!deleted) {
      sendError(ws, {
        type: "save_error",
        action: "delete_node",
        message: "spring_delete_failed",
        nodeId: nodeIdValue,
      });
    }
  }
}

export function onClientDisconnected(workspaceId: string) {
  const room = getRoom(workspaceId);
  if (!room || room.clients.size > 0) return;
  // 남은 위치 변경 즉시 저장
  flushWorkspace(workspaceId).catch((err) =>
    console.error("flush on room empty failed", err, new Date().toISOString()),
  );
}
