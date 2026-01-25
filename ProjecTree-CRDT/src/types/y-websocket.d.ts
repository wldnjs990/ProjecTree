// types/y-websocket.d.ts
declare module "y-websocket/bin/utils" {
  import type { WebSocket } from "ws";
  import type { IncomingMessage } from "http";

  export function setupWSConnection(
    ws: WebSocket,
    req: IncomingMessage,
    opts?: {
      docName?: string;
      docs?: Map<string, any>;
      gc?: boolean;
    },
  ): void;

  export function getYDoc(
    docName: string,
    opts?: {
      gc?: boolean;
    },
  ): Y.Doc;
}
