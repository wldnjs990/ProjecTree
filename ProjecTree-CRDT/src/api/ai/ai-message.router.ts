import { Router } from "express";
import type { Request, Response } from "express";
import { sendToRoom } from "../../ws/room-broadcaster";
import { isValidAiCategory, AI_CATEGORY } from "../../domain/ai/ai-category";

const router: Router = Router();

router.post("/messages", (req: Request, res: Response) => {
  const { workspaceId, nodeId, category, content, text, streamType, isComplete } =
    req.body;
  console.log(
    "[AI_MESSAGE] incoming",
    new Date().toISOString(),
    JSON.stringify({ workspaceId, nodeId, category, content, text, streamType, isComplete }),
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

  const normalizedStreamType =
    streamType ??
    (category === "CANDIDATE"
      ? "candidates"
      : category === "TECH"
        ? "techs"
        : undefined);

  sendToRoom(String(workspaceId), {
    nodeId,
    type: "AI_MESSAGE",
    text: text ?? content,
    streamType: normalizedStreamType,
    isComplete: Boolean(isComplete),
    category,
  });
  console.log("[AI_MESSAGE] sent to room", workspaceId);

  res.status(200).json({ status: "ok" });
});

export default router;
