import { Router } from "express";
import { getMe } from "../controllers/userController";
import { jwtMiddleware } from "../middleware/auth";

export const userRouter = Router();

userRouter.get("/me", jwtMiddleware, getMe);
