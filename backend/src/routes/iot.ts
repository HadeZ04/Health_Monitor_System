import { Router } from "express";
import { listIotDevices, scheduleFirmware, getOtaStatus } from "../controllers/iotController";
import { jwtMiddleware } from "../middleware/auth";

export const iotRouter = Router();

iotRouter.get("/devices", jwtMiddleware, listIotDevices);
iotRouter.post("/firmware", jwtMiddleware, scheduleFirmware);
iotRouter.get("/ota", jwtMiddleware, getOtaStatus);
