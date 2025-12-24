/**
 * Doctor Routes
 * API endpoints for doctor-related operations
 */

import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller';
import { authenticate } from '../middlewares/authMiddleware';
import {
  validate,
  queryPatientsSchema,
  createConsultationSchema,
  updateConsultationSchema,
  updateScheduleSchema,
  queryScheduleSchema,
  queryLabOrdersSchema,
  queryMessagesSchema,
  sendMessageSchema,
  queryPatientVitalsSchema,
  queryPatientHistorySchema,
} from '../validators/doctor.validator';

export const doctorsRouter = Router();

// All routes require authentication
doctorsRouter.use(authenticate);

/**
 * Doctor Dashboard
 */
doctorsRouter.get('/dashboard/:doctorId', doctorController.getDashboard);

/**
 * Doctor Patients List
 */
doctorsRouter.get(
  '/:doctorId/patients',
  validate(queryPatientsSchema),
  doctorController.getPatients
);

/**
 * Doctor Patient Detail
 */
doctorsRouter.get(
  '/:doctorId/patients/:patientId',
  doctorController.getPatientDetail
);

doctorsRouter.get(
  '/:doctorId/patients/:patientId/history',
  validate(queryPatientHistorySchema),
  doctorController.getPatientHistory
);

doctorsRouter.get(
  '/:doctorId/patients/:patientId/vitals',
  validate(queryPatientVitalsSchema),
  doctorController.getPatientVitals
);

/**
 * Doctor Consultation
 */
doctorsRouter.get(
  '/:doctorId/consultations/:consultationId',
  doctorController.getConsultation
);

doctorsRouter.post(
  '/:doctorId/consultations',
  validate(createConsultationSchema),
  doctorController.createConsultation
);

doctorsRouter.put(
  '/:doctorId/consultations/:consultationId',
  validate(updateConsultationSchema),
  doctorController.updateConsultation
);

/**
 * Doctor Schedule
 */
doctorsRouter.get(
  '/:doctorId/schedule',
  validate(queryScheduleSchema),
  doctorController.getSchedule
);

doctorsRouter.put(
  '/:doctorId/schedule',
  validate(updateScheduleSchema),
  doctorController.updateSchedule
);

/**
 * Doctor Lab Orders
 */
doctorsRouter.get(
  '/:doctorId/lab-orders',
  validate(queryLabOrdersSchema),
  doctorController.getLabOrders
);

doctorsRouter.post(
  '/:doctorId/lab-orders/:orderId/approve',
  doctorController.approveLabOrder
);

doctorsRouter.get(
  '/:doctorId/lab-orders/:orderId/results',
  doctorController.getLabOrderResults
);

/**
 * Doctor Messages
 */
doctorsRouter.get(
  '/:doctorId/messages',
  validate(queryMessagesSchema),
  doctorController.getMessages
);

doctorsRouter.post(
  '/:doctorId/messages',
  validate(sendMessageSchema),
  doctorController.sendMessage
);

doctorsRouter.get(
  '/:doctorId/messages/:conversationId',
  doctorController.getConversationMessages
);
