import { Router } from "express";
import authRouter from "./auth.routes.js";
import trendingRouter from "./trendings.routes.js";

const indexRouter = Router();

indexRouter.use(authRouter);
indexRouter.use(trendingRouter);

export default indexRouter;
