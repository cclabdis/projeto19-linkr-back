import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { getFollowInfo } from "../controllers/follow.controllers.js";

const followRouter = Router();

followRouter.get('/infos/:userId',validateAuth,getFollowInfo);

export default followRouter;