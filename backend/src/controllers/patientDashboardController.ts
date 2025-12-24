/**
 * Patient Dashboard Controller
 * Handles HTTP requests for patient dashboard endpoints
 */

import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { patientDashboardService } from '../services/patientDashboardService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export class PatientDashboardController {
  /**
   * GET /api/patients/dashboard/:patientId
   * Get patient dashboard data
   */
  getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role?.name;

    logger.info('Dashboard request', { patientId, userId, userRole });

    if (!patientId) {
      throw new BadRequestError('patientId is required');
    }

    // Authorization check
    // Patient can only access their own dashboard
    // Doctor can access assigned patients' dashboards
    // Admin can access all dashboards
    if (userRole === 'patient') {
      const patientProfile = await prisma.patientProfile.findFirst({
        where: { id: patientId, userId },
      });

      if (!patientProfile) {
        throw new ForbiddenError('You can only access your own dashboard');
      }
    }

    // Fetch dashboard data
    const dashboardData = await patientDashboardService.getDashboard(patientId);

    return sendSuccess(
      res,
      dashboardData,
      'Dashboard data retrieved successfully'
    );
  });

  /**
   * GET /api/patients/:patientId/vitals
   * Get patient vitals history
   */
  getVitalsHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;
    const { type, from, to } = req.query;

    // TODO: Implement vitals history retrieval
    // This will query Signal table with filters

    return sendSuccess(
      res,
      [],
      'Vitals history retrieved successfully'
    );
  });

  /**
   * GET /api/patients/:patientId/appointments
   * Get patient appointments
   */
  getAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;

    // TODO: Implement when Appointments table is created

    return sendSuccess(
      res,
      [],
      'Appointments retrieved successfully'
    );
  });

  /**
   * POST /api/patients/:patientId/appointments
   * Create new appointment
   */
  createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.params;
    const appointmentData = req.body;

    // TODO: Implement appointment creation

    return sendSuccess(
      res,
      { id: '1', ...appointmentData },
      'Appointment created successfully',
      201
    );
  });
}

// Export singleton instance
export const patientDashboardController = new PatientDashboardController();

// Note: Import prisma at top level when needed
import { prisma } from '../config/database.js';
