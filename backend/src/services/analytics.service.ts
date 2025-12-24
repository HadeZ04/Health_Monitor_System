import { prisma } from '../config/database.js';

export class AnalyticsService {
  /**
   * Get overview analytics for specified date range and type
   */
  async getOverview(params: {
    from?: string;
    to?: string;
    type?: string;
  }) {
    const fromDate = params.from ? new Date(params.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = params.to ? new Date(params.to) : new Date();

    // General overview metrics
    const [
      totalPatients,
      activePatients,
      totalDoctors,
      activeDoctors,
      totalAppointments,
      completedAppointments,
      totalConsultations,
      highRiskPatients,
    ] = await Promise.all([
      prisma.patientProfile.count(),
      prisma.patientProfile.count({ where: { status: "active" } }),
      prisma.doctorProfile.count(),
      prisma.doctorProfile.count({ where: { status: "active" } }),
      prisma.appointment.count({
        where: {
          date: { gte: fromDate, lte: toDate },
        },
      }),
      prisma.appointment.count({
        where: {
          date: { gte: fromDate, lte: toDate },
          status: "confirmed",
        },
      }),
      prisma.consultation.count({
        where: {
          createdAt: { gte: fromDate, lte: toDate },
        },
      }),
      prisma.patientProfile.count({
        where: { riskLevel: "high" },
      }),
    ]);

    // Trend data
    const appointmentTrend = await this.getAppointmentTrend(fromDate, toDate);
    const consultationTrend = await this.getConsultationTrend(fromDate, toDate);

    return {
      overview: {
        totalPatients,
        activePatients,
        totalDoctors,
        activeDoctors,
        totalAppointments,
        completedAppointments,
        totalConsultations,
        highRiskPatients,
      },
      trends: {
        appointments: appointmentTrend,
        consultations: consultationTrend,
      },
      period: {
        from: fromDate,
        to: toDate,
      },
    };
  }

  /**
   * Get patient analytics
   */
  async getPatientAnalytics() {
    // Patient distribution by risk level
    const riskDistribution = await prisma.patientProfile.groupBy({
      by: ["riskLevel"],
      _count: true,
    });

    // Patient distribution by gender
    const genderDistribution = await prisma.patientProfile.groupBy({
      by: ["gender"],
      _count: true,
      where: {
        gender: { not: null },
      },
    });

    // Age distribution
    const patients = await prisma.patientProfile.findMany({
      where: { age: { not: null } },
      select: { age: true },
    });

    const ageGroups = {
      "0-18": 0,
      "19-30": 0,
      "31-50": 0,
      "51-70": 0,
      "71+": 0,
    };

    patients.forEach((p) => {
      if (!p.age) return;
      if (p.age <= 18) ageGroups["0-18"]++;
      else if (p.age <= 30) ageGroups["19-30"]++;
      else if (p.age <= 50) ageGroups["31-50"]++;
      else if (p.age <= 70) ageGroups["51-70"]++;
      else ageGroups["71+"]++;
    });

    // New patients per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const newPatients = await prisma.patientProfile.groupBy({
      by: ["joinedDate"],
      where: {
        joinedDate: { gte: sixMonthsAgo },
      },
      _count: true,
    });

    const monthlyNewPatients = this.groupByMonth(newPatients, "joinedDate");

    // Top conditions
    const allConditions = await prisma.patientProfile.findMany({
      where: {
        conditions: { isEmpty: false },
      },
      select: { conditions: true },
    });

    const conditionCount = new Map<string, number>();
    allConditions.forEach((p) => {
      p.conditions.forEach((condition) => {
        conditionCount.set(condition, (conditionCount.get(condition) || 0) + 1);
      });
    });

    const topConditions = Array.from(conditionCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([condition, count]) => ({ condition, count }));

