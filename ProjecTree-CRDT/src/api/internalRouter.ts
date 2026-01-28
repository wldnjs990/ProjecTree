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

    // 3️⃣ position
    let pos = yNode.get("position");
    if (!pos || typeof pos.set !== "function") {
      pos = new (nodes.constructor as any)();
      yNode.set("position", pos);
    }
    pos.set("x", node.position.xPos);
    pos.set("y", node.position.yPos);

    // 4️⃣ data
    let data = yNode.get("data");
    if (!data || typeof data.set !== "function") {
      data = new (nodes.constructor as any)();
      yNode.set("data", data);
    }

    data.set("title", node.name);
    data.set("taskId", node.data.identifier);
    data.set("category", node.data.taskType);
    data.set("status", node.data.status);
    data.set("priority", node.data.priority);
    data.set("difficult", node.data.difficult);

    // 5️⃣ details
    const details = doc.getMap("nodeDetails");
    let detail = details.get(String(node.id));
    if (!detail || typeof detail.set !== "function") {
      detail = new (nodes.constructor as any)();
      details.set(String(node.id), detail);
    }

    Object.entries(node.data).forEach(([k, v]) => {
      if (v !== undefined) detail.set(k, v);
    });
  });

  // 응답 (전파는 y-websocket이 자동 처리)
  return res.status(200).json({ status: "ok" });
});

export default internalRouter;
