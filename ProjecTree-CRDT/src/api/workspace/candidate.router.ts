import { Router, type Request, type Response } from "express";
import { getYDocByRoom } from "../../yjs/ydoc-gateway";

export type TaskType = "FE" | "BE" | null;

export interface Candidate {
  id: number;
  name: string;
  description: string;
  taskType: TaskType;
  selected: boolean;
  summary: string;
}

const router: Router = Router({ mergeParams: true });
router.post("/:nodeId/candidate", (req: Request, res: Response) => {
  console.log("create candidates start", new Date().toISOString());
  console.log("req.body:", JSON.stringify(req.body, null, 2));

  const { workspaceId, nodeId } = req.params;
  const body = req.body;

  if (!workspaceId || typeof workspaceId !== "string") {
    console.error("Invalid workspace Id", new Date().toLocaleDateString());
    return res.status(400).json({
      message: "Invalid workspace Id",
      timeStamp: new Date().toISOString(),
    });
  }

  if (!nodeId) {
    console.error("Invalid request", new Date().toLocaleDateString());
    return res.status(400).json({
      message: "Invalid request",
      timeStamp: new Date().toISOString(),
    });
  }

  const candidates: Partial<Candidate>[] = body.candidates;

  const doc = getYDocByRoom(workspaceId);

  try {
    doc.transact(() => {
      const nodeCandidates = doc.getMap("nodeCandidates");

      const newCandidates = candidates.map((c) => ({
        ...c,
        taskType: null,
        selected: false,
      })) as Candidate[];

      // 기존 배열에 새 배열 병합
      const currentCandidates = (nodeCandidates.get(nodeId) as Candidate[]) ?? [];
      const mergedCandidates = [...currentCandidates, ...newCandidates];
      nodeCandidates.set(nodeId, mergedCandidates);

      const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
      nodeCandidatesPending.set(nodeId, false);
    });

    console.log("create candidates success", new Date().toISOString());
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("create candidates failed", error);

    // Fallback: pending 해제
    try {
      doc.transact(() => {
        const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
        nodeCandidatesPending.set(nodeId, false);
      });
    } catch (fallbackError) {
      console.error("fallback pending reset failed", fallbackError);
    }

    res.status(500).json({
      status: "error",
      message: String(error),
      timeStamp: new Date().toISOString(),
    });
  }
});

// Pending 리셋 API - AI 호출 실패 시 fallback용
router.post("/:nodeId/candidate/pending-reset", (req: Request, res: Response) => {
  console.log("reset candidate pending start", new Date().toISOString());

  const { workspaceId, nodeId } = req.params;

  if (!workspaceId || !nodeId) {
    console.error("Invalid params", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid params",
      timeStamp: new Date().toISOString(),
    });
  }

  const doc = getYDocByRoom(workspaceId as string);
  doc.transact(() => {
    const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
    nodeCandidatesPending.set(nodeId, false);
  });

  console.log("reset candidate pending success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

export default router;
