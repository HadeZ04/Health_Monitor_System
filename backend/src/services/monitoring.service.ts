import { prisma } from '../config/database.js';
import { EventEmitter } from "events";

interface SystemMetrics {
  timestamp: Date;
  activeUsers: number;
  activePatients: number;
  activeDoctors: number;
  ongoingConsultations: number;
  pendingAlerts: number;
  systemLoad: {
    cpu: number;
    memory: number;
  };
}

interface AlertMetric {
  id: string;
  type: string;
  severity: string;
  patientId?: string;
  message: string;
  timestamp: Date;
}

/**
 * Monitoring Service for real-time system metrics
 * Extends EventEmitter to broadcast metrics via WebSocket
 */
export class MonitoringService extends EventEmitter {
  private metricsInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  /**
   * Get current dashboard metrics
   */
  async getDashboard() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalPatients,
      activePatients,
      totalDoctors,
      activeDoctors,
      ongoingConsultations,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      recentAlerts,
      highRiskPatients,
    ] = await Promise.all([
      prisma.patientProfile.count(),
      prisma.patientProfile.count({ where: { status: "active" } }),
      prisma.doctorProfile.count(),
      prisma.doctorProfile.count({ where: { status: "active" } }),
      prisma.consultation.count({
        where: { status: "inProgress" },
      }),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lt: new Date(now.setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          status: "pending",
        },
      }),
      prisma.appointment.count({
        where: {
          status: "confirmed",
          date: { gte: last24Hours },
        },
      }),
      prisma.alert.count({
        where: {
          createdAt: { gte: last24Hours },
        },
      }),
      prisma.patientProfile.count({
        where: { riskLevel: "high" },
      }),
    ]);

    // Get recent activity
    const recentActivity = await this.getRecentActivity();

    // System health
    const systemHealth = this.getSystemHealth();

    return {
      metrics: {
        totalPatients,
        activePatients,
        totalDoctors,
        activeDoctors,
        ongoingConsultations,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        recentAlerts,
        highRiskPatients,
      },
      recentActivity,
      systemHealth,
      timestamp: new Date(),
    };
  }

  /**
   * Get real-time metrics for WebSocket streaming
   */
  async getRealTimeMetrics(): Promise<SystemMetrics> {
    const [
      activeUsers,
      activePatients,
      activeDoctors,
      ongoingConsultations,
      pendingAlerts,
    ] = await Promise.all([
      prisma.user.count({ where: { status: "active" } }),
      prisma.patientProfile.count({ where: { status: "active" } }),
      prisma.doctorProfile.count({ where: { status: "active" } }),
      prisma.consultation.count({ where: { status: "inProgress" } }),
      prisma.alert.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
          },
        },
      }),
    ]);

    return {
      timestamp: new Date(),
      activeUsers,
      activePatients,
      activeDoctors,
      ongoingConsultations,
      pendingAlerts,
      systemLoad: this.getSystemLoad(),
    };
  }

  /**
   * Start monitoring and emit metrics at intervals
   */
  startMonitoring(intervalMs: number = 5000) {
    if (this.isMonitoring) {
      console.log("Monitoring already started");
      return;
    }

    this.isMonitoring = true;
    console.log(`Starting monitoring with ${intervalMs}ms interval`);

    this.metricsInterval = setInterval(async () => {
      try {
        const metrics = await this.getRealTimeMetrics();
        this.emit("metrics", metrics);
      } catch (error) {
        console.error("Error collecting metrics:", error);
        this.emit("error", error);
      }
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
      this.isMonitoring = false;
      console.log("Monitoring stopped");
    }
  }

  /**
   * Broadcast alert event
   */
  async broadcastAlert(alert: AlertMetric) {
    this.emit("alert", alert);
  }

  /**
   * Get recent activity log
   */
  private async getRecentActivity() {
    const recentLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      recentLogs.map(async (log) => {
        const user = await prisma.user.findUnique({
          where: { id: log.userId },
          select: { name: true, email: true },
        });

        return {
          id: log.id,
          action: log.action,
          user: user?.name || user?.email || "Unknown",
          targetType: log.targetType,
          severity: log.severity,
          timestamp: log.createdAt,
        };
      })
    );
  }

  /**
   * Get system health status
   */
  private getSystemHealth() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      status: "healthy", // In production, implement actual health checks
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      },
      database: "connected", // In production, check actual DB connection
    };
  }

  /**
   * Simulate system load (in production, use actual metrics)
   */
  private getSystemLoad() {
    return {
      cpu: Math.random() * 100, // Simulated CPU usage
      memory: Math.random() * 100, // Simulated memory usage
    };
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(days: number = 7) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const alerts = await prisma.alert.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        type: true,
        createdAt: true,
      },
    });

    // Group by type
    const typeCount = new Map<string, number>();
    alerts.forEach((alert) => {
      typeCount.set(alert.type, (typeCount.get(alert.type) || 0) + 1);
    });

    // Group by day
    const dailyCount = new Map<string, number>();
    alerts.forEach((alert) => {
      const day = alert.createdAt.toISOString().slice(0, 10);
      dailyCount.set(day, (dailyCount.get(day) || 0) + 1);
    });

    return {
      totalAlerts: alerts.length,
      byType: Array.from(typeCount.entries()).map(([type, count]) => ({
        type,
        count,
      })),
      byDay: Array.from(dailyCount.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  /**
   * Get device statistics
   */
  async getDeviceStatistics() {
    const devices = await prisma.device.findMany({
      select: {
        status: true,
        battery: true,
      },
    });

    const statusCount = new Map<string, number>();
    let totalBattery = 0;
    let batteryCount = 0;

    devices.forEach((device) => {
      statusCount.set(device.status, (statusCount.get(device.status) || 0) + 1);
      if (device.battery !== null) {
        totalBattery += device.battery;
        batteryCount++;
      }
    });

    return {
      total: devices.length,
      byStatus: Array.from(statusCount.entries()).map(([status, count]) => ({
        status,
        count,
      })),
      avgBattery: batteryCount > 0 ? Math.round(totalBattery / batteryCount) : 0,
    };
  }
}

export const monitoringService = new MonitoringService();
