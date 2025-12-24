import { Router } from "express";
import { monitoringController } from "../controllers/analytics-monitoring-reports.controller";
import { authenticateJWT } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

// All monitoring routes require authentication
router.use(authenticateJWT);

// Require admin or doctor role for monitoring
router.use(requireRole(["admin", "doctor"]));

/**
 * GET /api/monitoring/dashboard
 * Get monitoring dashboard with real-time metrics
 */
router.get("/dashboard", monitoringController.getDashboard.bind(monitoringController));

/**
 * GET /api/monitoring/metrics
 * Get current system metrics
 */
router.get("/metrics", monitoringController.getMetrics.bind(monitoringController));

/**
 * GET /api/monitoring/alerts/statistics
 * Get alert statistics
 */
router.get("/alerts/statistics", monitoringController.getAlertStatistics.bind(monitoringController));

/**
 * GET /api/monitoring/devices/statistics
 * Get device statistics
 */
router.get("/devices/statistics", monitoringController.getDeviceStatistics.bind(monitoringController));

/**
 * WebSocket endpoint for real-time monitoring
 * ws://server/monitoring/stream?token=<jwt_token>
 * Handled by monitoringWSServer in websocket/monitoringWS.ts
 */

export default router;
