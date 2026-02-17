import { WebSocket } from "ws";
import { getOrCreateRoom, getAllRooms } from "./room-registry";

export function sendToRoom(roomId: string, payload: unknown) {
  const { clients } = getOrCreateRoom(roomId);
  console.log("[WS] sendToRoom", roomId, "clients:", clients.size);
  const message = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      console.log("Sent to client in room:", roomId);
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
