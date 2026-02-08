import { Router, type Request, type Response } from "express";
import { getYDocByRoom, Y } from "../../yjs/ydoc-gateway";

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

// AI 추천 - 전체 교체 API
router.post("/:nodeId/tech-stacks", (req: Request, res: Response) => {
  console.log("create tech-stacks start", new Date().toISOString());
  console.log("req.body:", JSON.stringify(req.body, null, 2));

  const { workspaceId, nodeId } = req.params;

  // Spring 서버가 { techs, comparison } 형식으로 전송
  const { techs, comparison } = req.body as {
    techs: TechRecommendation[];
    comparison: string;
  };

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

    let yArray = nodeTechRecommendations.get(nodeId) as Y.Array<TechRecommendation>;
    if (!yArray) {
      yArray = new Y.Array<TechRecommendation>();
      nodeTechRecommendations.set(nodeId, yArray);
    }

    // 전체 교체: 기존 삭제 후 새로 추가
    if (yArray.length > 0) {
      yArray.delete(0, yArray.length);
    }

    // 각 tech에 selected: false 추가
    const techsWithSelected = techs.map((tech) => ({
      ...tech,
      selected: tech.selected ?? false,
    }));
    yArray.push(techsWithSelected);

    // comparison 저장 (신규)
    if (comparison) {
      const nodeTechComparisons = doc.getMap("nodeTechComparisons");
      nodeTechComparisons.set(nodeId, comparison);
    }

    // pending 상태 해제
    const techsPending = doc.getMap("techsPending");
    techsPending.set(nodeId, false);
  });

  console.log("create tech-stacks success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

// 커스텀 기술 추가 API - 기존 배열에 1개 추가
router.post("/:nodeId/custom-tech-stacks", (req: Request, res: Response) => {
  console.log("add custom tech-stack start", new Date().toISOString());
  console.log("req.body:", JSON.stringify(req.body, null, 2));

  const { workspaceId, nodeId } = req.params;

  // Spring 서버가 객체를 직접 전송
  const tech = req.body as TechRecommendation;

  if (!workspaceId || !nodeId) {
    console.error("Invalid params", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid params",
      timeStamp: new Date().toISOString(),
    });
  }

  if (!tech || !tech.id || !tech.name) {
    console.error("Invalid tech data", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid tech data - id and name are required",
      timeStamp: new Date().toISOString(),
    });
  }

  const doc = getYDocByRoom(workspaceId as string);
  doc.transact(() => {
    const nodeTechRecommendations = doc.getMap("nodeTechRecommendations");

    let yArray = nodeTechRecommendations.get(nodeId) as Y.Array<TechRecommendation>;
    if (!yArray) {
      yArray = new Y.Array<TechRecommendation>();
      nodeTechRecommendations.set(nodeId, yArray);
    }

    // 기존 배열에 1개 추가 (기본값 채워서 저장)
    const customTech: TechRecommendation = {
      id: tech.id,
      name: tech.name,
      advantage: tech.advantage ?? "",
      disAdvantage: tech.disAdvantage ?? "",
      description: tech.description ?? "",
      ref: tech.ref ?? "",
      recommendScore: tech.recommendScore ?? -1,
      selected: tech.selected ?? false,
    };
    yArray.push([customTech]);

    // pending 상태 해제
    const techsPending = doc.getMap("techsPending");
    techsPending.set(nodeId, false);
  });

  console.log("add custom tech-stack success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

// Pending 리셋 API - AI 호출 실패 시 fallback용
router.post("/:nodeId/tech-stacks/pending-reset", (req: Request, res: Response) => {
  console.log("reset tech pending start", new Date().toISOString());

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
    const techsPending = doc.getMap("techsPending");
    techsPending.set(nodeId, false);
  });

  console.log("reset tech pending success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

export default router;
