import { Router } from "express";
import type { Request, Response } from "express";
import { sendToRoom } from "../../ws/room-broadcaster";

const router: Router = Router();

router.post("/portfolio/messages", (req: Request, res: Response) => {
  const { workspaceId, memberId, content } = req.body;

  if (!workspaceId || !memberId || !content) {
    return res.status(400).json({
      message: "Invalid payload",
      timeStamp: new Date().toISOString(),
    });
  }

  sendToRoom(workspaceId, {
    memberId,
    type: "AI_PORTFOLIO_MESSAGE",
    content,
  });

  res.status(200).json({ status: "ok" });
});

export default router;
