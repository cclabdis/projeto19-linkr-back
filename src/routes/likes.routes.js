import { Router } from "express";
import likesController from "../controllers/likes.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const likesRouter = Router();

likesRouter.use(validateAuth);

likesRouter.post("/like/:postId", likesController.postLike);
likesRouter.delete("/deslike/:postId", likesController.deleteLike);

export default likesRouter;