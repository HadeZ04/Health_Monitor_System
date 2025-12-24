import { Router } from "express";
import { alertsController, notificationsController } from "../controllers/alerts-notifications.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Alerts Routes
 * All routes require authentication
 * 
 * WebSocket endpoint for real-time alerts:
 * ws://server/alerts/stream?token=JWT
 */

// Get alerts
router.get("/", authenticateJWT, alertsController.getAlerts.bind(alertsController));

// Get single alert
router.get("/:id", authenticateJWT, alertsController.getAlertById.bind(alertsController));

// Create alert (system use or admin)
router.post("/", authenticateJWT, alertsController.createAlert.bind(alertsController));

// Acknowledge alert
router.put("/:id/acknowledge", authenticateJWT, alertsController.acknowledgeAlert.bind(alertsController));

// Resolve alert
router.put("/:id/resolve", authenticateJWT, alertsController.resolveAlert.bind(alertsController));

// Get statistics
router.get("/statistics/summary", authenticateJWT, alertsController.getStatistics.bind(alertsController));

// Cleanup old alerts (admin only)
router.delete("/cleanup", authenticateJWT, alertsController.cleanup.bind(alertsController));

export default router;
