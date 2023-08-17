import { Router } from "express";
import { getPostsByHashtag, getTrendings, testHashtags} from "../controllers/trending.controller.js";

const trendingRouter = Router();

trendingRouter.get("/trendings",getTrendings);
trendingRouter.get("/posts/:hashtag",getPostsByHashtag);
trendingRouter.get("/test",testHashtags);
export default trendingRouter;