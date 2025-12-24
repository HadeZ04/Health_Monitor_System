/**
 * Patient Service Unit Tests
 * Tests for patient-related business logic
 */

import { PrismaClient } from '@prisma/client';
import * as patientService from '../../services/patient.service';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    patientProfile: {
      findUnique: jest.fn(),
    },
    patientVital: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    medicationSchedule: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    medication: {
      findMany: jest.fn(),
    },
    labResult: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('Patient Service', () => {
  let mockPrisma: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Get mock prisma instance
    mockPrisma = new PrismaClient();
  });

  describe('getDashboard', () => {
    it('should return dashboard data for valid patient', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';

      // Mock user with patient profile
      mockPrisma.user.findUnique.mockResolvedValue({
        id: patientId,
        email: 'patient@test.com',
        name: 'Test Patient',
        patientProfile: {
          id: profileId,
          userId: patientId,
          age: 35,
          gender: 'male',
          bloodType: 'A+',
          healthScore: 85,
          riskLevel: 'low',
          emergencyContact: '+1234567890',
        },
      });

      // Mock vitals
      mockPrisma.patientVital.findFirst.mockResolvedValue({
        id: 'vital-1',
        patientId: profileId,
        type: 'heartRate',
        value: { bpm: 75 },
        unit: 'bpm',
        status: 'normal',
        timestamp: new Date(),
      });

      // Mock appointments
      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          id: 'apt-1',
          patientId: profileId,
          doctorName: 'Dr. Smith',
          specialty: 'Cardiology',
          date: new Date('2025-12-25'),
          time: '10:00',
          status: 'confirmed',
          type: 'checkup',
          reason: 'Regular checkup',
        },
      ]);

      // Mock medications
      mockPrisma.medicationSchedule.findMany.mockResolvedValue([
        {
          id: 'med-1',
          patientId: profileId,
          medicationId: 'medication-1',
          dosage: '10mg',
          time: '08:00',
          taken: false,
          nextDose: new Date(),
          medication: {
            id: 'medication-1',
            name: 'Aspirin',
          },
        },
      ]);

      const result = await patientService.getDashboard(patientId);

      expect(result).toBeDefined();
      expect(result.profile.id).toBe(patientId);
      expect(result.profile.email).toBe('patient@test.com');
      expect(result.profile.healthScore).toBe(85);
      expect(result.latestVitals.length).toBeGreaterThan(0);
      expect(result.upcomingAppointments).toHaveLength(1);
      expect(result.medications).toHaveLength(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: patientId },
        include: { patientProfile: true },
      });
    });

    it('should throw error if patient not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(patientService.getDashboard('invalid-id')).rejects.toThrow(
        'Patient not found'
      );
    });

    it('should throw error if patient profile not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'user@test.com',
        patientProfile: null,
      });

      await expect(patientService.getDashboard('user-123')).rejects.toThrow(
        'Patient not found'
      );
    });
  });

  describe('getVitalsHistory', () => {
    it('should return filtered vitals history', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';

      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: profileId,
        userId: patientId,
      });

      const mockVitals = [
        {
          id: 'vital-1',
          patientId: profileId,
          type: 'heartRate',
          value: { bpm: 75 },
          timestamp: new Date('2025-12-24T10:00:00Z'),
        },
        {
          id: 'vital-2',
          patientId: profileId,
          type: 'heartRate',
          value: { bpm: 72 },
          timestamp: new Date('2025-12-23T10:00:00Z'),
        },
      ];

      mockPrisma.patientVital.findMany.mockResolvedValue(mockVitals);

      const result = await patientService.getVitalsHistory(patientId, {
        type: 'heartRate',
        limit: 10,
      });

      expect(result).toHaveLength(2);
      expect(mockPrisma.patientVital.findMany).toHaveBeenCalledWith({
        where: {
          patientId: profileId,
          type: 'heartRate',
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
      });
    });
  });

  describe('createAppointment', () => {
    it('should create new appointment', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';

      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: profileId,
        userId: patientId,
      });

      const appointmentData = {
        doctorName: 'Dr. Smith',
        specialty: 'Cardiology',
        date: new Date('2025-12-30'),
        time: '14:00',
        reason: 'Follow-up',
      };

      const mockAppointment = {
        id: 'apt-123',
        patientId: profileId,
        ...appointmentData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.appointment.create.mockResolvedValue(mockAppointment);

      const result = await patientService.createAppointment(patientId, appointmentData);

      expect(result).toBeDefined();
      expect(result.id).toBe('apt-123');
      expect(result.doctorName).toBe('Dr. Smith');
      expect(result.status).toBe('pending');
      expect(mockPrisma.appointment.create).toHaveBeenCalledWith({
        data: {
          patientId: profileId,
          ...appointmentData,
          status: 'pending',
        },
      });
    });
  });

  describe('updateAppointment', () => {
    it('should update existing appointment', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';
      const appointmentId = 'apt-123';

      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: profileId,
        userId: patientId,
      });

      mockPrisma.appointment.findFirst.mockResolvedValue({
        id: appointmentId,
        patientId: profileId,
        status: 'pending',
      });

      const updatedAppointment = {
        id: appointmentId,
        patientId: profileId,
        status: 'confirmed',
        doctorName: 'Dr. Smith',
      };

      mockPrisma.appointment.update.mockResolvedValue(updatedAppointment);

      const result = await patientService.updateAppointment(patientId, appointmentId, {
        status: 'confirmed',
      });

      expect(result.status).toBe('confirmed');
      expect(mockPrisma.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: { status: 'confirmed' },
      });
    });

    it('should throw error if appointment not found', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';

      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: profileId,
        userId: patientId,
      });

      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      await expect(
        patientService.updateAppointment(patientId, 'invalid-id', { status: 'confirmed' })
      ).rejects.toThrow('Appointment not found');
    });
  });

  describe('verifyPatientAccess', () => {
    it('should allow admin to access any patient', async () => {
      const result = await patientService.verifyPatientAccess(
        'admin-123',
        'patient-456',
        'admin'
      );
      expect(result).toBe(true);
    });

    it('should allow doctor to access any patient', async () => {
      const result = await patientService.verifyPatientAccess(
        'doctor-123',
        'patient-456',
        'doctor'
      );
      expect(result).toBe(true);
    });

    it('should allow patient to access own data', async () => {
      const patientId = 'patient-123';
      const result = await patientService.verifyPatientAccess(
        patientId,
        patientId,
        'patient'
      );
      expect(result).toBe(true);
    });

    it('should deny patient access to other patient data', async () => {
      const result = await patientService.verifyPatientAccess(
        'patient-123',
        'patient-456',
        'patient'
      );
      expect(result).toBe(false);
    });

    it('should deny access for unknown roles', async () => {
      const result = await patientService.verifyPatientAccess(
        'user-123',
        'patient-456',
        'unknown'
      );
      expect(result).toBe(false);
    });
  });

  describe('takeMedication', () => {
    it('should mark medication as taken using scheduleId', async () => {
      const patientId = 'patient-123';
      const profileId = 'profile-123';
      const scheduleId = 'schedule-123';

      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: profileId,
        userId: patientId,
      });

      mockPrisma.medicationSchedule.findFirst.mockResolvedValue({
        id: scheduleId,
        patientId: profileId,
        taken: false,
      });

      const updatedSchedule = {
        id: scheduleId,
        patientId: profileId,
        taken: true,
      };

      mockPrisma.medicationSchedule.update.mockResolvedValue(updatedSchedule);

      const result = await patientService.takeMedication(patientId, 'med-123', {
        scheduleId,
        taken: true,
      });

      expect(result.taken).toBe(true);
      expect(mockPrisma.medicationSchedule.update).toHaveBeenCalledWith({
        where: { id: scheduleId },
        data: {
          taken: true,
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
