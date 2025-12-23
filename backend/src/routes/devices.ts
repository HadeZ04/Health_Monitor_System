import { Router } from "express";
import { listDevices, createDevice } from "../controllers/deviceController";
import { jwtMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

export const deviceRouter = Router();

deviceRouter.get("/", jwtMiddleware, listDevices);
deviceRouter.post("/", jwtMiddleware, requireRole(["doctor", "admin"]), createDevice);
