import { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { getOrCreateRoom, removeRoomIfEmpty } from "./room-registry";
import { bindYDocConnection } from "../yjs/ydoc-gateway";
import { handleMessage, onClientDisconnected } from "./handlers";

function getWorkspaceIdFromUrl(url: string | undefined) {
  if (!url) return "default";
  try {
    const parsed = new URL(url, "http://localhost");
    const fromQuery =
      parsed.searchParams.get("room") ??
      parsed.searchParams.get("workspaceId");
    if (fromQuery && fromQuery.trim().length > 0) return fromQuery.trim();

    const fromPath = parsed.pathname.replace(/^\//, "").trim();
    return fromPath.length > 0 ? fromPath : "default";
  } catch {
    const fallback = url.replace(/^\//, "").trim();
    return fallback.length > 0 ? fallback : "default";
  }
}

export function handleConnection(ws: WebSocket, req: IncomingMessage) {
  const workspaceId = getWorkspaceIdFromUrl(req.url);
  console.log("[WS] connection", {
    url: req.url,
    workspaceId,
  });

  bindYDocConnection(ws, req, workspaceId);

  const { clients } = getOrCreateRoom(workspaceId);
  clients.add(ws);

  ws.on("message", (data) => handleMessage(ws, data as Buffer, workspaceId));

  ws.on("close", () => {
    clients.delete(ws);
    onClientDisconnected(workspaceId);
    removeRoomIfEmpty(workspaceId);
  });
}
