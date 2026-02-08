import { Router } from "express";
import type { Request, Response } from "express";
import { sendToRoom } from "../../ws/room-broadcaster";
import { isValidAiCategory, AI_CATEGORY } from "../../domain/ai/ai-category";

const router: Router = Router();

router.post("/messages", (req: Request, res: Response) => {
  const { workspaceId, nodeId, category, content } = req.body;
  console.log(
    "[AI_MESSAGE] incoming",
    new Date().toISOString(),
    JSON.stringify({ workspaceId, nodeId, category, content }),
  );

  if (!workspaceId || !nodeId || !category || !content) {
    return res.status(400).json({
      message: "Invalid payload",
      timeStamp: new Date().toISOString(),
    });
  }

  if (!isValidAiCategory(category)) {
    return res.status(400).json({
      message: `Invalid category. Allowed values: ${Object.values(AI_CATEGORY).join(", ")}`,
      timeStamp: new Date().toISOString(),
    });
  }

  sendToRoom(workspaceId, {
    nodeId,
    type: "AI_MESSAGE",
    category,
    content,
  });
  console.log("[AI_MESSAGE] sent to room", workspaceId);

  res.status(200).json({ status: "ok" });
});

export default router;
