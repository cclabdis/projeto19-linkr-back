import { Router } from "express";
import { getPostsByHashtag, getTrendings } from "../controllers/trending.controller.js";

const trendingRouter = Router();

trendingRouter.get("/trendings",getTrendings);
trendingRouter.get("/posts/:hashtag",getPostsByHashtag);

export default trendingRouter;