import { Router } from "express";
import { analyticsController } from "../controllers/analytics-monitoring-reports.controller";
import { authenticateJWT } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

// All analytics routes require authentication
router.use(authenticateJWT);

// Require admin or doctor role for analytics
router.use(requireRole(["admin", "doctor"]));

/**
 * GET /api/analytics/overview
 * Get overview analytics with date range filter
 */
router.get("/overview", analyticsController.getOverview.bind(analyticsController));

/**
 * GET /api/analytics/patients
 * Get patient analytics
 */
router.get("/patients", analyticsController.getPatientAnalytics.bind(analyticsController));

/**
 * GET /api/analytics/doctors
 * Get doctor analytics
 */
router.get("/doctors", analyticsController.getDoctorAnalytics.bind(analyticsController));

/**
 * GET /api/analytics/appointments
 * Get appointment analytics
 */
router.get("/appointments", analyticsController.getAppointmentAnalytics.bind(analyticsController));

export default router;
