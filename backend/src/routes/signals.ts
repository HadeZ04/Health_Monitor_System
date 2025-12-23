import { Router } from "express";
import {
  getEcg,
  getSpo2,
  getHeartRate,
  getPpg,
  getPcg,
  getGps,
} from "../controllers/signalController";
import { jwtMiddleware } from "../middleware/auth";

export const signalRouter = Router();

signalRouter.get("/ecg", jwtMiddleware, getEcg);
signalRouter.get("/spo2", jwtMiddleware, getSpo2);
signalRouter.get("/heartrate", jwtMiddleware, getHeartRate);
signalRouter.get("/ppg", jwtMiddleware, getPpg);
signalRouter.get("/pcg", jwtMiddleware, getPcg);
signalRouter.get("/gps", jwtMiddleware, getGps);
