import { Router } from "express";
import { listAlerts, getAlertRules, createTestAlert } from "../controllers/alertController";
import { jwtMiddleware } from "../middleware/auth";

export const alertsRouter = Router();

alertsRouter.get("/", jwtMiddleware, listAlerts);
alertsRouter.get("/rules", jwtMiddleware, getAlertRules);
alertsRouter.post("/test", jwtMiddleware, createTestAlert);
