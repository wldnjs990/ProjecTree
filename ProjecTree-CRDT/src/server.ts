import express from "express";
import { WebSocketServer } from "ws";
import { handleConnection } from "./ws/connection";
import springRouter from "./api/internal-spring.router.ts";
import aiRouter from "./api/internal-ai.router";

export function startServer() {
  const PORT = Number(process.env.PORT) || 8898;
  const HTTP_PORT = Number(process.env.HTTP_PORT) || 8899;

  const wss = new WebSocketServer({ port: PORT });

  wss.on("connection", handleConnection);

  console.log(`WebSocket 서버 시작 : ${PORT}`);

  const app = express();
  app.use(express.json());

  // REST 라우터 연결
  app.use("/internal", springRouter);
  app.use("/internal/ai", aiRouter);

  app.listen(HTTP_PORT, () => {
    console.log(`REST 서버 시작 ${HTTP_PORT}`);
  });
}
