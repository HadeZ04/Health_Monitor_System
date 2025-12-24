import type { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { monitoringService } from '../services/monitoring.service';
import { reportsService } from '../services/reports.service';

/**
 * Analytics Controller
 */
export class AnalyticsController {
  /**
   * GET /api/analytics/overview
   */
  async getOverview(req: Request, res: Response) {
    try {
      const { from, to, type } = req.query;

      const result = await analyticsService.getOverview({
        from: from as string,
        to: to as string,
        type: type as string,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch analytics overview',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/analytics/patients
   */
  async getPatientAnalytics(_req: Request, res: Response) {
    try {
      const result = await analyticsService.getPatientAnalytics();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch patient analytics',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/analytics/doctors
   */
  async getDoctorAnalytics(_req: Request, res: Response) {
    try {
      const result = await analyticsService.getDoctorAnalytics();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch doctor analytics',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/analytics/appointments
   */
  async getAppointmentAnalytics(_req: Request, res: Response) {
    try {
      const result = await analyticsService.getAppointmentAnalytics();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch appointment analytics',
        message: error.message,
      });
    }
  }
}

/**
 * Monitoring Controller
 */
export class MonitoringController {
  /**
   * GET /api/monitoring/dashboard
   */
  async getDashboard(_req: Request, res: Response) {
    try {
      const result = await monitoringService.getDashboard();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch monitoring dashboard',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/monitoring/metrics
   */
  async getMetrics(_req: Request, res: Response) {
    try {
      const result = await monitoringService.getRealTimeMetrics();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch metrics',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/monitoring/alerts/statistics
   */
  async getAlertStatistics(req: Request, res: Response) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const result = await monitoringService.getAlertStatistics(days);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch alert statistics',
        message: error.message,
      });
    }
  }

  /**
   * GET /api/monitoring/devices/statistics
   */
  async getDeviceStatistics(_req: Request, res: Response) {
    try {
      const result = await monitoringService.getDeviceStatistics();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch device statistics',
        message: error.message,
      });
    }
  }
}

/**
 * Reports Controller
 */
export class ReportsController {
  /**
   * GET /api/reports/:patientId
   */
  async getReportsByPatient(req: Request, res: Response) {
    try {
      const patientId = req.params.patientId;
      if (!patientId) {
        res.status(400).json({ error: 'patientId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const reports = await reportsService.getReportsByPatient(patientId, userId, userRole);
      res.json(reports);
    } catch (error: any) {
      if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({
          error: 'Failed to fetch reports',
          message: error.message,
        });
      }
    }
  }

  /**
   * GET /api/reports/detail/:reportId
   */
  async getReportById(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const report = await reportsService.getReportById(reportId, userId, userRole);
      res.json(report);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({
          error: 'Failed to fetch report',
          message: error.message,
        });
      }
    }
  }

  /**
   * POST /api/reports
   */
  async createReport(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const data = {
        ...req.body,
        createdBy: userId,
      };

      const report = await reportsService.createReport(data);
      res.status(201).json(report);
    } catch (error: any) {
      if (error.message === 'Patient not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({
          error: 'Failed to create report',
          message: error.message,
        });
      }
    }
  }

  /**
   * PUT /api/reports/:reportId
   */
  async updateReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const report = await reportsService.updateReport(reportId, req.body, userId, userRole);
      res.json(report);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({
          error: 'Failed to update report',
          message: error.message,
        });
      }
    }
  }

  /**
   * DELETE /api/reports/:reportId
   */
  async deleteReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const result = await reportsService.deleteReport(reportId, userId, userRole);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({
          error: 'Failed to delete report',
          message: error.message,
        });
      }
    }
  }

  /**
   * GET /api/reports/:reportId/download
   */
  async downloadReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const result = await reportsService.downloadReport(reportId, userId, userRole);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Report has no file attached') {
        res.status(400).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({
          error: 'Failed to download report',
          message: error.message,
        });
      }
    }
  }

  /**
   * POST /api/reports/:reportId/share
   */
  async shareReport(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const result = await reportsService.shareReport(reportId, req.body, userId, userRole);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({
          error: 'Failed to share report',
          message: error.message,
        });
      }
    }
  }

  /**
   * GET /api/reports/shared/:shareToken (Public access)
   */
  async getSharedReport(req: Request, res: Response) {
    try {
      const shareToken = req.params.shareToken;
      if (!shareToken) {
        res.status(400).json({ error: 'shareToken is required' });
        return;
      }

      const report = await reportsService.getReportByShareToken(shareToken);
      res.json(report);
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('invalid')) {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('expired')) {
        res.status(410).json({ error: error.message });
      } else {
        res.status(500).json({
          error: 'Failed to access shared report',
          message: error.message,
        });
      }
    }
  }

  /**
   * DELETE /api/reports/:reportId/share
   */
  async revokeShareLink(req: Request, res: Response) {
    try {
      const reportId = req.params.reportId;
      if (!reportId) {
        res.status(400).json({ error: 'reportId is required' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user?.role?.name ?? '';

      const result = await reportsService.revokeShareLink(reportId, userId, userRole);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message?.includes('permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({
          error: 'Failed to revoke share link',
          message: error.message,
        });
      }
    }
  }
}

export const analyticsController = new AnalyticsController();
export const monitoringController = new MonitoringController();
export const reportsController = new ReportsController();
