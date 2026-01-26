import express from "express";
import { WebSocketServer } from "ws";
import { handleConnection } from "./ws/connection";
import internalRouter from "./rest/internalRouter";

export function startServer() {
  const PORT = Number(process.env.PORT) || 1234;
  const HTTP_PORT = Number(process.env.HTTP_PORT) || 1235;

  const wss = new WebSocketServer({ port: PORT });

  wss.on("connection", handleConnection);

  console.log(`WebSocket 서버 시작 : ${PORT}`);

  const app = express();
  app.use(express.json());

  // REST 라우터 연결
  app.use("/internal", internalRouter);

  app.listen(HTTP_PORT, () => {
    console.log(`REST 서버 시작 ${HTTP_PORT}`);
  });
}
