import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { commentSchema } from "../schema/comment.schema.js";
import { getComments, registerComment } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.post("/comment/:postId",validateAuth,validateSchema(commentSchema),registerComment);
commentRouter.get("/comment/:postId",validateAuth,getComments);

export default commentRouter;