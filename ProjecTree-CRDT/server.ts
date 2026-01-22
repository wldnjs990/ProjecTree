import { WebSocket, WebSocketServer } from "ws";
import * as Y from "yjs";
import type { IncomingMessage } from "http";

// yjs 본체 ydoc(얘가 동시편집 알고리즘을 처리해줌)
const doc = new Y.Doc();

// y-websocket의 서버 포트번호는 1234
const PORT = Number(process.env.PORT) || 1234;
// 서버는 WebSocketServer 인스턴스 사용
const wss = new WebSocketServer({ port: PORT });

// 퓨어 wss 연결
// 익명의 클라이언트 유저로부터 connection 이벤트가 들어옴
// 지금은 인증이 없어서 전부 다 받지만, 추후에 인증 기능과 방 생성, 참여 구분 로직을 구현해야함
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  // 퓨어 wss에 y-socket 기능 부여

  // 클라이언트 정보 로깅
  const clientIp = req.socket.remoteAddress;
  const roomName = req.url?.slice(1) || "default";
  console.log(`[연결] 클라이언트: ${clientIp}, 룸: ${roomName}`);

  ws.on("close", () => {
    console.log(`[종료] 클라이언트: ${clientIp}, 룸: ${roomName}`);
  });
});

console.log(`서버 열렸습니다~`);
