import { EventEmitter } from "events";
import { prisma } from "../config/database.js";

interface CreateDeviceInput {
  patientId: string;
  type: string;
  status?: string;
  battery?: number;
  metadata?: any;
}

interface UpdateDeviceInput {
  type?: string;
  status?: string;
  battery?: number;
  metadata?: any;
}

interface CreateSignalInput {
  deviceId: string;
  patientId: string;
  type: "ecg" | "ppg" | "spo2" | "heartrate" | "temperature" | "bloodPressure" | "glucose";
  value: any;
  unit?: string;
  metadata?: any;
}

interface SignalThresholds {
  [key: string]: {
    min?: number;
    max?: number;
    criticalMin?: number;
    criticalMax?: number;
  };
}

// Define normal ranges for vital signs
const SIGNAL_THRESHOLDS: SignalThresholds = {
  heartrate: {
    min: 60,
    max: 100,
    criticalMin: 40,
    criticalMax: 150,
  },
  spo2: {
    min: 95,
    criticalMin: 90,
  },
  temperature: {
    min: 36.5,
    max: 37.5,
    criticalMin: 35,
    criticalMax: 39,
  },
  bloodPressure: {
    // Systolic
    max: 140,
    criticalMax: 180,
  },
  glucose: {
    min: 70,
    max: 140,
    criticalMin: 50,
    criticalMax: 250,
  },
};

/**
 * Devices Service for IoT device management
 */
