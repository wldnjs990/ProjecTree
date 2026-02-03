import { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { getOrCreateRoom, removeRoomIfEmpty } from "./room-registry";
import { bindYDocConnection } from "../yjs/ydoc-gateway";
import { handleMessage, onClientDisconnected } from "./handlers";

export function handleConnection(ws: WebSocket, req: IncomingMessage) {
  const workspaceId = req.url?.slice(1) || "default";

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
