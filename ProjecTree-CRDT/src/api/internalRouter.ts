import { Router } from "express";
import type { Request, Response } from "express";

const internalRouter: Router = Router();

// TODO : 내부용 REST API 엔드포인트 추가
internalRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default internalRouter;
