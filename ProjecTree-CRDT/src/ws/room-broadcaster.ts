import { WebSocket } from "ws";
import { getOrCreateRoom, getAllRooms } from "./room-registry";

export function sendToRoom(roomId: string, payload: unknown) {
  // TODO
  // 테스트 완료 후 주석 해제
  const { clients } = getOrCreateRoom(roomId);
  const message = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      console.log("Sent to client in room:", roomId);
    }
  }
  // 테스트 완료 후 제거
  // getAllRooms().forEach((room, id) => {
  //   const message = JSON.stringify(payload);
  //   for (const client of room.clients) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(message);
  //     }
  //   }
  // });
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
