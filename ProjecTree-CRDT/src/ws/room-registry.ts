import { WebSocket } from "ws";
import * as Y from "yjs";

export const rooms = new Map<string, Set<WebSocket>>();
export const docs = new Map<string, Y.Doc>();

export function getOrCreateRoom(room: string) {
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
    docs.set(room, new Y.Doc());
  }

  return {
    clients: rooms.get(room)!,
    doc: docs.get(room)!,
  };
}

export function getRoom(room: string) {
  return rooms.get(room);
}
