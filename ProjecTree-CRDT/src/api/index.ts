import { Router } from "express";
import healthRouter from "./health.router";
import aiRouter from "./ai/ai.router";

const router: Router = Router();

router.use(healthRouter);

const workspaceNodeRouter = Router({ mergeParams: true });

router.use("/workspaces/:workspaceId/nodes", workspaceNodeRouter);

router.use("/ai", aiRouter);

export default router;
