import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signUpSchema, signInSchema } from "../schema/auth.schema.js";

const authRouter = Router();

authRouter.post("/signUp", validateSchema(signUpSchema), signUp);
authRouter.post("/signIn", validateSchema(signInSchema), signIn);

export default authRouter;
