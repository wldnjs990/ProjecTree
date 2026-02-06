import { Router, type Request, type Response } from "express";
import { getYDocByRoom } from "../../yjs/ydoc-gateway";

const router: Router = Router({ mergeParams: true });

router.post("/:nodeId/tech-stacks", (req: Request, res: Response) => {
  const { workspaceId, nodeId } = req.params;
  const body = req.body;

  if (!workspaceId || !nodeId) {
    return res.status(400).json({ message: "Invalid params" });
  }
  if (!workspaceId || typeof workspaceId !== "string") {
    return res.status(400).json({ message: "Invalid workspace Id" });
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
});

export default router;
