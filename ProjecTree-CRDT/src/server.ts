import { WebSocketServer } from "ws";
import { handleConnection } from "./ws/connection"


export function startServer() {
const PORT = Number(process.env.PORT) || 1234;
const wss = new WebSocketServer({ port: PORT });


wss.on("connection", handleConnection);

console.log(`✅ WebSocket 서버 시작 : ${PORT}`);
}