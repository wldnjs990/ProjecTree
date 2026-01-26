import { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { getOrCreateRoom } from "./rooms";
import { bindYjs } from "../yjs/yjsManager";
import { handleMessage } from "./handlers";

export function handleConnection(ws: WebSocket, req: IncomingMessage) {
  const room = req.url?.slice(1) || "default";

  bindYjs(ws, req, room);

  const { clients } = getOrCreateRoom(room);
  clients.add(ws);

  ws.on("message", (data) =>
    handleMessage(ws, data as Buffer, room, clients)
  );

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`❌ 연결 종료 : ${room}`);
  });
}