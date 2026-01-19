/**
 * Doctor Controller
 * Handles HTTP requests for doctor-related operations
 */

import type { Request, Response } from 'express';
import * as doctorService from '../services/doctor.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ForbiddenError } from '../utils/errors';

const requireParam = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new ForbiddenError(`Invalid request: ${name} is required`);
  }
  return value;
};

const requireAuth = (req: Request): { userId: string; userRole: string } => {
  const userId = req.user?.id;
  const userRole = req.user?.role?.name;
  if (!userId || !userRole) {
    throw new ForbiddenError('Invalid request');
  }
  return { userId, userRole };
};

const requireDoctorAccess = async (req: Request, doctorId: string, message: string) => {
  const { userId, userRole } = requireAuth(req);
  const hasAccess = await doctorService.verifyDoctorAccess(userId, userRole, doctorId);
  if (!hasAccess) {
    throw new ForbiddenError(message);
  }
};

/**
 * GET /api/doctors/dashboard/:doctorId
 * Get doctor dashboard with stats and today's schedule
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, "You do not have access to this doctor's dashboard");

  const dashboard = await doctorService.getDashboard(doctorId);

  res.json({
    success: true,
    data: dashboard,
  });
});

/**
 * GET /api/doctors/:doctorId/patients
 * Get doctor's patients list with filters
 */
export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, "You do not have access to this doctor's patients");

  const patients = await doctorService.getPatients(doctorId, req.query as any);

  res.json({
    success: true,
    ...patients,
  });
});

/**
 * GET /api/doctors/:doctorId/patients/:patientId
 * Get patient detail
 */
export const getPatientDetail = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const patientId = requireParam(req.params.patientId, 'patientId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to this patient');

  const patient = await doctorService.getPatientDetail(doctorId, patientId);

  res.json({
    success: true,
    data: patient,
  });
});

/**
 * GET /api/doctors/:doctorId/patients/:patientId/history
 * Get patient medical history
 */
export const getPatientHistory = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const patientId = requireParam(req.params.patientId, 'patientId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to this patient');

  const history = await doctorService.getPatientHistory(doctorId, patientId, req.query as any);

  res.json({
    success: true,
    data: history,
  });
});

/**
 * GET /api/doctors/:doctorId/patients/:patientId/vitals
 * Get patient vitals
 */
export const getPatientVitals = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const patientId = requireParam(req.params.patientId, 'patientId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to this patient');

  const vitals = await doctorService.getPatientVitals(doctorId, patientId, req.query as any);

  res.json({
    success: true,
    data: vitals,
  });
});

/**
 * GET /api/doctors/:doctorId/consultations/:consultationId
 * Get consultation by ID
 */
export const getConsultation = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const consultationId = requireParam(req.params.consultationId, 'consultationId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to this consultation');

  const consultation = await doctorService.getConsultation(doctorId, consultationId);

  res.json({
    success: true,
    data: consultation,
  });
});

/**
 * POST /api/doctors/:doctorId/consultations
 * Create new consultation
 */
export const createConsultation = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');

  await requireDoctorAccess(req, doctorId, 'You do not have permission to create consultations');

  const consultation = await doctorService.createConsultation(doctorId, req.body);

  res.status(201).json({
    success: true,
    data: consultation,
  });
});

/**
 * PUT /api/doctors/:doctorId/consultations/:consultationId
 * Update consultation
 */
export const updateConsultation = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const consultationId = requireParam(req.params.consultationId, 'consultationId');

  await requireDoctorAccess(req, doctorId, 'You do not have permission to update this consultation');

  const consultation = await doctorService.updateConsultation(doctorId, consultationId, req.body);

  res.json({
    success: true,
    data: consultation,
  });
});

/**
 * GET /api/doctors/:doctorId/schedule
 * Get doctor schedule
 */
export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, 'You do not have access to this schedule');

  const schedule = await doctorService.getSchedule(doctorId, req.query as any);

  res.json({
    success: true,
    data: schedule,
  });
});

/**
 * PUT /api/doctors/:doctorId/schedule
 * Update doctor schedule
 */
export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, 'You do not have permission to update this schedule');

  const { schedules } = req.body as { schedules?: any };

  const result = await doctorService.updateSchedule(doctorId, schedules);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/doctors/:doctorId/lab-orders
 * Get lab orders
 */
export const getLabOrders = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, 'You do not have access to these lab orders');

  const labOrders = await doctorService.getLabOrders(doctorId, req.query as any);

  res.json({
    success: true,
    ...labOrders,
  });
});

/**
 * POST /api/doctors/:doctorId/lab-orders/:orderId/approve
 * Approve lab order
 */
export const approveLabOrder = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const orderId = requireParam(req.params.orderId, 'orderId');
  await requireDoctorAccess(req, doctorId, 'You do not have permission to approve this lab order');

  const labOrder = await doctorService.approveLabOrder(doctorId, orderId);

  res.json({
    success: true,
    data: labOrder,
  });
});

/**
 * GET /api/doctors/:doctorId/lab-orders/:orderId/results
 * Get lab order results
 */
export const getLabOrderResults = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const orderId = requireParam(req.params.orderId, 'orderId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to these lab results');

  const results = await doctorService.getLabOrderResults(doctorId, orderId);

  res.json({
    success: true,
    data: results,
  });
});

/**
 * GET /api/doctors/:doctorId/messages
 * Get messages (conversations)
 */
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, 'You do not have access to these messages');

  const messages = await doctorService.getMessages(doctorId, req.query as any);

  res.json({
    success: true,
    ...messages,
  });
});

/**
 * POST /api/doctors/:doctorId/messages
 * Send message
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  await requireDoctorAccess(req, doctorId, 'You do not have permission to send messages');

  const message = await doctorService.sendMessage(doctorId, req.body);

  res.status(201).json({
    success: true,
    data: message,
  });
});

/**
 * GET /api/doctors/:doctorId/messages/:conversationId
 * Get conversation messages
 */
export const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = requireParam(req.params.doctorId, 'doctorId');
  const conversationId = requireParam(req.params.conversationId, 'conversationId');

  await requireDoctorAccess(req, doctorId, 'You do not have access to this conversation');

  const page = typeof req.query.page === 'string' ? Number(req.query.page) : 1;
  const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : 50;

  const messages = await doctorService.getConversationMessages(doctorId, conversationId, page, limit);

  res.json({
    success: true,
    ...messages,
  });
});
