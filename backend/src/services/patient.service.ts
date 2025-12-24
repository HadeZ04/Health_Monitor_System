/**
 * Patient Service
 * Business logic for patient-related operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dashboard Data Types
 */
export interface DashboardData {
  profile: {
    id: string;
    name: string | null;
    email: string;
    age: number | null;
    gender: string | null;
    bloodType: string | null;
    healthScore: number;
    riskLevel: string;
    emergencyContact: string | null;
  };
  latestVitals: Array<{
    type: string;
    value: any;
    unit: string | null;
    timestamp: Date;
    status: string | null;
  }>;
  upcomingAppointments: Array<{
    id: string;
    doctorName: string | null;
    specialty: string | null;
    date: Date;
    time: string;
    status: string;
    type: string | null;
    reason: string | null;
  }>;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string | null;
    taken: boolean;
    nextDose: Date | null;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: Date;
  }>;
  healthScore: number;
}

/**
 * Get patient dashboard data
 */
export const getDashboard = async (patientId: string): Promise<DashboardData> => {
  // Get user and patient profile
  const user = await prisma.user.findUnique({
    where: { id: patientId },
    include: {
      patientProfile: true,
    },
  });

  if (!user || !user.patientProfile) {
    throw new Error('Patient not found');
  }

  const profile = user.patientProfile;

  // Get latest vitals (one per type)
  const vitalTypes = ['bloodPressure', 'heartRate', 'glucose', 'spo2', 'temperature', 'weight'];
  const latestVitalsPromises = vitalTypes.map(async (type) => {
    const vital = await prisma.patientVital.findFirst({
      where: {
        patientId: profile.id,
        type: type as any,
      },
      orderBy: { timestamp: 'desc' },
    });
    return vital;
  });

  const vitalsResults = await Promise.all(latestVitalsPromises);
  const latestVitals = vitalsResults
    .filter((v) => v !== null)
    .map((v) => ({
      type: v!.type,
      value: v!.value,
      unit: v!.unit,
      timestamp: v!.timestamp,
      status: v!.status,
    }));

  // Get upcoming appointments
  const now = new Date();
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      patientId: profile.id,
      date: { gte: now },
      status: { in: ['confirmed', 'pending'] },
    },
    orderBy: { date: 'asc' },
    take: 5,
  });

  // Get today's medications
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const medications = await prisma.medicationSchedule.findMany({
    where: {
      patientId: profile.id,
      OR: [
        {
          nextDose: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        {
          nextDose: null,
        },
      ],
    },
    include: {
      medication: true,
    },
    take: 10,
  });

  // Mock notifications (TODO: implement real notifications)
  const notifications = [
    {
      id: '1',
      type: 'appointment',
      message: 'You have an upcoming appointment',
      createdAt: new Date(),
    },
  ];

  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: profile.age,
      gender: profile.gender,
      bloodType: profile.bloodType,
      healthScore: profile.healthScore || 75,
      riskLevel: profile.riskLevel,
      emergencyContact: profile.emergencyContact,
    },
    latestVitals,
    upcomingAppointments: upcomingAppointments.map((apt) => ({
      id: apt.id,
      doctorName: apt.doctorName,
      specialty: apt.specialty,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      type: apt.type,
      reason: apt.reason,
    })),
    medications: medications.map((med) => ({
      id: med.id,
      name: med.medication.name,
      dosage: med.dosage,
      time: med.time,
      taken: med.taken,
      nextDose: med.nextDose,
    })),
    notifications,
    healthScore: profile.healthScore || 75,
  };
};

/**
 * Get patient vitals history
 */
export const getVitalsHistory = async (
  patientId: string,
  filters: {
    type?: string;
    from?: Date;
    to?: Date;
    limit?: number;
  }
) => {
  // Verify patient profile exists
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const where: any = {
    patientId: profile.id,
  };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.from || filters.to) {
    where.timestamp = {};
    if (filters.from) {
      where.timestamp.gte = filters.from;
    }
    if (filters.to) {
      where.timestamp.lte = filters.to;
    }
  }

  const vitals = await prisma.patientVital.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: filters.limit || 100,
  });

  return vitals;
};

/**
 * Get patient appointments
 */
export const getAppointments = async (
  patientId: string,
  filters: {
    status?: string;
    from?: Date;
    to?: Date;
    upcoming?: boolean;
  }
) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const where: any = {
    patientId: profile.id,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.upcoming) {
    where.date = { gte: new Date() };
  } else if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) {
      where.date.gte = filters.from;
    }
    if (filters.to) {
      where.date.lte = filters.to;
    }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { date: filters.upcoming ? 'asc' : 'desc' },
  });

  return appointments;
};

