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
      return;
    }

    // Spring 삭제 성공 → Y.Doc에서 해당 노드 + 자식 노드 일괄 제거
    const doc = getYDocByRoom(room);
    const nodes = doc.getMap<any>("nodes");

    // parentId 기반으로 자식 노드를 재귀 탐색
    const nodeIdStr = String(nodeId);
    const targetIds: string[] = [nodeIdStr];
    const collectDescendants = (parentId: string) => {
      nodes.forEach((_value: any, key: string) => {
        const node = nodes.get(key);
        if (node?.get?.("parentId") === parentId) {
          targetIds.push(key);
          collectDescendants(key);
        }
      });
    };
    collectDescendants(nodeIdStr);

    doc.transact(() => {
      const nodeDetails = doc.getMap("nodeDetails");
      const nodeCandidates = doc.getMap("nodeCandidates");
      const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
      const nodeTechRecommendations = doc.getMap("nodeTechRecommendations");
      const nodeTechComparisons = doc.getMap("nodeTechComparisons");
      const nodeTechsPending = doc.getMap("nodeTechsPending");
      const nodeCreatingPending = doc.getMap("nodeCreatingPending");
      const previewNodes = doc.getMap("previewNodes");

      for (const id of targetIds) {
        nodes.delete(id);
        nodeDetails.delete(id);
        nodeCandidates.delete(id);
        nodeCandidatesPending.delete(id);
        nodeTechRecommendations.delete(id);
        nodeTechComparisons.delete(id);
        nodeTechsPending.delete(id);
        nodeCreatingPending.delete(id);
        previewNodes.delete(id);
      }
    });

    console.log(
      `[Delete Node] Removed ${targetIds.length} nodes from Y.Doc:`,
      targetIds,
      new Date().toISOString(),
    );
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
