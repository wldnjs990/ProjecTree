import { WebSocket } from "ws";
type Room = {
  clients: Set<WebSocket>;
};
const rooms = new Map<string, Room>();

export function getOrCreateRoom(roomId: string): Room {
  let room = rooms.get(roomId);
  if (!room) {
    room = { clients: new Set() };
    rooms.set(roomId, room);
  }

  return room;
}
export function getRoom(room: string) {
  return rooms.get(room);
}

export function removeRoomIfEmpty(roomId: string) {
  const room = rooms.get(roomId);
  if (room && room.clients.size === 0) {
    rooms.delete(roomId);
  }
}
