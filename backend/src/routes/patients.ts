/**
 * Patient Routes
 * API endpoints for patient-related operations
 */

import { Router } from 'express';
import * as patientController from '../controllers/patient.controller';
import { jwtMiddleware } from '../middleware/auth';
import {
  validate,
  createAppointmentSchema,
  updateAppointmentSchema,
  takeMedicationSchema,
  queryVitalsSchema,
  queryAppointmentsSchema,
  queryLabResultsSchema,
} from '../validators/patient.validator';

export const patientsRouter = Router();

// All routes require authentication
patientsRouter.use(jwtMiddleware);

// Dashboard
patientsRouter.get('/dashboard/:patientId', patientController.getDashboard);

// Vitals
patientsRouter.get(
  '/:patientId/vitals',
  validate(queryVitalsSchema),
  patientController.getVitals
);

// Appointments
patientsRouter.get(
  '/:patientId/appointments',
  validate(queryAppointmentsSchema),
  patientController.getAppointments
);

patientsRouter.post(
  '/:patientId/appointments',
  validate(createAppointmentSchema),
  patientController.createAppointment
);

patientsRouter.put(
  '/:patientId/appointments/:appointmentId',
  validate(updateAppointmentSchema),
  patientController.updateAppointment
);

patientsRouter.delete(
  '/:patientId/appointments/:appointmentId',
  patientController.deleteAppointment
);

// Medications
patientsRouter.get('/:patientId/medications', patientController.getMedications);

patientsRouter.get(
  '/:patientId/medications/schedule',
  patientController.getMedicationSchedule
);

patientsRouter.post(
  '/:patientId/medications/:medicationId/take',
  validate(takeMedicationSchema),
  patientController.takeMedication
);

// Lab Results
patientsRouter.get(
  '/:patientId/lab-results',
  validate(queryLabResultsSchema),
  patientController.getLabResults
);

patientsRouter.get(
  '/:patientId/lab-results/:resultId',
  patientController.getLabResult
);

patientsRouter.get(
  '/:patientId/lab-results/:resultId/download',
  patientController.downloadLabResult
);

