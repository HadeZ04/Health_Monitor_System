/**
 * Patient Controller
 * Handles HTTP requests for patient-related endpoints
 */

import type { Request, Response } from 'express';
import * as patientService from '../services/patient.service';

const requireParam = (
  res: Response,
  value: string | undefined,
  name: string
): string | null => {
  if (!value) {
    res.status(400).json({ message: `${name} is required` });
    return null;
  }

  return value;
};

const requireAuth = (
  req: Request,
  res: Response
): { userId: string; userRole: string } | null => {
  const userId = req.user?.id;
  const userRole = req.user?.role?.name;

  if (!userId || !userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }

  return { userId, userRole };
};

const ensurePatientAccess = async (
  res: Response,
  userId: string,
  patientId: string,
  userRole: string
): Promise<boolean> => {
  const hasAccess = await patientService.verifyPatientAccess(userId, patientId, userRole);
  if (!hasAccess) {
    res.status(403).json({ message: 'Access denied' });
    return false;
  }

  return true;
};

/**
 * GET /api/patients/dashboard/:patientId
 * Get patient dashboard data
 */
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const dashboard = await patientService.getDashboard(patientId);
    res.json(dashboard);
  } catch (error: any) {
    console.error('Error getting dashboard:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/vitals
 * Get patient vitals history
 */
export const getVitals = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const { type, from, to, limit } = req.query;
    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const filters = {
      type: type as string | undefined,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const vitals = await patientService.getVitalsHistory(patientId, filters);
    res.json({ vitals });
  } catch (error: any) {
    console.error('Error getting vitals:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/appointments
 * Get patient appointments
 */
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const { status, from, to, upcoming } = req.query;
    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const filters = {
      status: status as string | undefined,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
      upcoming: upcoming === 'true',
    };

    const appointments = await patientService.getAppointments(patientId, filters);
    res.json({ appointments });
  } catch (error: any) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * POST /api/patients/:patientId/appointments
 * Create new appointment
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const data = {
      ...req.body,
      date: new Date(req.body.date),
    };

    const appointment = await patientService.createAppointment(patientId, data);
    res.status(201).json({ appointment });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * PUT /api/patients/:patientId/appointments/:appointmentId
 * Update appointment
 */
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;
    const appointmentId = requireParam(res, req.params.appointmentId, 'appointmentId');
    if (!appointmentId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const data = {
      ...req.body,
      ...(req.body.date && { date: new Date(req.body.date) }),
    };

    const appointment = await patientService.updateAppointment(
      patientId,
      appointmentId,
      data
    );
    res.json({ appointment });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * DELETE /api/patients/:patientId/appointments/:appointmentId
 * Delete appointment
 */
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;
    const appointmentId = requireParam(res, req.params.appointmentId, 'appointmentId');
    if (!appointmentId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    await patientService.deleteAppointment(patientId, appointmentId);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/medications
 * Get patient medications
 */
export const getMedications = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const medications = await patientService.getMedications(patientId);
    res.json({ medications });
  } catch (error: any) {
    console.error('Error getting medications:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/medications/schedule
 * Get medication schedule
 */
export const getMedicationSchedule = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const schedule = await patientService.getMedicationSchedule(patientId);
    res.json({ schedule });
  } catch (error: any) {
    console.error('Error getting medication schedule:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * POST /api/patients/:patientId/medications/:medicationId/take
 * Mark medication as taken
 */
export const takeMedication = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;
    const medicationId = requireParam(res, req.params.medicationId, 'medicationId');
    if (!medicationId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const data = {
      ...req.body,
      ...(req.body.timestamp && { timestamp: new Date(req.body.timestamp) }),
    };

    const result = await patientService.takeMedication(patientId, medicationId, data);
    res.json({ schedule: result });
  } catch (error: any) {
    console.error('Error marking medication as taken:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/lab-results
 * Get patient lab results
 */
export const getLabResults = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;

    const { type, status, from, to } = req.query;
    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const filters = {
      type: type as string | undefined,
      status: status as string | undefined,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
    };

    const results = await patientService.getLabResults(patientId, filters);
    res.json({ results });
  } catch (error: any) {
    console.error('Error getting lab results:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/lab-results/:resultId
 * Get single lab result
 */
export const getLabResult = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;
    const resultId = requireParam(res, req.params.resultId, 'resultId');
    if (!resultId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const result = await patientService.getLabResult(patientId, resultId);
    res.json({ result });
  } catch (error: any) {
    console.error('Error getting lab result:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/patients/:patientId/lab-results/:resultId/download
 * Download lab result file
 */
export const downloadLabResult = async (req: Request, res: Response) => {
  try {
    const patientId = requireParam(res, req.params.patientId, 'patientId');
    if (!patientId) return;
    const resultId = requireParam(res, req.params.resultId, 'resultId');
    if (!resultId) return;

    const auth = requireAuth(req, res);
    if (!auth) return;

    const hasAccess = await ensurePatientAccess(res, auth.userId, patientId, auth.userRole);
    if (!hasAccess) return;

    const result = await patientService.getLabResult(patientId, resultId);

    if (!result.fileUrl) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // In production, this should redirect to a signed URL or serve from storage
    res.json({
      downloadUrl: result.fileUrl,
      message: 'Use this URL to download the file',
    });
  } catch (error: any) {
    console.error('Error downloading lab result:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
