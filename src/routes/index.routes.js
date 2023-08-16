import { Router } from "express";
import authRouter from "./auth.routes.js";
import testRouter from "./tests.routes.js";

const indexRouter = Router();

indexRouter.use(authRouter);
indexRouter.use(testRouter);

export default indexRouter;
