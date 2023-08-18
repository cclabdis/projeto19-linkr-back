import { Router } from "express";
import authRouter from "./auth.routes.js";
import trendingRouter from "./trendings.routes.js";
import timelineRouter from "./timeline.routes.js"
import likesRouter from "./likes.routes.js";


const indexRouter = Router();

indexRouter.use(authRouter);
indexRouter.use(trendingRouter);
indexRouter.use(timelineRouter);
indexRouter.use(likesRouter);

export default indexRouter;