import { Router } from "express";
import { getTrendSummary, getGpsHeatmap } from "../controllers/analyticsController";
import { jwtMiddleware } from "../middleware/auth";

export const analyticsRouter = Router();

analyticsRouter.get("/trends", jwtMiddleware, getTrendSummary);
analyticsRouter.get("/gps", jwtMiddleware, getGpsHeatmap);
