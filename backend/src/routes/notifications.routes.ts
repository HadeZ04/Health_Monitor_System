import { Router } from "express";
import { notificationsController } from "../controllers/alerts-notifications.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Notifications Routes
 * All routes require authentication
 * Users can only access their own notifications
 */

// Get notifications
router.get("/", authenticateJWT, notificationsController.getNotifications.bind(notificationsController));

// Create notification (system use)
router.post("/", authenticateJWT, notificationsController.createNotification.bind(notificationsController));

// Mark notification as read
router.put("/:id/read", authenticateJWT, notificationsController.markAsRead.bind(notificationsController));

// Mark all notifications as read
router.put("/read-all", authenticateJWT, notificationsController.markAllAsRead.bind(notificationsController));

// Delete notification
router.delete("/:id", authenticateJWT, notificationsController.deleteNotification.bind(notificationsController));

// Get statistics
router.get("/statistics/summary", authenticateJWT, notificationsController.getStatistics.bind(notificationsController));

// Cleanup old notifications (admin only)
router.delete("/cleanup", authenticateJWT, notificationsController.cleanup.bind(notificationsController));

export default router;
