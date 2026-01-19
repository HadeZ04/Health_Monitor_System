/**
 * Unit Tests for Doctor Service
 * Tests business logic for doctor-related operations
 */

import { PrismaClient } from '@prisma/client';
import * as doctorService from '../../services/doctor.service';
import { NotFoundError, ForbiddenError } from '../../utils/errors';

// Mock PrismaClient
jest.mock('@prisma/client');

const mockPrismaClient = {
  doctorProfile: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  patientProfile: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  consultation: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  labOrder: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  alert: {
    findMany: jest.fn(),
  },
  conversation: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  message: {
    findMany: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  doctorSchedule: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  patientVital: {
    findMany: jest.fn(),
  },
  prescription: {
    findMany: jest.fn(),
  },
};

// Mock the Prisma module to return our mock client
jest.mock('../../services/doctor.service', () => {
  const actualModule = jest.requireActual('../../services/doctor.service');
  return {
    ...actualModule,
    __esModule: true,
  };
});

// Replace the prisma instance in the module
const doctorServiceModule = require('../../services/doctor.service');
(doctorServiceModule as any).prisma = mockPrismaClient as any;

describe('Doctor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should return dashboard data for doctor', async () => {
      const doctorId = 'doctor-123';
      const doctorProfileId = 'profile-123';

      // Mock doctor profile
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: doctorProfileId,
        userId: doctorId,
        specialty: 'Cardiology',
        status: 'active',
      });

      // Mock counts
      mockPrismaClient.appointment.count
        .mockResolvedValueOnce(5) // todayAppointments
        .mockResolvedValue(0);

      mockPrismaClient.consultation.count.mockResolvedValue(3); // completedToday
      mockPrismaClient.consultation.findMany.mockResolvedValue([
        { patientId: 'patient-1' },
        { patientId: 'patient-2' },
      ]); // patientsUnderCare

      mockPrismaClient.patientProfile.count.mockResolvedValue(2); // highRiskPatients

      mockPrismaClient.labOrder.count
        .mockResolvedValueOnce(4) // pendingLabOrders
        .mockResolvedValueOnce(1); // urgentLabOrders

      mockPrismaClient.conversation.findMany.mockResolvedValue([
        { id: 'conv-1' },
        { id: 'conv-2' },
      ]);

      mockPrismaClient.message.count
        .mockResolvedValueOnce(10) // unreadMessages
        .mockResolvedValueOnce(3); // highPriorityMessages

      // Mock today's schedule
      mockPrismaClient.appointment.findMany.mockResolvedValue([
        {
          id: 'appt-1',
          time: '09:00',
          patientId: 'patient-1',
          reason: 'Checkup',
          status: 'confirmed',
          patient: {
            id: 'patient-1',
            name: 'John Doe',
          },
        },
      ]);

      // Mock alerts
      mockPrismaClient.alert.findMany.mockResolvedValue([
        {
          id: 'alert-1',
          type: 'critical',
          message: 'High blood pressure',
          createdAt: new Date(),
          user: {
            id: 'user-1',
            name: 'Jane Smith',
            patientProfile: { id: 'patient-2' },
          },
        },
      ]);

      const result = await doctorService.getDashboard(doctorId);

      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('todaySchedule');
      expect(result).toHaveProperty('criticalAlerts');
      expect(result.stats.todayAppointments).toBe(5);
      expect(result.stats.completedToday).toBe(3);
      expect(result.todaySchedule).toHaveLength(1);
      expect(result.criticalAlerts).toHaveLength(1);
    });

    it('should throw NotFoundError if doctor profile not found', async () => {
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue(null);

      await expect(doctorService.getDashboard('invalid-doctor-id')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('getPatients', () => {
    it('should return patients list with pagination', async () => {
      const doctorId = 'doctor-123';
      const doctorProfileId = 'profile-123';

      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: doctorProfileId,
        userId: doctorId,
      });

      const mockPatients = [
        {
          id: 'patient-1',
          name: 'John Doe',
          age: 45,
          gender: 'male',
          bloodType: 'A+',
          riskLevel: 'medium',
          healthScore: 75,
          user: { email: 'john@example.com', phone: '1234567890' },
          patientVitals: [
            {
              type: 'heartRate',
              value: { bpm: 72 },
              status: 'normal',
              timestamp: new Date(),
            },
          ],
          consultations: [{ createdAt: new Date() }],
        },
      ];

      mockPrismaClient.patientProfile.findMany.mockResolvedValue(mockPatients);
      mockPrismaClient.patientProfile.count.mockResolvedValue(1);

      const result = await doctorService.getPatients(doctorId, {
        page: 1,
        limit: 20,
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('John Doe');
      expect(result.pagination.total).toBe(1);
    });

    it('should filter patients by search term', async () => {
      const doctorId = 'doctor-123';

      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: doctorId,
      });

      mockPrismaClient.patientProfile.findMany.mockResolvedValue([]);
      mockPrismaClient.patientProfile.count.mockResolvedValue(0);

      await doctorService.getPatients(doctorId, {
        search: 'John',
        page: 1,
        limit: 20,
      });

      expect(mockPrismaClient.patientProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });
  });

  describe('createConsultation', () => {
    it('should create consultation with prescriptions and lab orders', async () => {
      const doctorId = 'doctor-123';
      const doctorProfileId = 'profile-123';

      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: doctorProfileId,
        userId: doctorId,
        specialty: 'Cardiology',
        user: { name: 'Dr. Smith' },
      });

      mockPrismaClient.patientProfile.findUnique.mockResolvedValue({
        id: 'patient-1',
        name: 'John Doe',
      });

      const mockConsultation = {
        id: 'consult-1',
        doctorId: doctorProfileId,
        patientId: 'patient-1',
        diagnosis: 'Hypertension',
        prescriptions: [
          {
            id: 'rx-1',
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
          },
        ],
      };

      mockPrismaClient.consultation.create.mockResolvedValue(mockConsultation);
      mockPrismaClient.labOrder.createMany.mockResolvedValue({ count: 1 });
      mockPrismaClient.appointment.create.mockResolvedValue({
        id: 'appt-1',
      });

      const data = {
        patientId: 'patient-1',
        diagnosis: 'Hypertension',
        prescriptions: [
          {
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
          },
        ],
        labOrders: [
          {
            testType: 'Blood test',
            priority: 'normal' as const,
          },
        ],
        nextAppointment: new Date().toISOString(),
      };

      const result = await doctorService.createConsultation(doctorId, data);

      expect(result).toHaveProperty('id');
      expect(result.diagnosis).toBe('Hypertension');
      expect(mockPrismaClient.consultation.create).toHaveBeenCalled();
      expect(mockPrismaClient.labOrder.createMany).toHaveBeenCalled();
      expect(mockPrismaClient.appointment.create).toHaveBeenCalled();
    });

    it('should throw NotFoundError if doctor not found', async () => {
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue(null);

      await expect(
        doctorService.createConsultation('invalid-doctor-id', {
          patientId: 'patient-1',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if patient not found', async () => {
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: 'doctor-123',
      });
      mockPrismaClient.patientProfile.findUnique.mockResolvedValue(null);

      await expect(
        doctorService.createConsultation('doctor-123', {
          patientId: 'invalid-patient-id',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateConsultation', () => {
    it('should update consultation', async () => {
      const doctorId = 'doctor-123';
      const consultationId = 'consult-1';

      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: doctorId,
      });

      mockPrismaClient.consultation.findUnique.mockResolvedValue({
        id: consultationId,
        doctorId: 'profile-123',
        diagnosis: 'Old diagnosis',
      });

      mockPrismaClient.consultation.update.mockResolvedValue({
        id: consultationId,
        doctorId: 'profile-123',
        diagnosis: 'Updated diagnosis',
        prescriptions: [],
      });

      const result = await doctorService.updateConsultation(
        doctorId,
        consultationId,
        {
          diagnosis: 'Updated diagnosis',
          status: 'completed',
        }
      );

      expect(result.diagnosis).toBe('Updated diagnosis');
      expect(mockPrismaClient.consultation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: consultationId },
          data: expect.objectContaining({
            diagnosis: 'Updated diagnosis',
            status: 'completed',
          }),
        })
      );
    });

    it('should throw ForbiddenError if consultation belongs to another doctor', async () => {
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: 'doctor-123',
      });

      mockPrismaClient.consultation.findUnique.mockResolvedValue({
        id: 'consult-1',
        doctorId: 'different-profile-id', // Different doctor
      });

      await expect(
        doctorService.updateConsultation('doctor-123', 'consult-1', {
          diagnosis: 'New diagnosis',
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('verifyDoctorAccess', () => {
    it('should allow admin to access any doctor', async () => {
      const result = await doctorService.verifyDoctorAccess(
        'admin-user-id',
        'admin',
        'any-doctor-id'
      );

      expect(result).toBe(true);
    });

    it('should allow doctor to access their own data', async () => {
      const doctorId = 'doctor-123';

      const result = await doctorService.verifyDoctorAccess(
        doctorId,
        'doctor',
        doctorId
      );

      expect(result).toBe(true);
    });

    it('should deny doctor from accessing another doctor\'s data', async () => {
      const result = await doctorService.verifyDoctorAccess(
        'doctor-123',
        'doctor',
        'doctor-456'
      );

      expect(result).toBe(false);
    });

    it('should deny patient from accessing doctor data', async () => {
      const result = await doctorService.verifyDoctorAccess(
        'patient-123',
        'patient',
        'doctor-456'
      );

      expect(result).toBe(false);
    });
  });

  describe('approveLabOrder', () => {
    it('should approve lab order', async () => {
      const doctorId = 'doctor-123';
      const orderId = 'order-1';

      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: doctorId,
      });

      mockPrismaClient.labOrder.findUnique.mockResolvedValue({
        id: orderId,
        doctorId: 'profile-123',
        status: 'pending',
      });

      mockPrismaClient.labOrder.update.mockResolvedValue({
        id: orderId,
        status: 'approved',
        approvedBy: doctorId,
        approvedAt: new Date(),
      });

      const result = await doctorService.approveLabOrder(doctorId, orderId);

      expect(result.status).toBe('approved');
      expect(mockPrismaClient.labOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orderId },
          data: expect.objectContaining({
            status: 'approved',
            approvedBy: doctorId,
          }),
        })
      );
    });

    it('should throw ForbiddenError if doctor does not own the lab order', async () => {
      mockPrismaClient.doctorProfile.findUnique.mockResolvedValue({
        id: 'profile-123',
        userId: 'doctor-123',
      });

      mockPrismaClient.labOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        doctorId: 'different-profile-id',
      });

      await expect(
        doctorService.approveLabOrder('doctor-123', 'order-1')
      ).rejects.toThrow(ForbiddenError);
    });
  });
});
