import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { getFollowInfo, followUser } from "../controllers/follow.controllers.js";

const followRouter = Router();

followRouter.get('/infos/:userId',validateAuth,getFollowInfo);
followRouter.post('/follow/:userId',validateAuth,followUser);

export default followRouter;