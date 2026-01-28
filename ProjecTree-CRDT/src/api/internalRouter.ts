import { Router } from "express";
import type { Request, Response } from "express";
import {
  isValidNodePayload,
  type IncomingNodePayload,
} from "../domain/node/nodePayload";
import { getYDocByRoom } from "../yjs/ydoc-gateway";
const internalRouter: Router = Router();

internalRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

internalRouter.post("/nodes", (req: Request, res: Response) => {
  const body = req.body;
  console.log("Received node payload:", body);
  console.log("-----------------------------------------------------------");
  // payload 검증
  if (!isValidNodePayload(body)) {
    return res.status(400).json({ message: "Invalid node payload" });
  }

  const node: IncomingNodePayload = body;

  const room = String(1);
  const doc = getYDocByRoom(room);

  // Y.Doc에 반영 (트랜잭션)
  doc.transact(() => {
    const nodes = doc.getMap("nodes");

    // 1️⃣ node Map 생성은 여기서만
    let yNode = nodes.get(String(node.id));
    if (!yNode) {
      yNode = new (nodes.constructor as any)();
      nodes.set(String(node.id), yNode);
    }

    // 2️⃣ primitive
    yNode.set("type", node.nodeType);
    yNode.set("parentId", node.parentId);

    // 3️⃣ position (plain object)
    yNode.set("position", {
      x: node.position.xPos,
      y: node.position.yPos,
    });

    // 4️⃣ data (plain object)
    yNode.set("data", {
      title: node.name,
      taskId: node.data.identifier,
      category: node.data.taskType,
      status: node.data.status,
      priority: node.data.priority,
      difficult: node.data.difficult,
    });

    // 5️⃣ details (plain object)
    const details = doc.getMap("nodeDetails");
    const detail = Object.fromEntries(
      Object.entries(node.data).filter(([, v]) => v !== undefined),
    );
    details.set(String(node.id), detail);
  });

  // 응답 (전파는 y-websocket이 자동 처리)
  return res.status(200).json({ status: "ok" });
});

export default internalRouter;
