import { Router } from "express";
import type { Request, Response } from "express";
import { sendToRoom } from "../ws/room-broadcaster";
import { time, timeStamp } from "node:console";

const aiRouter: Router = Router();

aiRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// CANDIDATE(후보노드 생성시), NODE(노드 생성시 부모노드 하위에), TECH

aiRouter.post("/messages", (req, res) => {
  const { workspaceId, nodeId, category, content } = req.body;

  if (!workspaceId || !nodeId || !category || !content) {
    return res.status(400).json({
      message: "Invalid payload",
      timeStamp: new Date().toISOString(),
    });
  }

  sendToRoom(workspaceId, {
    nodeId,
    type: "AI_MESSAGE",
    category,
    content,
  });

  return res.status(200).json({ status: "ok" });
});
export default aiRouter;
