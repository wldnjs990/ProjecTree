import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { setupWSConnection, getYDoc } from "y-websocket/bin/utils";

export function bindYjs(
  ws: WebSocket,
  req: IncomingMessage,
  room: string
) {
  setupWSConnection(ws, req, { docName: room });
}

export function getRoomDoc(room: string) {
  return getYDoc(room);
}