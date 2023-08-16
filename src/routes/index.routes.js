import { Router } from "express";
import authRouter from "./auth.routes.js";
import trendingRouter from "./trendings.routes.js";
import timelineRouter from "./timelineRoutes.js"


const indexRouter = Router();

indexRouter.use(authRouter);
indexRouter.use(trendingRouter);
indexRouter.use(timelineRouter);

export default indexRouter;