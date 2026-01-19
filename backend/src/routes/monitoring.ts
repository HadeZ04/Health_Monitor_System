import { Router } from "express";
import { jwtMiddleware } from "../middleware/auth";
import { getStreams, getReplaySegments, requestExport } from "../controllers/monitoringController";

export const monitoringRouter = Router();

monitoringRouter.get("/streams", jwtMiddleware, getStreams);
monitoringRouter.get("/replay", jwtMiddleware, getReplaySegments);
monitoringRouter.post("/export", jwtMiddleware, requestExport);