/**
 * Create appointment
 */
export const createAppointment = async (
  patientId: string,
  data: {
    doctorId?: string;
    doctorName?: string;
    specialty?: string;
    date: Date;
    time: string;
    type?: string;
    reason?: string;
    notes?: string;
  }
) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: profile.id,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      specialty: data.specialty,
      date: data.date,
      time: data.time,
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      status: 'pending',
    },
  });

  return appointment;
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  patientId: string,
  appointmentId: string,
  data: Partial<{
    doctorId: string;
    doctorName: string;
    specialty: string;
    date: Date;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    type: string;
    reason: string;
    notes: string;
  }>
) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  // Verify appointment belongs to patient
  const existing = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      patientId: profile.id,
    },
  });

  if (!existing) {
    throw new Error('Appointment not found');
  }

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data,
  });

  return appointment;
};

/**
 * Delete appointment
 */
export const deleteAppointment = async (patientId: string, appointmentId: string) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  // Verify appointment belongs to patient
  const existing = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      patientId: profile.id,
    },
  });

  if (!existing) {
    throw new Error('Appointment not found');
  }

  await prisma.appointment.delete({
    where: { id: appointmentId },
  });

  return { success: true };
};

/**
 * Get patient medications
 */
export const getMedications = async (patientId: string) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const medications = await prisma.medication.findMany({
    where: {
      patientId: profile.id,
    },
    include: {
      medicationSchedules: {
        orderBy: { nextDose: 'asc' },
        take: 1,
      },
    },
  });

  return medications;
};

/**
 * Get medication schedule
 */
export const getMedicationSchedule = async (patientId: string) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const schedules = await prisma.medicationSchedule.findMany({
    where: {
      patientId: profile.id,
    },
    include: {
      medication: true,
    },
    orderBy: { nextDose: 'asc' },
  });

  return schedules;
};

/**
 * Mark medication as taken
 */
export const takeMedication = async (
  patientId: string,
  medicationId: string,
  data: {
    scheduleId?: string;
    taken?: boolean;
    notes?: string;
    timestamp?: Date;
  }
) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  // If scheduleId provided, update that specific schedule
  if (data.scheduleId) {
    const schedule = await prisma.medicationSchedule.findFirst({
      where: {
        id: data.scheduleId,
        patientId: profile.id,
      },
    });

    if (!schedule) {
      throw new Error('Medication schedule not found');
    }

    const updated = await prisma.medicationSchedule.update({
      where: { id: data.scheduleId },
      data: {
        taken: data.taken ?? true,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  // Otherwise, find the next dose for this medication
  const schedule = await prisma.medicationSchedule.findFirst({
    where: {
      patientId: profile.id,
      medicationId,
      taken: false,
    },
    orderBy: { nextDose: 'asc' },
  });

  if (!schedule) {
    throw new Error('No pending medication schedule found');
  }

  const updated = await prisma.medicationSchedule.update({
    where: { id: schedule.id },
    data: {
      taken: data.taken ?? true,
      updatedAt: new Date(),
    },
  });

  return updated;
};

/**
 * Get lab results
 */
export const getLabResults = async (
  patientId: string,
  filters: {
    type?: string;
    status?: string;
    from?: Date;
    to?: Date;
  }
) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const where: any = {
    patientId: profile.id,
  };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      where.createdAt.gte = filters.from;
    }
    if (filters.to) {
      where.createdAt.lte = filters.to;
    }
  }

  const results = await prisma.labResult.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return results;
};

/**
 * Get single lab result
 */
export const getLabResult = async (patientId: string, resultId: string) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId: patientId },
  });

  if (!profile) {
    throw new Error('Patient profile not found');
  }

  const result = await prisma.labResult.findFirst({
    where: {
      id: resultId,
      patientId: profile.id,
    },
  });

  if (!result) {
    throw new Error('Lab result not found');
  }

  return result;
};

/**
 * Verify patient access (for RBAC)
 */
export const verifyPatientAccess = async (
  userId: string,
  patientId: string,
  userRole: string
): Promise<boolean> => {
  // Admin and doctors can access any patient
  if (userRole === 'admin' || userRole === 'doctor') {
    return true;
  }

  // Patients can only access their own data
  if (userRole === 'patient') {
    return userId === patientId;
  }

  return false;
};
