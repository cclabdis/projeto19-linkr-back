import { Router } from "express";
import { deletePost, newPost, updatePost } from "../controllers/post.controllers.js";
import { listPosts, getUsersList, getUserPost } from "../controllers/timeline.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { postSchema } from "../schema/post.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { editPostSchema } from "../schema/editPost.schema.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", validateAuth, listPosts);
timelineRouter.get("/timeline/:username", validateAuth, getUsersList);
timelineRouter.get("/timeline/user/:id", validateAuth, getUserPost);
timelineRouter.post("/timeline", validateSchema(postSchema), validateAuth, newPost);
timelineRouter.delete("/timeline/:id", validateAuth, deletePost);
timelineRouter.patch("/timeline/posts/:id", validateAuth, validateSchema(editPostSchema), updatePost);

export default timelineRouter;
