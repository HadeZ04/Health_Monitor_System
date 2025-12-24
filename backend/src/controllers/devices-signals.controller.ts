import type { Request, Response } from 'express';
import { devicesService, signalsService } from '../services/devices-signals.service';

const getRoleName = (req: Request): string | undefined => req.user?.role?.name;

const requireAuth = (
  req: Request,
  res: Response
): { userId: string; role: string } | null => {
  const userId = req.user?.id;
  const role = getRoleName(req);
  if (!userId || !role) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return { userId, role };
};

const isPrivileged = (role: string) => role === 'admin' || role === 'doctor';

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asInt = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'string' ? parseInt(value, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Devices Controller for IoT device management
 */
export class DevicesController {
  /**
   * GET /api/devices
   * Get all devices (admin/doctor) or patient's devices
   */
  async getDevices(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const page = asInt(req.query.page, 1);
      const limit = asInt(req.query.limit, 20);

      let patientId = asString(req.query.patientId);
      if (!isPrivileged(auth.role)) {
        patientId = auth.userId;
      }

      const result = await devicesService.getDevices(patientId, page, limit);
      res.json(result);
    } catch (error: any) {
      console.error('Get devices error:', error);
      res.status(500).json({ message: error.message || 'Failed to get devices' });
    }
  }

  /**
   * GET /api/devices/:id
   * Get device by ID
   */
  async getDeviceById(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Device id is required' });
        return;
      }

      const device = await devicesService.getDeviceById(id);

      if (!isPrivileged(auth.role) && device.patientId !== auth.userId) {
        res.status(403).json({ message: 'Forbidden: Not your device' });
        return;
      }

      res.json(device);
    } catch (error: any) {
      console.error('Get device error:', error);
      res.status(404).json({ message: error.message || 'Device not found' });
    }
  }

  /**
   * POST /api/devices
   * Create a new device
   */
  async createDevice(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      if (!isPrivileged(auth.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const device = await devicesService.createDevice(req.body);
      res.status(201).json(device);
    } catch (error: any) {
      console.error('Create device error:', error);
      res.status(400).json({ message: error.message || 'Failed to create device' });
    }
  }

  /**
   * PUT /api/devices/:id
   * Update device
   */
  async updateDevice(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      if (!isPrivileged(auth.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Device id is required' });
        return;
      }

      const device = await devicesService.updateDevice(id, req.body);
      res.json(device);
    } catch (error: any) {
      console.error('Update device error:', error);
      res.status(400).json({ message: error.message || 'Failed to update device' });
    }
  }

  /**
   * DELETE /api/devices/:id
   * Delete device
   */
  async deleteDevice(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      if (!isPrivileged(auth.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Device id is required' });
        return;
      }

      const result = await devicesService.deleteDevice(id);
      res.json(result);
    } catch (error: any) {
      console.error('Delete device error:', error);
      res.status(400).json({ message: error.message || 'Failed to delete device' });
    }
  }

  /**
   * GET /api/devices/:id/status
   * Get device status and latest signals
   */
  async getDeviceStatus(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Device id is required' });
        return;
      }

      const status = await devicesService.getDeviceStatus(id);

      if (!isPrivileged(auth.role) && status.device.patientId !== auth.userId) {
        res.status(403).json({ message: 'Forbidden: Not your device' });
        return;
      }

      res.json(status);
    } catch (error: any) {
      console.error('Get device status error:', error);
      res.status(404).json({ message: error.message || 'Device not found' });
    }
  }

  /**
   * GET /api/devices/statistics/summary
   * Get device statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      let patientId = asString(req.query.patientId);
      if (!isPrivileged(auth.role)) {
        patientId = auth.userId;
      }

      const stats = await devicesService.getDeviceStatistics(patientId);
      res.json(stats);
    } catch (error: any) {
      console.error('Get device statistics error:', error);
      res.status(500).json({ message: error.message || 'Failed to get statistics' });
    }
  }
}

/**
 * Signals Controller for IoT signal data
 */
export class SignalsController {
  /**
   * POST /api/signals
   * Create a new signal
   */
  async createSignal(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const payload = req.body as any;
      if (!payload?.deviceId) {
        res.status(400).json({ message: 'deviceId is required' });
        return;
      }

      if (!isPrivileged(auth.role)) {
        payload.patientId = auth.userId;
      }

      if (!payload.patientId) {
        res.status(400).json({ message: 'patientId is required' });
        return;
      }

      const signal = await signalsService.createSignal(payload);
      res.status(201).json(signal);
    } catch (error: any) {
      console.error('Create signal error:', error);
      res.status(400).json({ message: error.message || 'Failed to create signal' });
    }
  }

  /**
   * GET /api/signals
   * Get signals with filters
   */
  async getSignals(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const page = asInt(req.query.page, 1);
      const limit = asInt(req.query.limit, 100);

      let patientId = asString(req.query.patientId);
      if (!isPrivileged(auth.role)) {
        patientId = auth.userId;
      }

      const filters = {
        deviceId: asString(req.query.deviceId),
        patientId,
        type: asString(req.query.type),
        startDate: asString(req.query.startDate)
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: asString(req.query.endDate) ? new Date(req.query.endDate as string) : undefined,
      };

      const result = await signalsService.getSignals(filters, page, limit);
      res.json(result);
    } catch (error: any) {
      console.error('Get signals error:', error);
      res.status(500).json({ message: error.message || 'Failed to get signals' });
    }
  }

  /**
   * GET /api/signals/statistics
   * Get signal statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      let patientId = asString(req.query.patientId);
      if (!isPrivileged(auth.role)) {
        patientId = auth.userId;
      }

      const filters = {
        deviceId: asString(req.query.deviceId),
        patientId,
        type: asString(req.query.type),
        startDate: asString(req.query.startDate)
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: asString(req.query.endDate) ? new Date(req.query.endDate as string) : undefined,
      };

      const stats = await signalsService.getSignalStatistics(filters);
      res.json(stats);
    } catch (error: any) {
      console.error('Get signal statistics error:', error);
      res.status(500).json({ message: error.message || 'Failed to get statistics' });
    }
  }

  /**
   * GET /api/devices/:deviceId/signals/latest
   * Get latest signal for each type
   */
  async getLatestSignals(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const deviceId = req.params.deviceId;
      if (!deviceId) {
        res.status(400).json({ message: 'deviceId is required' });
        return;
      }

      const signals = await signalsService.getLatestSignals(deviceId);
      res.json(signals);
    } catch (error: any) {
      console.error('Get latest signals error:', error);
      res.status(500).json({ message: error.message || 'Failed to get latest signals' });
    }
  }

  /**
   * DELETE /api/signals/cleanup
   * Cleanup old signals (admin only)
   */
  async cleanup(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      if (auth.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const days = asInt(req.query.days, 90);
      const result = await signalsService.cleanupOldSignals(days);
      res.json(result);
    } catch (error: any) {
      console.error('Cleanup signals error:', error);
      res.status(500).json({ message: error.message || 'Failed to cleanup signals' });
    }
  }
}

export const devicesController = new DevicesController();
export const signalsController = new SignalsController();
