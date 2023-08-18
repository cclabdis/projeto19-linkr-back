import { Router } from "express";
import { getPostsByHashtag, getTrendings} from "../controllers/trending.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const trendingRouter = Router();

trendingRouter.get("/trendings",getTrendings);
trendingRouter.get("/posts/:hashtag",validateAuth,getPostsByHashtag);

export default trendingRouter;