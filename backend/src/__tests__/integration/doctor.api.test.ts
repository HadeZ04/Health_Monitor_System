/**
 * Integration Tests for Doctor API
 * Tests HTTP endpoints for doctor operations
 */

import request from 'supertest';
import { createApp } from '../../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

const app = createApp();
const prisma = new PrismaClient();

// Helper to generate JWT token
const generateToken = (userId: string, role: string = 'doctor') => {
  return jwt.sign({ userId, email: `${role}@test.com` }, config.jwt.secret, {
    expiresIn: '1h',
  });
};

describe('Doctor API Integration Tests', () => {
  let doctorToken: string;
  let doctorId: string;
  let doctorProfileId: string;
  let patientId: string;
  let consultationId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Create test doctor user
    const doctorUser = await prisma.user.create({
      data: {
        email: 'testdoctor@test.com',
        password: 'hashed_password',
        name: 'Dr. Test',
        role: {
          connectOrCreate: {
            where: { name: 'doctor' },
            create: {
              name: 'doctor',
              description: 'Doctor role',
            },
          },
        },
      },
    });

    doctorId = doctorUser.id;
    doctorToken = generateToken(doctorId, 'doctor');

    // Create doctor profile
    const doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: doctorId,
        specialty: 'Cardiology',
        experience: 10,
        license: 'MD-12345',
        phone: '1234567890',
        status: 'active',
      },
    });

    doctorProfileId = doctorProfile.id;

    // Create test patient
    const patientUser = await prisma.user.create({
      data: {
        email: 'testpatient@test.com',
        password: 'hashed_password',
        name: 'Test Patient',
        role: {
          connectOrCreate: {
            where: { name: 'patient' },
            create: {
              name: 'patient',
              description: 'Patient role',
            },
          },
        },
      },
    });

    const patientProfile = await prisma.patientProfile.create({
      data: {
        userId: patientUser.id,
        name: 'Test Patient',
        age: 35,
        gender: 'male',
        bloodType: 'O+',
        riskLevel: 'low',
      },
    });

    patientId = patientProfile.id;

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: 'hashed_password',
        name: 'Admin User',
        role: {
          connectOrCreate: {
            where: { name: 'admin' },
            create: {
              name: 'admin',
              description: 'Admin role',
            },
          },
        },
      },
    });

    adminToken = generateToken(adminUser.id, 'admin');

    // Create test consultation
    const consultation = await prisma.consultation.create({
      data: {
        doctorId: doctorProfileId,
        patientId,
        diagnosis: 'Test diagnosis',
        notes: 'Test notes',
        status: 'completed',
      },
    });

    consultationId = consultation.id;
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.consultation.deleteMany({
      where: { doctorId: doctorProfileId },
    });
    await prisma.doctorProfile.deleteMany({
      where: { userId: doctorId },
    });
    await prisma.patientProfile.deleteMany({
      where: { id: patientId },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testdoctor@test.com', 'testpatient@test.com', 'admin@test.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/doctors/dashboard/:doctorId', () => {
    it('should return dashboard data for authenticated doctor', async () => {
      const response = await request(app)
        .get(`/api/doctors/dashboard/${doctorId}`)
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(response.body.data).toHaveProperty('todaySchedule');
      expect(response.body.data).toHaveProperty('criticalAlerts');
      expect(response.body.data.stats).toHaveProperty('todayAppointments');
      expect(response.body.data.stats).toHaveProperty('completedToday');
      expect(response.body.data.stats).toHaveProperty('patientsUnderCare');
    });

    it('should allow admin to access any doctor dashboard', async () => {
      const response = await request(app)
        .get(`/api/doctors/dashboard/${doctorId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get(`/api/doctors/dashboard/${doctorId}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 when accessing another doctor\'s dashboard', async () => {
      const otherDoctorToken = generateToken('other-doctor-id', 'doctor');

      const response = await request(app)
        .get(`/api/doctors/dashboard/${doctorId}`)
        .set('Authorization', `Bearer ${otherDoctorToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/doctors/:doctorId/patients', () => {
    it('should return patients list with pagination', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients`)
        .query({ page: 1, limit: 20 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter patients by search term', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients`)
        .query({ search: 'Test', page: 1, limit: 20 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter patients by gender', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients`)
        .query({ gender: 'male', page: 1, limit: 20 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/doctors/:doctorId/consultations', () => {
    it('should create a new consultation', async () => {
      const consultationData = {
        patientId,
        diagnosis: 'Hypertension',
        notes: 'Patient needs follow-up',
        prescriptions: [
          {
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning',
          },
        ],
      };

      const response = await request(app)
        .post(`/api/doctors/${doctorId}/consultations`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(consultationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.diagnosis).toBe('Hypertension');
      expect(response.body.data.prescriptions).toHaveLength(1);
    });

    it('should create consultation with lab orders', async () => {
      const consultationData = {
        patientId,
        diagnosis: 'Diabetes checkup',
        labOrders: [
          {
            testType: 'Blood glucose test',
            priority: 'urgent',
            notes: 'Fasting blood sugar',
          },
        ],
      };

      const response = await request(app)
        .post(`/api/doctors/${doctorId}/consultations`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(consultationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 with invalid data', async () => {
      const invalidData = {
        // Missing patientId
        diagnosis: 'Test diagnosis',
      };

      const response = await request(app)
        .post(`/api/doctors/${doctorId}/consultations`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/doctors/:doctorId/consultations/:consultationId', () => {
    it('should update consultation', async () => {
      const updateData = {
        diagnosis: 'Updated diagnosis',
        status: 'completed',
      };

      const response = await request(app)
        .put(`/api/doctors/${doctorId}/consultations/${consultationId}`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.diagnosis).toBe('Updated diagnosis');
    });

    it('should return 404 for non-existent consultation', async () => {
      const response = await request(app)
        .put(`/api/doctors/${doctorId}/consultations/non-existent-id`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({ diagnosis: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/doctors/:doctorId/consultations/:consultationId', () => {
    it('should get consultation details', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/consultations/${consultationId}`)
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('patient');
    });
  });

  describe('GET /api/doctors/:doctorId/patients/:patientId', () => {
    it('should get patient detail', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients/${patientId}`)
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('user');
    });
  });

  describe('GET /api/doctors/:doctorId/patients/:patientId/history', () => {
    it('should get patient history', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients/${patientId}/history`)
        .query({ type: 'all', limit: 50 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('consultations');
    });

    it('should filter history by type', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/patients/${patientId}/history`)
        .query({ type: 'consultations', limit: 50 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/doctors/:doctorId/schedule', () => {
    it('should update doctor schedule', async () => {
      const scheduleData = {
        schedules: [
          {
            dayOfWeek: 1, // Monday
            timeSlots: [
              {
                startTime: '09:00',
                endTime: '12:00',
                available: true,
              },
              {
                startTime: '14:00',
                endTime: '17:00',
                available: true,
              },
            ],
            fromDate: new Date().toISOString(),
            isActive: true,
          },
        ],
      };

      const response = await request(app)
        .put(`/api/doctors/${doctorId}/schedule`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(scheduleData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/doctors/:doctorId/schedule', () => {
    it('should get doctor schedule', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/schedule`)
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/doctors/:doctorId/lab-orders', () => {
    it('should get lab orders list', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/lab-orders`)
        .query({ page: 1, limit: 20 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter lab orders by status', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/lab-orders`)
        .query({ status: 'pending', page: 1, limit: 20 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/doctors/:doctorId/messages', () => {
    it('should get conversations list', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorId}/messages`)
        .query({ page: 1, limit: 50 })
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('POST /api/doctors/:doctorId/messages', () => {
    it('should send a message', async () => {
      const messageData = {
        patientId,
        content: 'Hello, how are you feeling today?',
      };

      const response = await request(app)
        .post(`/api/doctors/${doctorId}/messages`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(messageData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.content).toBe(messageData.content);
    });

    it('should return 400 with invalid patient ID', async () => {
      const messageData = {
        patientId: 'invalid-id',
        content: 'Test message',
      };

      const response = await request(app)
        .post(`/api/doctors/${doctorId}/messages`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(messageData);

      expect(response.status).toBe(400);
    });
  });
});