export class DevicesService extends EventEmitter {
  /**
   * Get all devices for a patient
   */
  async getDevices(patientId?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const where = patientId ? { patientId } : {};

    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.device.count({ where }),
    ]);

    return {
      devices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get device by ID
   */
  async getDeviceById(deviceId: string) {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!device) {
      throw new Error("Device not found");
    }

    return device;
  }

  /**
   * Create a new device
   */
  async createDevice(data: CreateDeviceInput) {
    const device = await prisma.device.create({
      data: {
        patientId: data.patientId,
        type: data.type,
        status: (data.status as any) || "active",
        battery: data.battery || 100,
        metadata: data.metadata || {},
        lastSeenAt: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.emit("device:created", device);

    return device;
  }

  /**
   * Update device
   */
  async updateDevice(deviceId: string, data: UpdateDeviceInput) {
    const device = await prisma.device.update({
      where: { id: deviceId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status as any }),
        ...(data.battery !== undefined && { battery: data.battery }),
        ...(data.metadata && { metadata: data.metadata }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.emit("device:updated", device);

    return device;
  }

  /**
   * Delete device
   */
  async deleteDevice(deviceId: string) {
    await prisma.device.delete({
      where: { id: deviceId },
    });

    this.emit("device:deleted", { deviceId });

    return { message: "Device deleted successfully" };
  }

  /**
   * Get device status and latest signals
   */
  async getDeviceStatus(deviceId: string) {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!device) {
      throw new Error("Device not found");
    }

    // Get latest signals
    const latestSignals = await prisma.deviceSignal.findMany({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Check if device is online (seen in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = device.lastSeenAt && device.lastSeenAt > fiveMinutesAgo;

    return {
      device,
      isOnline,
      latestSignals,
    };
  }

  /**
   * Get device statistics
   */
  async getDeviceStatistics(patientId?: string) {
    const where = patientId ? { patientId } : {};

    const [total, byStatus, byType] = await Promise.all([
      prisma.device.count({ where }),
      prisma.device.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
      prisma.device.groupBy({
        by: ["type"],
        where,
        _count: true,
      }),
    ]);

    // Count online devices
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineCount = await prisma.device.count({
      where: {
        ...where,
        lastSeenAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    return {
      total,
      online: onlineCount,
      offline: total - onlineCount,
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    };
  }
}

/**
 * Signals Service for handling device signals
 */
export class SignalsService extends EventEmitter {
  /**
   * Create a new signal
   */
  async createSignal(data: CreateSignalInput) {
    // Verify device exists
    const device = await prisma.device.findUnique({
      where: { id: data.deviceId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!device) {
      throw new Error("Device not found");
    }

    // Create signal
    const signal = await prisma.deviceSignal.create({
      data: {
        deviceId: data.deviceId,
        patientId: data.patientId,
        type: data.type,
        value: data.value,
        metadata: {
          ...(data.metadata || {}),
          ...(data.unit ? { unit: data.unit } : {}),
        },
      },
    });

    // Update device's lastSeenAt
    await prisma.device.update({
      where: { id: data.deviceId },
      data: { lastSeenAt: new Date() },
    });

    // Emit event
    this.emit("signal:created", signal);

    // Check thresholds and create alerts if needed
    await this.checkThresholdsAndAlert(signal, device);

    return signal;
  }

  /**
   * Get signals for a device or patient
   */
  async getSignals(
    filters: {
      deviceId?: string;
      patientId?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    },
    page: number = 1,
    limit: number = 100
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.deviceId) where.deviceId = filters.deviceId;
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.type) where.type = filters.type;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [signals, total] = await Promise.all([
      prisma.deviceSignal.findMany({
        where,
        include: {
          device: {
            select: {
              id: true,
              type: true,
              status: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.deviceSignal.count({ where }),
    ]);

    return {
      signals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get signal statistics
   */
  async getSignalStatistics(
    filters: {
      deviceId?: string;
      patientId?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const where: any = {};

    if (filters.deviceId) where.deviceId = filters.deviceId;
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.type) where.type = filters.type;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [total, byType] = await Promise.all([
      prisma.deviceSignal.count({ where }),
      prisma.deviceSignal.groupBy({
        by: ["type"],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    };
  }

  /**
   * Get latest signal for each type
   */
  async getLatestSignals(deviceId: string) {
    const types = ["ecg", "ppg", "spo2", "heartrate", "temperature", "bloodPressure", "glucose"];

    const latestSignals = await Promise.all(
      types.map(async (type) => {
        const signal = await prisma.deviceSignal.findFirst({
          where: {
            deviceId,
            type: type as any,
          },
          orderBy: { createdAt: "desc" },
        });

        return signal ? { type, signal } : null;
      })
    );

    return latestSignals.filter(Boolean);
  }

  /**
   * Check signal thresholds and create alerts
   */
  private async checkThresholdsAndAlert(signal: any, device: any) {
    const thresholds = SIGNAL_THRESHOLDS[signal.type];
    if (!thresholds) return;

    let alertType: string | null = null;
    let severity: "low" | "medium" | "high" | "critical" = "low";
    let message = "";

    // Extract numeric value (handle different value formats)
    let numericValue: number | null = null;

    if (typeof signal.value === "number") {
      numericValue = signal.value;
    } else if (typeof signal.value === "object") {
      // For blood pressure, check systolic
      if (signal.type === "bloodPressure" && signal.value.systolic) {
        numericValue = signal.value.systolic;
      } else if (signal.value.value !== undefined) {
        numericValue = signal.value.value;
      }
    }

    if (numericValue === null) return;

    // Check critical thresholds
    if (thresholds.criticalMin !== undefined && numericValue < thresholds.criticalMin) {
      alertType = `${signal.type}_critical_low`;
      severity = "critical";
      message = `Critical: ${signal.type} too low (${numericValue})`;
    } else if (thresholds.criticalMax !== undefined && numericValue > thresholds.criticalMax) {
      alertType = `${signal.type}_critical_high`;
      severity = "critical";
      message = `Critical: ${signal.type} too high (${numericValue})`;
    }
    // Check warning thresholds
    else if (thresholds.min !== undefined && numericValue < thresholds.min) {
      alertType = `${signal.type}_low`;
      severity = "medium";
      message = `Warning: ${signal.type} below normal (${numericValue})`;
    } else if (thresholds.max !== undefined && numericValue > thresholds.max) {
      alertType = `${signal.type}_high`;
      severity = "medium";
      message = `Warning: ${signal.type} above normal (${numericValue})`;
    }

    // Create alert if threshold violated
    if (alertType) {
      const { alertsService } = await import("./alerts-notifications.service");

      const userId = device.patientId ?? null;
      if (!userId) return;

      await alertsService.createAlert({
        userId,
        patientId: device.patientId,
        type: alertType,
        severity,
        message,
        metadata: {
          deviceId: device.id,
          signalId: signal.id,
          signalType: signal.type,
          value: numericValue,
          threshold: thresholds,
        },
      });
    }
  }

  /**
   * Delete old signals (cleanup)
   */
  async cleanupOldSignals(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.deviceSignal.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      deleted: result.count,
      message: `Deleted ${result.count} signals older than ${daysToKeep} days`,
    };
  }
}

export const devicesService = new DevicesService();
export const signalsService = new SignalsService();
