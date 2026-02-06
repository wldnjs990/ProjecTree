import { Router, type Request, type Response } from "express";
import { getYDocByRoom } from "../../yjs/ydoc-gateway";

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

  const candidates = body;
  const doc = getYDocByRoom(workspaceId);

  const old = doc.getMap("nodeCandidates").get(nodeId);

  console.log("Old candidates:", old);

  const nodeCandidatesPending = doc.getMap("nodeCandidatesPending").get(nodeId);
  console.log("candidates pending:", nodeCandidatesPending);

  doc.transact(() => {
    const nodeCandidates = doc.getMap("nodeCandidates");
    let yNodeCandidates = nodeCandidates.get(nodeId);
    if (!yNodeCandidates) {
      yNodeCandidates = new (nodeCandidates.constructor as any)();
      nodeCandidates.set(nodeId, yNodeCandidates);
    }
    yNodeCandidates.set(nodeId, candidates);

    const nodeCandidatesPending = doc.getMap("nodeCandidatesPending");
    let yNodeCandidatesPending = nodeCandidatesPending.get(nodeId);

    if (!yNodeCandidatesPending) {
      yNodeCandidatesPending = new (nodeCandidatesPending.constructor as any)();
      nodeCandidatesPending.set(nodeId, yNodeCandidatesPending);
    }
    yNodeCandidatesPending.set(nodeId, false);
  });

  console.log("New candidates:", old);

  console.log("candidates pending:", nodeCandidatesPending);

  res.status(200).json({ status: "ok" });
});

export default router;
