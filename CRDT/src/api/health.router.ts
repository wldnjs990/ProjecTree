import { Router, type Request, type Response } from "express";

const router: Router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default router;
