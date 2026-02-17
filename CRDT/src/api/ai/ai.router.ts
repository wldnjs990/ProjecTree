import { Router } from "express";
import aiMessageRouter from "./ai-message.router";
import portfolioAiRouter from "./portfolio-ai.router";

const aiRouter: Router = Router();

aiRouter.use(aiMessageRouter);
aiRouter.use(portfolioAiRouter);

export default aiRouter;
