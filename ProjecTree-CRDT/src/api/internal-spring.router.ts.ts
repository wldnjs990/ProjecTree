import { Router } from "express";
import type { Request, Response } from "express";
import {
  isValidNodePayload,
  type IncomingNodePayload,
} from "../domain/node/nodePayload";
import { getYDocByRoom } from "../yjs/ydoc-gateway";
const springRouter: Router = Router();

springRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

springRouter.post(
  "/workspaces/:workspaceId/nodes",
  (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const body = req.body;
    if (!isValidNodePayload(body)) {
      return res.status(400).json({ message: "Invalid node payload" });
    }
    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({ message: "Invalid workspace Id" });
    }
    // TODO description 필드 추가되면 여기도 수정 필요
    const node: IncomingNodePayload = body;
    const doc = getYDocByRoom(workspaceId);
    doc.transact(() => {
      const nodes = doc.getMap("nodes");

      let yNode = nodes.get(String(node.id));
      if (!yNode) {
        yNode = new (nodes.constructor as any)();
        nodes.set(String(node.id), yNode);
      }

      yNode.set("type", node.nodeType);
      yNode.set("parentId", String(node.parentId));

      yNode.set("position", {
        x: node.position.xpos,
        y: node.position.ypos,
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
  },
);

springRouter.post(
  "/workspaces/:workspaceId/nodes/:nodeId/tech-stacks",
  (req: Request, res: Response) => {
    const { workspaceId, nodeId } = req.params;
    const body = req.body;

    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({ message: "Invalid workspace Id" });
    }
    if (!nodeId || typeof nodeId !== "string") {
      return res.status(400).json({ message: "Invalid node Id" });
    }

    const doc = getYDocByRoom(workspaceId);
    doc.transact(() => {
      const nodeTech = doc.getMap("nodeTechRecommendations");

      let yNodeTech = nodeTech.get(nodeId);
      if (!yNodeTech) {
        yNodeTech = new (nodeTech.constructor as any)();
        nodeTech.set(nodeId, yNodeTech);
      }
      yNodeTech.set("id", body.techVocaId);
      yNodeTech.set("name", body.techName);
      yNodeTech.set("advantage", "");
      yNodeTech.set("disAdvantage", "");
      yNodeTech.set("description", "");
      yNodeTech.set("ref", "");
      yNodeTech.set("recommendScore", -1);
      yNodeTech.set("selected", false);
    });

    res.status(200).json({ status: "ok" });
  },
);

export default springRouter;
