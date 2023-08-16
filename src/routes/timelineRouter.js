import { Router } from "express";
import { listPosts } from "../controllers/timeline.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js"

const timelineRouter = Router();

timelineRouter.get("/timeline", listPosts);

export default timelineRouter;
