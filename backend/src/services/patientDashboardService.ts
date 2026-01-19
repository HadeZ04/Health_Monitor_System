/**
 * Patient Dashboard Service
 * Business logic for patient dashboard data
 */

import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export interface PatientDashboardData {
  profile: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
    avatar?: string;
  };
  latestVitals: Array<{
    label: string;
    value: string;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
    timestamp: Date;
  }>;
  upcomingAppointments: Array<{
    id: string;
    doctor: string;
    specialty: string;
    date: Date;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  }>;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    nextDose: Date;
  }>;
  notifications: Array<{
    id: string;
    type: 'appointment' | 'medication' | 'result' | 'alert';
    message: string;
    time: Date;
    unread: boolean;
  }>;
  healthScore: number;
}

export class PatientDashboardService {
  /**
   * Get complete dashboard data for a patient
   */
  async getDashboard(patientId: string): Promise<PatientDashboardData> {
    logger.info('Fetching dashboard data', { patientId });

    // Fetch patient profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!patientProfile) {
      throw new NotFoundError('Patient profile not found');
    }

    if (!patientProfile.userId) {
      throw new NotFoundError('Patient account not linked');
    }

    // Fetch data in parallel for better performance
    const [latestVitals, upcomingAppointments, medications, notifications] =
      await Promise.all([
        this.getLatestVitals(patientProfile.userId),
        this.getUpcomingAppointments(patientId),
        this.getMedications(patientId),
        this.getNotifications(patientProfile.userId),
      ]);

    // Calculate health score
    const healthScore = this.calculateHealthScore(latestVitals);

    return {
      profile: {
        name: patientProfile.name || 'N/A',
        age: this.calculateAge(patientProfile.dateOfBirth),
        gender: patientProfile.gender || 'N/A',
        bloodType: patientProfile.bloodType || 'N/A',
        avatar: patientProfile.user?.avatar ?? undefined,
      },
      latestVitals,
      upcomingAppointments,
      medications,
      notifications,
      healthScore,
    };
  }

  /**
   * Get latest vitals from signals
   */
  private async getLatestVitals(userId: string) {
    const signals = await prisma.signal.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
      take: 20,
    });

    // Group by type and get latest
    const vitalsMap = new Map();

    for (const signal of signals) {
      if (!vitalsMap.has(signal.type)) {
        vitalsMap.set(signal.type, signal);
      }
    }

    const vitals = Array.from(vitalsMap.values()).map((signal) => {
      const value = signal.value as any;
      let label = signal.type;
      let valueStr = 'N/A';
      let unit = '';
      let status: 'normal' | 'warning' | 'critical' = 'normal';

      // Parse different signal types
      switch (signal.type) {
        case 'heartrate':
          label = 'Heart Rate';
          valueStr = value?.bpm?.toString() || 'N/A';
          unit = 'bpm';
          status = this.assessHeartRate(value?.bpm);
          break;
        case 'spo2':
          label = 'SpO2';
          valueStr = value?.percentage?.toString() || 'N/A';
          unit = '%';
          status = this.assessSpO2(value?.percentage);
          break;
        case 'blood_pressure':
          label = 'Blood Pressure';
          valueStr = value ? `${value.systolic}/${value.diastolic}` : 'N/A';
          unit = 'mmHg';
          status = this.assessBloodPressure(value?.systolic, value?.diastolic);
          break;
        case 'glucose':
          label = 'Blood Glucose';
          valueStr = value?.level?.toString() || 'N/A';
          unit = 'mg/dL';
          status = this.assessGlucose(value?.level);
          break;
      }

      return {
        label,
        value: valueStr,
        unit,
        status,
        timestamp: signal.recordedAt,
      };
    });

    return vitals.slice(0, 4); // Return top 4 vitals
  }

  /**
   * Get upcoming appointments (mock data for now)
   */
  private async getUpcomingAppointments(patientId: string) {
    // TODO: Implement when Appointments table is created
    return [
      {
        id: '1',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: '10:00 AM',
        status: 'confirmed' as const,
      },
    ];
  }

  /**
   * Get medications (mock data for now)
   */
  private async getMedications(patientId: string) {
    // TODO: Implement when Medications table is created
    return [
      {
        id: '1',
        name: 'Aspirin',
        dosage: '100mg',
        time: '08:00 AM',
        taken: false,
        nextDose: new Date(Date.now() + 3600000),
      },
    ];
  }

  /**
   * Get notifications (mock data for now)
   */
  private async getNotifications(userId: string) {
    // TODO: Implement when Notifications table is created
    return [
      {
        id: '1',
        type: 'appointment' as const,
        message: 'You have an appointment tomorrow at 10:00 AM',
        time: new Date(),
        unread: true,
      },
    ];
  }

  /**
   * Calculate health score based on vitals
   */
  private calculateHealthScore(vitals: any[]): number {
    if (vitals.length === 0) return 75;

    let score = 100;
    const criticalCount = vitals.filter((v) => v.status === 'critical').length;
    const warningCount = vitals.filter((v) => v.status === 'warning').length;

    score -= criticalCount * 15;
    score -= warningCount * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date | null): number {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Vital assessment helpers
  private assessHeartRate(bpm: number | undefined): 'normal' | 'warning' | 'critical' {
    if (!bpm) return 'normal';
    if (bpm < 40 || bpm > 120) return 'critical';
    if (bpm < 60 || bpm > 100) return 'warning';
    return 'normal';
  }

  private assessSpO2(percentage: number | undefined): 'normal' | 'warning' | 'critical' {
    if (!percentage) return 'normal';
    if (percentage < 90) return 'critical';
    if (percentage < 95) return 'warning';
    return 'normal';
  }

  private assessBloodPressure(
    systolic: number | undefined,
    diastolic: number | undefined
  ): 'normal' | 'warning' | 'critical' {
    if (!systolic || !diastolic) return 'normal';
    if (systolic >= 180 || diastolic >= 120) return 'critical';
    if (systolic >= 140 || diastolic >= 90) return 'warning';
    return 'normal';
  }

  private assessGlucose(level: number | undefined): 'normal' | 'warning' | 'critical' {
    if (!level) return 'normal';
    if (level < 70 || level > 200) return 'critical';
    if (level < 80 || level > 140) return 'warning';
    return 'normal';
  }
}

// Export singleton instance
export const patientDashboardService = new PatientDashboardService();
