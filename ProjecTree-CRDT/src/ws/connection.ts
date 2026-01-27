import { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { getOrCreateRoom } from "./room-registry";
import { bindYDocConnection } from "../yjs/ydoc-gateway";
import { handleMessage, onClientDisconnected } from "./handlers";

export function handleConnection(ws: WebSocket, req: IncomingMessage) {
  const room = req.url?.slice(1) || "default";

  bindYDocConnection(ws, req, room);

  const { clients } = getOrCreateRoom(room);
  clients.add(ws);

  ws.on("message", (data) => handleMessage(ws, data as Buffer, room, clients));

  ws.on("close", () => {
    clients.delete(ws);
    onClientDisconnected(room);
  });
}
