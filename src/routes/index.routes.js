import { Router } from "express";
import authRouter from "./auth.routes.js";
import timelineRouter from "../routes/timelineRouter.js"

const indexRouter = Router();

indexRouter.use(authRouter);
indexRouter.use(timelineRouter);

export default indexRouter;