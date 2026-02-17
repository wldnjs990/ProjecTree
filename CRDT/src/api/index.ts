import { Router } from "express";
import healthRouter from "./health.router";
import aiRouter from "./ai/ai.router";
import workspaceRouter from "./workspace/workspace.router";

const router: Router = Router();

router.use(healthRouter);

router.use("/workspaces/:workspaceId/nodes", workspaceRouter);
router.use("/ai", aiRouter);

export default router;
