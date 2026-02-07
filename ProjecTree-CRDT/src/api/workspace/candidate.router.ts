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

  doc.transact(() => {
    const nodeCandidates = doc.getMap("nodeCandidates");
    let yNodeCandidates = nodeCandidates.get(nodeId);
    if (!yNodeCandidates) {
      yNodeCandidates = new (nodeCandidates.constructor as any)();
      nodeCandidates.set(nodeId, yNodeCandidates);
    }
    const newCandidates = candidates.map((c) => ({
      ...c,
      taskType: null,
      selected: false,
    }));
    yNodeCandidates.set(nodeId, newCandidates);

    const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
    nodeCandidatesPending.set(nodeId, false);
  });

  console.log("create candidates success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

export default router;
