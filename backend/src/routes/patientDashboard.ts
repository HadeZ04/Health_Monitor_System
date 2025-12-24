/**
 * Patient Dashboard Routes
 * Example of complete route implementation with all middleware
 */

import { Router } from 'express';
import { patientDashboardController } from '../controllers/patientDashboardController.js';
import { authenticate, requireRoles } from '../middlewares/authMiddleware.js';
import { checkPatientAccess } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  patientIdParamSchema,
  vitalsQuerySchema,
  createAppointmentSchema,
  updateAppointmentSchema,
} from '../validators/patientDashboard.validator.js';

const router = Router();

/**
 * @route   GET /api/patients/dashboard/:patientId
 * @desc    Get patient dashboard data
 * @access  Patient (own), Doctor (assigned), Admin
 */
router.get(
  '/dashboard/:patientId',
  authenticate,
  requireRoles('patient', 'doctor', 'admin'),
  validate(patientIdParamSchema),
  checkPatientAccess,
  patientDashboardController.getDashboard
);

/**
 * @route   GET /api/patients/:patientId/vitals
 * @desc    Get patient vitals history
 * @access  Patient (own), Doctor (assigned), Admin
 */
router.get(
  '/:patientId/vitals',
  authenticate,
  requireRoles('patient', 'doctor', 'admin'),
  validate(patientIdParamSchema),
  validate(vitalsQuerySchema),
  checkPatientAccess,
  patientDashboardController.getVitalsHistory
);

/**
 * @route   GET /api/patients/:patientId/appointments
 * @desc    Get patient appointments
 * @access  Patient (own), Doctor (assigned), Admin
 */
router.get(
  '/:patientId/appointments',
  authenticate,
  requireRoles('patient', 'doctor', 'admin'),
  validate(patientIdParamSchema),
  checkPatientAccess,
  patientDashboardController.getAppointments
);

/**
 * @route   POST /api/patients/:patientId/appointments
 * @desc    Create new appointment
 * @access  Patient (own), Admin
 */
router.post(
  '/:patientId/appointments',
  authenticate,
  requireRoles('patient', 'admin'),
  validate(patientIdParamSchema),
  validate(createAppointmentSchema),
  checkPatientAccess,
  patientDashboardController.createAppointment
);

export { router as patientDashboardRouter };
