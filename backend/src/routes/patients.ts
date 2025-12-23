import { Router } from "express";
import { listPatients, getPatient, getPatientVitals, getPatientEhr } from "../controllers/patientController";
import { jwtMiddleware } from "../middleware/auth";

export const patientsRouter = Router();

patientsRouter.get("/", jwtMiddleware, listPatients);
patientsRouter.get("/:id", jwtMiddleware, getPatient);
patientsRouter.get("/:id/vitals", jwtMiddleware, getPatientVitals);
patientsRouter.get("/:id/ehr", jwtMiddleware, getPatientEhr);
