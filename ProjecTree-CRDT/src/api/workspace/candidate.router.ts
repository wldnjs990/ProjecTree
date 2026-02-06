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
  const { workspaceId, nodeId } = req.params;
  const body = req.body;

  if (!workspaceId || typeof workspaceId !== "string") {
    return res.status(400).json({ message: "Invalid workspace Id" });
  }

  if (!nodeId) {
    return res.status(400).json({ message: "Invalid request" });
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

  res.status(200).json({ status: "ok" });
});

export default router;
