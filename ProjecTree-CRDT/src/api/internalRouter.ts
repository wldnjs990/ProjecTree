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
  if (!isValidNodePayload(body)) {
    return res.status(400).json({ message: "Invalid node payload" });
  }

  const Payload: IncomingNodePayload = body;
  const node = Payload.nodeData;

  const room = String(Payload.workspaceId);
  const doc = getYDocByRoom(room);

  doc.transact(() => {
    const nodes = doc.getMap("nodes");

    let yNode = nodes.get(String(node.id));
    if (!yNode) {
      yNode = new (nodes.constructor as any)();
      nodes.set(String(node.id), yNode);
    }

    yNode.set("type", node.nodeType);
    yNode.set("parentId", node.parentId);

    yNode.set("position", {
      x: node.position.xPos,
      y: node.position.yPos,
    });

    yNode.set("data", {
      title: node.name,
      taskId: node.data.identifier,
      category: node.data.taskType,
      status: node.data.status,
      priority: node.data.priority,
      difficult: node.data.difficult,
    });

    const details = doc.getMap("nodeDetails");
    const detail = Object.fromEntries(
      Object.entries(node.data).filter(([, v]) => v !== undefined),
    );
    details.set(String(node.id), detail);
  });

  return res.status(200).json({ status: "ok" });
});

export default internalRouter;
