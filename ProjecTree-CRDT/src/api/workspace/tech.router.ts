import { Router, type Request, type Response } from "express";
import { getYDocByRoom } from "../../yjs/ydoc-gateway";

export interface TechRecommendation {
  id: number;
  name: string;
  advantage: string;
  disAdvantage: string;
  description: string;
  ref: string;
  recommendScore: number;
  selected: boolean;
}

const router: Router = Router({ mergeParams: true });

// tech-stacks 전체 교체 API (AI 추천 결과 저장)
router.post("/:nodeId/tech-stacks", (req: Request, res: Response) => {
  console.log("create tech-stacks start", new Date().toISOString());

  const { workspaceId, nodeId } = req.params;
  const { techs } = req.body as { techs: TechRecommendation[] };

  if (!workspaceId || !nodeId) {
    console.error("Invalid params", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid params",
      timeStamp: new Date().toISOString(),
    });
  }

  if (!techs || !Array.isArray(techs)) {
    console.error("Invalid techs data", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid techs data",
      timeStamp: new Date().toISOString(),
    });
  }

  const doc = getYDocByRoom(workspaceId as string);
  doc.transact(() => {
    const nodeTechRecommendations = doc.getMap("nodeTechRecommendations");
    // 배열 전체를 한 번에 저장 (기존 것 덮어씌움)
    nodeTechRecommendations.set(nodeId, techs);
  });

  console.log("create tech-stacks success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

export default router;
