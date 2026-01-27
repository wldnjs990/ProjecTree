import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { setupWSConnection, getYDoc } from "y-websocket/bin/utils";

export function bindYDocConnection(
  ws: WebSocket,
  req: IncomingMessage,
  room: string,
) {
  setupWSConnection(ws, req, { docName: room });
}

export function getYDocByRoom(room: string) {
  return getYDoc(room);
}