    return {
      riskDistribution: riskDistribution.map((r) => ({
        riskLevel: r.riskLevel,
        count: r._count,
      })),
      genderDistribution: genderDistribution.map((g) => ({
        gender: g.gender,
        count: g._count,
      })),
      ageDistribution: Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count,
      })),
      monthlyNewPatients,
      topConditions,
    };
  }

  /**
   * Get doctor analytics
   */
  async getDoctorAnalytics() {
    // Doctor distribution by specialty
    const specialtyDistribution = await prisma.doctorProfile.groupBy({
      by: ["specialty"],
      _count: true,
      where: {
        specialty: { not: null },
      },
    });

    // Doctor performance - consultations per doctor
    const doctorConsultations = await prisma.consultation.groupBy({
      by: ["doctorId"],
      _count: true,
      orderBy: {
        _count: {
          doctorId: "desc",
        },
      },
      take: 10,
    });

    // Enrich with doctor info
    const topDoctors = await Promise.all(
      doctorConsultations.map(async (dc) => {
        const doctor = await prisma.doctorProfile.findUnique({
          where: { id: dc.doctorId },
          include: {
            user: {
              select: { name: true },
            },
          },
        });
        return {
          doctorId: dc.doctorId,
          doctorName: doctor?.user?.name || "Unknown",
          specialty: doctor?.specialty,
          consultationCount: dc._count,
          rating: doctor?.rating || 0,
        };
      })
    );

    // Average rating by specialty
    const avgRatingBySpecialty = await prisma.doctorProfile.groupBy({
      by: ["specialty"],
      _avg: {
        rating: true,
      },
      where: {
        specialty: { not: null },
        rating: { not: null },
      },
    });

    // Doctor workload (active consultations)
    const workload = await prisma.consultation.groupBy({
      by: ["doctorId"],
      where: {
        status: { in: ["scheduled", "inProgress"] },
      },
      _count: true,
    });

    return {
      specialtyDistribution: specialtyDistribution.map((s) => ({
        specialty: s.specialty,
        count: s._count,
      })),
      topDoctors,
      avgRatingBySpecialty: avgRatingBySpecialty.map((s) => ({
        specialty: s.specialty,
        avgRating: s._avg.rating || 0,
      })),
      workload: workload.map((w) => ({
        doctorId: w.doctorId,
        activeConsultations: w._count,
      })),
    };
  }

  /**
   * Get appointment analytics
   */
  async getAppointmentAnalytics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Appointment status distribution
    const statusDistribution = await prisma.appointment.groupBy({
      by: ["status"],
      _count: true,
      where: {
        date: { gte: thirtyDaysAgo },
      },
    });

    // Appointments by day of week
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: thirtyDaysAgo },
      },
      select: { date: true },
    });

    const dayOfWeekCount = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    appointments.forEach((a) => {
      const dayName = dayNames[a.date.getDay()];
      dayOfWeekCount[dayName as keyof typeof dayOfWeekCount]++;
    });

    // Appointments by specialty
    const specialtyAppointments = await prisma.appointment.groupBy({
      by: ["specialty"],
      _count: true,
      where: {
        date: { gte: thirtyDaysAgo },
        specialty: { not: null },
      },
      orderBy: {
        _count: {
          specialty: "desc",
        },
      },
      take: 10,
    });

    // Daily appointment trend (last 30 days)
    const dailyTrend = await prisma.appointment.groupBy({
      by: ["date"],
      _count: true,
      where: {
        date: { gte: thirtyDaysAgo },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Average appointments per day
    const avgPerDay = dailyTrend.length > 0
      ? dailyTrend.reduce((sum, d) => sum + d._count, 0) / dailyTrend.length
      : 0;

    return {
      statusDistribution: statusDistribution.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      dayOfWeekDistribution: Object.entries(dayOfWeekCount).map(([day, count]) => ({
        day,
        count,
      })),
      specialtyDistribution: specialtyAppointments.map((s) => ({
        specialty: s.specialty,
        count: s._count,
      })),
      dailyTrend: dailyTrend.map((d) => ({
        date: d.date.toISOString().slice(0, 10),
        count: d._count,
      })),
      avgPerDay: Math.round(avgPerDay * 10) / 10,
    };
  }

  // ===== Helper Methods =====

  private async getAppointmentTrend(from: Date, to: Date) {
    const appointments = await prisma.appointment.groupBy({
      by: ["date"],
      _count: true,
      where: {
        date: { gte: from, lte: to },
      },
      orderBy: {
        date: "asc",
      },
    });

    return appointments.map((a) => ({
      date: a.date.toISOString().slice(0, 10),
      count: a._count,
    }));
  }

  private async getConsultationTrend(from: Date, to: Date) {
    const consultations = await prisma.consultation.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: { gte: from, lte: to },
      },
    });

    const dailyCount = new Map<string, number>();
    consultations.forEach((c) => {
      const date = c.createdAt.toISOString().slice(0, 10);
      dailyCount.set(date, (dailyCount.get(date) || 0) + c._count);
    });

    return Array.from(dailyCount.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupByMonth(data: any[], dateField: string) {
    const monthlyData = new Map<string, number>();

    data.forEach((item) => {
      const date = item[dateField];
      if (date) {
        const month = date.toISOString().slice(0, 7); // YYYY-MM
        monthlyData.set(month, (monthlyData.get(month) || 0) + item._count);
      }
    });

    return Array.from(monthlyData.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}

export const analyticsService = new AnalyticsService();
