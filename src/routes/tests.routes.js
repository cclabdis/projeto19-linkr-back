import { Router } from "express";
import { getTrendings } from "../controllers/trending.controller.js";

const testRouter = Router();

testRouter.get("/trendings",getTrendings);

export default testRouter;