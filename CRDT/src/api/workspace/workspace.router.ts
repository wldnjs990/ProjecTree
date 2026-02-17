import { Router } from "express";

import nodeRouter from "./node.router";
import techRouter from "./tech.router";
import candidateRouter from "./candidate.router";

const workspaceRouter: Router = Router({ mergeParams: true });

workspaceRouter.use(nodeRouter);
workspaceRouter.use(techRouter);
workspaceRouter.use(candidateRouter);

export default workspaceRouter;
