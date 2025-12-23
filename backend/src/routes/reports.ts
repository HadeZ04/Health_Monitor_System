import { Router } from "express";
import { exportReport, listReportTemplates } from "../controllers/reportController";
import { jwtMiddleware } from "../middleware/auth";

export const reportsRouter = Router();

reportsRouter.post("/export", jwtMiddleware, exportReport);
reportsRouter.get("/templates", jwtMiddleware, listReportTemplates);
