import { Request, Response } from "express";
import {
  alertsService,
  notificationsService,
} from "../services/alerts-notifications.service";

/**
 * Alerts Controller
 */
export class AlertsController {
  /**
   * GET /api/alerts
   * Get alerts for the authenticated user
   */
  async getAlerts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { severity, status, page = "1", limit = "20" } = req.query;

      const result = await alertsService.getAlerts({
        userId,
        severity: severity as any,
        status: status as any,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      return res.json(result);
    } catch (error: any) {
      console.error("Get alerts error:", error);
      return res.status(500).json({ message: error.message || "Failed to get alerts" });
    }
  }

  /**
   * GET /api/alerts/:id
   * Get single alert by ID
   */
  async getAlertById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Alert id is required" });
      }
      const alert = await alertsService.getAlertById(id);

      return res.json(alert);
    } catch (error: any) {
      console.error("Get alert error:", error);
      return res.status(404).json({ message: error.message || "Alert not found" });
    }
  }

  /**
   * POST /api/alerts
   * Create a new alert
   */
  async createAlert(req: Request, res: Response) {
    try {
      const alert = await alertsService.createAlert(req.body);
      return res.status(201).json(alert);
    } catch (error: any) {
      console.error("Create alert error:", error);
      return res.status(400).json({ message: error.message || "Failed to create alert" });
    }
  }

  /**
   * PUT /api/alerts/:id/acknowledge
   * Acknowledge an alert
   */
  async acknowledgeAlert(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      if (!id) {
        return res.status(400).json({ message: "Alert id is required" });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const alert = await alertsService.acknowledgeAlert(id, userId);
      return res.json(alert);
    } catch (error: any) {
      console.error("Acknowledge alert error:", error);
      return res.status(400).json({ message: error.message || "Failed to acknowledge alert" });
    }
  }

  /**
   * PUT /api/alerts/:id/resolve
   * Resolve an alert
   */
  async resolveAlert(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      if (!id) {
        return res.status(400).json({ message: "Alert id is required" });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const alert = await alertsService.resolveAlert(id, userId);
      return res.json(alert);
    } catch (error: any) {
      console.error("Resolve alert error:", error);
      return res.status(400).json({ message: error.message || "Failed to resolve alert" });
    }
  }

  /**
   * GET /api/alerts/statistics
   * Get alert statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const stats = await alertsService.getAlertStatistics(userId);

      return res.json(stats);
    } catch (error: any) {
      console.error("Get alert statistics error:", error);
      return res.status(500).json({ message: error.message || "Failed to get statistics" });
    }
  }

  /**
   * DELETE /api/alerts/cleanup
   * Cleanup old resolved alerts (admin only)
   */
  async cleanup(req: Request, res: Response) {
    try {
      const { days = "90" } = req.query;
      const result = await alertsService.cleanupOldAlerts(parseInt(days as string));

      return res.json(result);
    } catch (error: any) {
      console.error("Cleanup alerts error:", error);
      return res.status(500).json({ message: error.message || "Failed to cleanup alerts" });
    }
  }
}

/**
 * Notifications Controller
 */
export class NotificationsController {
  /**
   * GET /api/notifications
   * Get notifications for the authenticated user
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { unreadOnly } = req.query;

      const result = await notificationsService.getNotifications(userId, unreadOnly === "true");

      return res.json(result);
    } catch (error: any) {
      console.error("Get notifications error:", error);
      return res.status(500).json({ message: error.message || "Failed to get notifications" });
    }
  }

  /**
   * POST /api/notifications
   * Create a notification (system use)
   */
  async createNotification(req: Request, res: Response) {
    try {
      const notification = await notificationsService.createNotification(req.body);
      return res.status(201).json(notification);
    } catch (error: any) {
      console.error("Create notification error:", error);
      return res.status(400).json({ message: error.message || "Failed to create notification" });
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      if (!id) {
        return res.status(400).json({ message: "Notification id is required" });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const notification = await notificationsService.markAsRead(id, userId);
      return res.json(notification);
    } catch (error: any) {
      console.error("Mark notification as read error:", error);
      return res.status(400).json({ message: error.message || "Failed to mark as read" });
    }
  }

  /**
   * PUT /api/notifications/read-all
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await notificationsService.markAllAsRead(userId);
      return res.json(result);
    } catch (error: any) {
      console.error("Mark all as read error:", error);
      return res.status(500).json({ message: error.message || "Failed to mark all as read" });
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      if (!id) {
        return res.status(400).json({ message: "Notification id is required" });
      }
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await notificationsService.deleteNotification(id, userId);
      return res.json(result);
    } catch (error: any) {
      console.error("Delete notification error:", error);
      return res.status(400).json({ message: error.message || "Failed to delete notification" });
    }
  }

  /**
   * GET /api/notifications/statistics
   * Get notification statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const stats = await notificationsService.getStatistics(userId);
      return res.json(stats);
    } catch (error: any) {
      console.error("Get notification statistics error:", error);
      return res.status(500).json({ message: error.message || "Failed to get statistics" });
    }
  }

  /**
   * DELETE /api/notifications/cleanup
   * Cleanup old read notifications (admin only)
   */
  async cleanup(req: Request, res: Response) {
    try {
      const { days = "30" } = req.query;
      const result = await notificationsService.cleanupOldNotifications(parseInt(days as string));

      return res.json(result);
    } catch (error: any) {
      console.error("Cleanup notifications error:", error);
      return res.status(500).json({ message: error.message || "Failed to cleanup notifications" });
    }
  }
}

export const alertsController = new AlertsController();
export const notificationsController = new NotificationsController();
