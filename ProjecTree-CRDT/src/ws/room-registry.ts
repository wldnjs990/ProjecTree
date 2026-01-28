import { WebSocket } from "ws";

export const rooms = new Map<string, Set<WebSocket>>();

export function getOrCreateRoom(room: string) {
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }

  return {
    clients: rooms.get(room)!,
  };
}
export function getRoom(room: string) {
  return rooms.get(room);
}
