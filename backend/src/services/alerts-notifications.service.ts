import { PrismaClient, AlertSeverity, AlertStatus } from "@prisma/client";
import { EventEmitter } from "events";

const prisma = new PrismaClient();

interface CreateAlertInput {
  userId?: string;
  patientId?: string;
  doctorId?: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  metadata?: any;
}

interface AlertQuery {
  userId?: string;
  severity?: AlertSeverity;
  status?: AlertStatus;
  page?: number;
  limit?: number;
}

/**
 * Alerts Service with EventEmitter for real-time notifications
 */
export class AlertsService extends EventEmitter {
  /**
   * Get alerts with filters and pagination
   */
  async getAlerts(query: AlertQuery) {
    const { userId, severity, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.OR = [
        { userId },
        { patientId: userId },
        { doctorId: userId },
      ];
    }

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { severity: "desc" }, // Critical first
          { createdAt: "desc" },
        ],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.alert.count({ where }),
    ]);

    return {
      alerts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new alert
   */
  async createAlert(data: CreateAlertInput) {
    const alert = await prisma.alert.create({
      data: {
        userId: data.userId,
        patientId: data.patientId,
        doctorId: data.doctorId,
        type: data.type,
        severity: data.severity,
        message: data.message,
        metadata: data.metadata,
        status: "new",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit event for WebSocket broadcast
    this.emit("alert:created", alert);

    // Also create a notification
    if (alert.userId) {
      await notificationsService.createNotification({
        userId: alert.userId,
        type: "alert",
        message: alert.message,
        data: {
          alertId: alert.id,
          severity: alert.severity,
          type: alert.type,
        },
      });
    }

    return alert;
  }

  /**
   * Get single alert by ID
   */
  async getAlertById(alertId: string) {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!alert) {
      throw new Error("Alert not found");
    }

    return alert;
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, userId: string) {
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "acknowledged",
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit event
    this.emit("alert:acknowledged", alert);

    return alert;
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string, userId: string) {
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "resolved",
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit event
    this.emit("alert:resolved", alert);

    return alert;
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(userId?: string) {
    const where: any = userId
      ? {
          OR: [{ userId }, { patientId: userId }, { doctorId: userId }],
        }
      : {};

    const [totalAlerts, newAlerts, acknowledgedAlerts, resolvedAlerts, criticalAlerts] =
      await Promise.all([
        prisma.alert.count({ where }),
        prisma.alert.count({ where: { ...where, status: "new" } }),
        prisma.alert.count({ where: { ...where, status: "acknowledged" } }),
        prisma.alert.count({ where: { ...where, status: "resolved" } }),
        prisma.alert.count({ where: { ...where, severity: "critical" } }),
      ]);

    // Get alerts by severity
    const bySeverity = await prisma.alert.groupBy({
      by: ["severity"],
      where,
      _count: true,
    });

    // Get alerts by type
    const byType = await prisma.alert.groupBy({
      by: ["type"],
      where,
      _count: true,
      orderBy: {
        _count: {
          type: "desc",
        },
      },
      take: 10,
    });

    return {
      totalAlerts,
      newAlerts,
      acknowledgedAlerts,
      resolvedAlerts,
      criticalAlerts,
      bySeverity: bySeverity.map((s) => ({
        severity: s.severity,
        count: s._count,
      })),
      byType: byType.map((t) => ({
        type: t.type,
        count: t._count,
      })),
    };
  }

  /**
   * Delete old resolved alerts (cleanup)
   */
  async cleanupOldAlerts(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.alert.deleteMany({
      where: {
        status: "resolved",
        resolvedAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      deleted: result.count,
      message: `Deleted ${result.count} old alerts`,
    };
  }
}

/**
 * Notifications Service
 */
export class NotificationsService extends EventEmitter {
  /**
   * Get notifications for a user
   */
  async getNotifications(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };

    if (unreadOnly) {
      where.unread = true;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, unread: true },
    });

    return {
      notifications,
      unreadCount,
    };
  }

  /**
   * Create a new notification
   */
  async createNotification(data: {
    userId: string;
    type: string;
    message: string;
    data?: any;
  }) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        data: data.data,
        unread: true,
      },
    });

    // Emit event for WebSocket broadcast
    this.emit("notification:created", notification);

    return notification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { unread: false },
    });

    return updated;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        unread: true,
      },
      data: {
        unread: false,
      },
    });

    return {
      updated: result.count,
      message: `Marked ${result.count} notifications as read`,
    };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: "Notification deleted successfully" };
  }

  /**
   * Delete old notifications (cleanup)
   */
  async cleanupOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        unread: false,
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      deleted: result.count,
      message: `Deleted ${result.count} old notifications`,
    };
  }

  /**
   * Get notification statistics for a user
   */
  async getStatistics(userId: string) {
    const [total, unread, byType] = await Promise.all([
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, unread: true } }),
      prisma.notification.groupBy({
        by: ["type"],
        where: { userId },
        _count: true,
        orderBy: {
          _count: {
            type: "desc",
          },
        },
      }),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.map((t) => ({
        type: t.type,
        count: t._count,
      })),
    };
  }
}

export const alertsService = new AlertsService();
export const notificationsService = new NotificationsService();
