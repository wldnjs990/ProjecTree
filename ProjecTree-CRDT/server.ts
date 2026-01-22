import { WebSocket, WebSocketServer } from "ws";
import * as Y from "yjs";
import type { IncomingMessage } from "http";

// yjs 본체 ydoc(얘가 동시편집 알고리즘을 처리해줌)
const doc = new Y.Doc();

// y-websocket의 서버 포트번호는 1234
const PORT = Number(process.env.PORT) || 1234;
// 서버는 WebSocketServer 인스턴스 사용
const wss = new WebSocketServer({ port: PORT });

// room별 YDoc 저장
const docs = new Map<string, Y.Doc>();

// room별 연결된 클라이언트들 저장
const rooms = new Map<string, Set<WebSocket>>();

// 퓨어 wss 연결
// 익명의 클라이언트 유저로부터 connection 이벤트가 들어옴
// 지금은 인증이 없어서 전부 다 받지만, 추후에 인증 기능과 방 생성, 참여 구분 로직을 구현해야함
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  // URL에서 room 이름 추출 (예: ws://localhost:1234/room-1)
  const room = req.url?.slice(1) || "default";

  // room이 없으면 생성
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
    docs.set(room, new Y.Doc());
  }

  // 이 room의 클라이언트 목록
  const clients = rooms.get(room)!;
  const doc = docs.get(room)!;

  // 현재 클라이언트 추가
  clients.add(ws);

  ws.on("message", (data: Buffer) => {
    // 다른 클라이언트들에게 브로드캐스트
    clients.forEach((c) => {
      if (c !== ws && c.readyState === WebSocket.OPEN) {
        c.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log(`[종료]`);
  });
});

console.log(`서버 열렸습니다~`);
