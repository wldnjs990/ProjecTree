import { WebSocket } from "ws";
import { getOrCreateRoom } from "./room-registry";

export function sendToRoom(roomId: string, payload: unknown) {
  const { clients } = getOrCreateRoom(roomId);
  const message = JSON.stringify(payload);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

export function broadcastExceptSender(
  roomId: string,
  sender: WebSocket,
  payload: unknown,
) {
  const { clients } = getOrCreateRoom(roomId);
  const message = JSON.stringify(payload);

  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
