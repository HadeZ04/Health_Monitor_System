/**
 * Patient API Integration Tests
 * End-to-end tests for patient endpoints
 */

import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { patientsRouter } from '../../routes/patients';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/patients', patientsRouter);

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'techxen-dev-secret';

describe('Patient API Integration Tests', () => {
  let patientToken: string;
  let patientUserId: string;
  let patientProfileId: string;
  let doctorToken: string;

  beforeAll(async () => {
    // Create test patient user
    const patientUser = await prisma.user.create({
      data: {
        email: 'test-patient-' + Date.now() + '@test.com',
        password: 'hashedpassword',
        name: 'Test Patient',
        role: {
          connectOrCreate: {
            where: { name: 'patient' },
            create: { name: 'patient', description: 'Patient role' },
          },
        },
      },
      include: { role: true },
    });

    patientUserId = patientUser.id;

    // Create patient profile
    const profile = await prisma.patientProfile.create({
      data: {
        userId: patientUserId,
        name: 'Test Patient',
        age: 35,
        gender: 'male',
        bloodType: 'A+',
        healthScore: 85,
        riskLevel: 'low',
      },
    });

    patientProfileId = profile.id;

    // Generate JWT token for patient
    patientToken = jwt.sign(
      {
        sub: patientUserId,
        role: 'patient',
        email: patientUser.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create test doctor user
    const doctorUser = await prisma.user.create({
      data: {
        email: 'test-doctor-' + Date.now() + '@test.com',
        password: 'hashedpassword',
        name: 'Test Doctor',
        role: {
          connectOrCreate: {
            where: { name: 'doctor' },
            create: { name: 'doctor', description: 'Doctor role' },
          },
        },
      },
    });

    // Generate JWT token for doctor
    doctorToken = jwt.sign(
      {
        sub: doctorUser.id,
        role: 'doctor',
        email: doctorUser.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.appointment.deleteMany({ where: { patientId: patientProfileId } });
    await prisma.medicationSchedule.deleteMany({ where: { patientId: patientProfileId } });
    await prisma.patientVital.deleteMany({ where: { patientId: patientProfileId } });
    await prisma.labResult.deleteMany({ where: { patientId: patientProfileId } });
    await prisma.patientProfile.deleteMany({ where: { userId: patientUserId } });
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'test-',
        },
      },
    });

    await prisma.$disconnect();
  });

  describe('GET /api/patients/dashboard/:patientId', () => {
    it('should return dashboard data for authenticated patient', async () => {
      const response = await request(app)
        .get(`/api/patients/dashboard/${patientUserId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('profile');
      expect(response.body).toHaveProperty('latestVitals');
      expect(response.body).toHaveProperty('upcomingAppointments');
      expect(response.body).toHaveProperty('medications');
      expect(response.body).toHaveProperty('healthScore');
      expect(response.body.profile.id).toBe(patientUserId);
    });

    it('should allow doctor to access patient dashboard', async () => {
      const response = await request(app)
        .get(`/api/patients/dashboard/${patientUserId}`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile.id).toBe(patientUserId);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get(`/api/patients/dashboard/${patientUserId}`)
        .expect(401);
    });

    it('should return 403 when patient tries to access other patient data', async () => {
      await request(app)
        .get('/api/patients/dashboard/other-patient-id')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);
    });
  });

  describe('POST /api/patients/:patientId/appointments', () => {
    it('should create new appointment', async () => {
      const appointmentData = {
        doctorName: 'Dr. Smith',
        specialty: 'Cardiology',
        date: new Date('2025-12-30T00:00:00Z').toISOString(),
        time: '14:00',
        reason: 'Regular checkup',
        type: 'consultation',
      };

      const response = await request(app)
        .post(`/api/patients/${patientUserId}/appointments`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData)
        .expect(201);

      expect(response.body).toHaveProperty('appointment');
      expect(response.body.appointment).toHaveProperty('id');
      expect(response.body.appointment.doctorName).toBe('Dr. Smith');
      expect(response.body.appointment.status).toBe('pending');
    });

    it('should return 400 for invalid appointment data', async () => {
      const invalidData = {
        doctorName: 'Dr. Smith',
        // Missing required date field
        time: '14:00',
      };

      await request(app)
        .post(`/api/patients/${patientUserId}/appointments`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/patients/:patientId/appointments', () => {
    beforeAll(async () => {
      // Create test appointments
      await prisma.appointment.createMany({
        data: [
          {
            patientId: patientProfileId,
            doctorName: 'Dr. Smith',
            specialty: 'Cardiology',
            date: new Date('2025-12-30'),
            time: '10:00',
            status: 'confirmed',
          },
          {
            patientId: patientProfileId,
            doctorName: 'Dr. Johnson',
            specialty: 'Neurology',
            date: new Date('2025-12-28'),
            time: '14:00',
            status: 'pending',
          },
        ],
      });
    });

    it('should return all appointments', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/appointments`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('appointments');
      expect(Array.isArray(response.body.appointments)).toBe(true);
      expect(response.body.appointments.length).toBeGreaterThan(0);
    });

    it('should filter appointments by status', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/appointments?status=confirmed`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body.appointments).toBeDefined();
      response.body.appointments.forEach((apt: any) => {
        expect(apt.status).toBe('confirmed');
      });
    });

    it('should return upcoming appointments', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/appointments?upcoming=true`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body.appointments).toBeDefined();
    });
  });

  describe('PUT /api/patients/:patientId/appointments/:appointmentId', () => {
    let appointmentId: string;

    beforeAll(async () => {
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patientProfileId,
          doctorName: 'Dr. Brown',
          specialty: 'General',
          date: new Date('2025-12-31'),
          time: '09:00',
          status: 'pending',
        },
      });
      appointmentId = appointment.id;
    });

    it('should update appointment status', async () => {
      const response = await request(app)
        .put(`/api/patients/${patientUserId}/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.appointment.status).toBe('confirmed');
    });
  });

  describe('DELETE /api/patients/:patientId/appointments/:appointmentId', () => {
    let appointmentId: string;

    beforeEach(async () => {
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patientProfileId,
          doctorName: 'Dr. Test',
          specialty: 'Test',
          date: new Date('2026-01-01'),
          time: '10:00',
          status: 'pending',
        },
      });
      appointmentId = appointment.id;
    });

    it('should delete appointment', async () => {
      await request(app)
        .delete(`/api/patients/${patientUserId}/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      // Verify deletion
      const deleted = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      expect(deleted).toBeNull();
    });
  });

  describe('GET /api/patients/:patientId/vitals', () => {
    beforeAll(async () => {
      // Create test vitals
      await prisma.patientVital.createMany({
        data: [
          {
            patientId: patientProfileId,
            type: 'heartRate',
            value: { bpm: 75 },
            unit: 'bpm',
            status: 'normal',
            timestamp: new Date('2025-12-24T10:00:00Z'),
          },
          {
            patientId: patientProfileId,
            type: 'bloodPressure',
            value: { systolic: 120, diastolic: 80 },
            unit: 'mmHg',
            status: 'normal',
            timestamp: new Date('2025-12-24T11:00:00Z'),
          },
        ],
      });
    });

    it('should return vitals history', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/vitals`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('vitals');
      expect(Array.isArray(response.body.vitals)).toBe(true);
    });

    it('should filter vitals by type', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/vitals?type=heartRate`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body.vitals).toBeDefined();
      response.body.vitals.forEach((vital: any) => {
        expect(vital.type).toBe('heartRate');
      });
    });
  });

  describe('GET /api/patients/:patientId/medications', () => {
    beforeAll(async () => {
      // Create test medication
      const medication = await prisma.medication.create({
        data: {
          name: 'Test Medicine',
          description: 'Test description',
          defaultDosage: '10mg',
          patientId: patientProfileId,
        },
      });

      // Create schedule
      await prisma.medicationSchedule.create({
        data: {
          patientId: patientProfileId,
          medicationId: medication.id,
          dosage: '10mg',
          frequency: 'daily',
          time: '08:00',
          taken: false,
          nextDose: new Date('2025-12-25T08:00:00Z'),
        },
      });
    });

    it('should return patient medications', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/medications`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('medications');
      expect(Array.isArray(response.body.medications)).toBe(true);
    });
  });

  describe('GET /api/patients/:patientId/lab-results', () => {
    beforeAll(async () => {
      // Create test lab results
      await prisma.labResult.createMany({
        data: [
          {
            patientId: patientProfileId,
            type: 'Blood Test',
            testName: 'Complete Blood Count',
            resultSummary: 'Normal',
            status: 'completed',
            value: '12.5',
            unit: 'g/dL',
            normalRange: '12-16',
          },
          {
            patientId: patientProfileId,
            type: 'Urine Test',
            testName: 'Urinalysis',
            resultSummary: 'Normal',
            status: 'completed',
          },
        ],
      });
    });

    it('should return lab results', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/lab-results`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    });

    it('should filter lab results by type', async () => {
      const response = await request(app)
        .get(`/api/patients/${patientUserId}/lab-results?type=Blood Test`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body.results).toBeDefined();
      response.body.results.forEach((result: any) => {
        expect(result.type).toBe('Blood Test');
      });
    });
  });
});
