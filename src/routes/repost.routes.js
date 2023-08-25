import { Router } from "express";
import repostController from "../controllers/repost.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const repostRouter = Router();

repostRouter.use(validateAuth);

repostRouter.post("/repost", repostController.postRepost);

export default repostRouter;