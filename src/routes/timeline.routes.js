import { Router } from "express";
import { listPosts } from "../controllers/timeline.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js"
import { deletePost, newPost } from "../controllers/post.controllers.js";
import { postSchema } from "../schema/post.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", listPosts);
timelineRouter.post("/timeline",validateSchema(postSchema), validateAuth, newPost);
timelineRouter.delete("/timeline/:id", validateAuth, deletePost)

export default timelineRouter;
