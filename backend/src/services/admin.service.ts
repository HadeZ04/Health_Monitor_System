import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  CreateDoctorInput,
  UpdateDoctorInput,
  CreatePatientInput,
  UpdatePatientInput,
  CreateRoleInput,
  UpdateRoleInput,
  UpdateRolePermissionsInput,
  UpdateSettingsInput,
  UserQueryInput,
  DoctorQueryInput,
  PatientQueryInput,
  AuditLogQueryInput,
} from "../validators/admin.validator";

export class AdminService {
  // ===== Dashboard =====
  async getDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // KPIs
    const [totalUsers, totalDoctors, totalPatients, totalAppointments] = await Promise.all([
      prisma.user.count({ where: { status: "active" } }),
      prisma.doctorProfile.count({ where: { status: "active" } }),
      prisma.patientProfile.count({ where: { status: "active" } }),
      prisma.appointment.count({
        where: {
          date: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    // Login Activity (last 7 days)
    const loginActivity = await this.getLoginActivity(sevenDaysAgo, now);

    // Appointment Trends (last 30 days)
    const appointmentTrends = await this.getAppointmentTrends(thirtyDaysAgo, now);

    // User Distribution by Role
    const userDistribution = await this.getUserDistribution();

    // Recent Activities (audit logs)
    const recentActivities = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Enrich recent activities with user info
    const enrichedActivities = await Promise.all(
      recentActivities.map(async (activity) => {
        const user = await prisma.user.findUnique({
          where: { id: activity.userId },
          select: { name: true, email: true },
        });
        return {
          id: activity.id,
          user: user?.name || user?.email || "Unknown",
          action: activity.action,
          targetType: activity.targetType,
          targetId: activity.targetId,
          timestamp: activity.createdAt,
          severity: activity.severity,
        };
      })
    );

    return {
      kpi: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
      },
      charts: {
        loginActivity,
        appointmentTrends,
        userDistribution,
      },
      recentActivities: enrichedActivities,
    };
  }

  private async getLoginActivity(from: Date, to: Date) {
    const logins = await prisma.user.groupBy({
      by: ["lastLogin"],
      where: {
        lastLogin: {
          gte: from,
          lte: to,
        },
      },
      _count: true,
    });

    // Group by date
    const activityMap = new Map<string, number>();
    logins.forEach((login) => {
      if (login.lastLogin) {
        const dateKey = login.lastLogin.toISOString().slice(0, 10);
        activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + login._count);
      }
    });

    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getAppointmentTrends(from: Date, to: Date) {
    const appointments = await prisma.appointment.groupBy({
      by: ["date"],
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      _count: true,
    });

    return appointments.map((appt) => ({
      date: appt.date.toISOString().slice(0, 10),
      count: appt._count,
    }));
  }

  private async getUserDistribution() {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return roles.map((role) => ({
      role: role.name,
      count: role._count.users,
    }));
  }

  // ===== Users Management =====
  async getUsers(query: UserQueryInput) {
    const { search, role, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = {
        name: role,
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    // Remove password from response
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return {
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createUser(data: CreateUserInput, adminId: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        roleId: data.roleId,
        status: data.status || "active",
      },
      include: {
        role: true,
      },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "CREATE_USER",
      targetType: "User",
      targetId: user.id,
      metadata: { email: user.email, name: user.name },
      severity: "info",
    });

    // Remove password from response
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async updateUser(userId: string, data: UpdateUserInput, adminId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        role: true,
      },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_USER",
      targetType: "User",
      targetId: user.id,
      metadata: data,
      severity: "info",
    });

    // Remove password from response
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async deleteUser(userId: string, adminId: string) {
    const user = await prisma.user.delete({
      where: { id: userId },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "DELETE_USER",
      targetType: "User",
      targetId: user.id,
      metadata: { email: user.email },
      severity: "warning",
    });

    return { message: "User deleted successfully" };
  }

  async lockUser(userId: string, adminId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: "locked" },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "LOCK_USER",
      targetType: "User",
      targetId: user.id,
      metadata: { email: user.email },
      severity: "warning",
    });

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async unlockUser(userId: string, adminId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: "active" },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UNLOCK_USER",
      targetType: "User",
      targetId: user.id,
      metadata: { email: user.email },
      severity: "info",
    });

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async resetPassword(userId: string, newPassword: string, adminId: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "RESET_PASSWORD",
      targetType: "User",
      targetId: userId,
      severity: "warning",
    });

    return { message: "Password reset successfully" };
  }

  // ===== Doctors Management =====
  async getDoctors(query: DoctorQueryInput) {
    const { search, specialty, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.user = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (specialty) {
      where.specialty = { contains: specialty, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    const [doctors, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
          _count: {
            select: {
              consultations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.doctorProfile.count({ where }),
    ]);

    return {
      doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createDoctor(data: CreateDoctorInput, adminId: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Find or create doctor role
    let doctorRole = await prisma.role.findFirst({ where: { name: "doctor" } });
    if (!doctorRole) {
      doctorRole = await prisma.role.create({
        data: { name: "doctor", description: "Doctor role" },
      });
    }

    const doctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          roleId: doctorRole!.id,
          status: "active",
        },
      });

      const profile = await tx.doctorProfile.create({
        data: {
          userId: user.id,
          specialty: data.specialty,
          experience: data.experience,
          license: data.license,
          bio: data.bio,
          status: (data.status as any) || "active",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
        },
      });

      return profile;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "CREATE_DOCTOR",
      targetType: "DoctorProfile",
      targetId: doctor.id,
      metadata: { email: data.email, name: data.name, specialty: data.specialty },
      severity: "info",
    });

    return doctor;
  }

  async updateDoctor(doctorId: string, data: UpdateDoctorInput, adminId: string) {
    const doctor = await prisma.$transaction(async (tx) => {
      const profile = await tx.doctorProfile.findUnique({
        where: { id: doctorId },
        include: { user: true },
      });

      if (!profile) {
        throw new Error("Doctor not found");
      }

      // Update user info if provided
      if (data.name || data.phone) {
        await tx.user.update({
          where: { id: profile.userId },
          data: {
            name: data.name,
            phone: data.phone,
          },
        });
      }

      // Update doctor profile
      const updated = await tx.doctorProfile.update({
        where: { id: doctorId },
        data: {
          specialty: data.specialty,
          experience: data.experience,
          license: data.license,
          bio: data.bio,
          status: data.status as any,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
        },
      });

      return updated;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_DOCTOR",
      targetType: "DoctorProfile",
      targetId: doctorId,
      metadata: data,
      severity: "info",
    });

    return doctor;
  }

  async deleteDoctor(doctorId: string, adminId: string) {
    const doctor = await prisma.$transaction(async (tx) => {
      const profile = await tx.doctorProfile.findUnique({
        where: { id: doctorId },
        include: { user: true },
      });

      if (!profile) {
        throw new Error("Doctor not found");
      }

      await tx.doctorProfile.delete({ where: { id: doctorId } });
      await tx.user.delete({ where: { id: profile.userId } });

      return profile;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "DELETE_DOCTOR",
      targetType: "DoctorProfile",
      targetId: doctorId,
      metadata: { email: doctor.user.email },
      severity: "warning",
    });

    return { message: "Doctor deleted successfully" };
  }

  async getDoctorPerformance(doctorId: string) {
    const [totalConsultations, completedConsultations, totalPatients, avgRating] =
      await Promise.all([
        prisma.consultation.count({
          where: { doctorId },
        }),
        prisma.consultation.count({
          where: {
            doctorId,
            status: "completed",
          },
        }),
        prisma.consultation.findMany({
          where: { doctorId },
          distinct: ["patientId"],
        }).then((result) => result.length),
        prisma.doctorProfile
          .findUnique({
            where: { id: doctorId },
            select: { rating: true },
          })
          .then((doc) => doc?.rating || 0),
      ]);

    // Get consultations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const consultationsByMonth = await prisma.consultation.groupBy({
      by: ["createdAt"],
      where: {
        doctorId,
        createdAt: { gte: sixMonthsAgo },
      },
      _count: true,
    });

    const monthlyData = consultationsByMonth.reduce((acc: any, item) => {
      const month = item.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + item._count;
      return acc;
    }, {});

    return {
      totalConsultations,
      completedConsultations,
      totalPatients,
      avgRating,
      monthlyConsultations: Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      })),
    };
  }

  // ===== Patients Management =====
  async getPatients(query: PatientQueryInput) {
    const { search, riskLevel, gender, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { user: { email: { contains: search, mode: "insensitive" } } },
        { name: { contains: search, mode: "insensitive" } },
        { patientCode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    if (gender) {
      where.gender = gender;
    }

    if (status) {
      where.status = status;
    }

    const [patients, total] = await Promise.all([
      prisma.patientProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
          _count: {
            select: {
              appointments: true,
              consultations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.patientProfile.count({ where }),
    ]);

    return {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPatient(data: CreatePatientInput, adminId: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Find or create patient role
    let patientRole = await prisma.role.findFirst({ where: { name: "patient" } });
    if (!patientRole) {
      patientRole = await prisma.role.create({
        data: { name: "patient", description: "Patient role" },
      });
    }

    // Generate patient code
    const patientCode = `P${Date.now().toString().slice(-8)}`;

    const patient = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          roleId: patientRole!.id,
          status: "active",
        },
      });

      const profile = await tx.patientProfile.create({
        data: {
          userId: user.id,
          patientCode,
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodType: data.bloodType,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          address: data.address,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          doctorId: data.doctorId,
          riskLevel: (data.riskLevel as any) || "low",
          conditions: data.conditions || [],
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
        },
      });

      return profile;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "CREATE_PATIENT",
      targetType: "PatientProfile",
      targetId: patient.id,
      metadata: { email: data.email, name: data.name, patientCode },
      severity: "info",
    });

    return patient;
  }

  async updatePatient(patientId: string, data: UpdatePatientInput, adminId: string) {
    const patient = await prisma.$transaction(async (tx) => {
      const profile = await tx.patientProfile.findUnique({
        where: { id: patientId },
        include: { user: true },
      });

      if (!profile) {
        throw new Error("Patient not found");
      }

      // Update user info if provided
      if (data.name || data.phone) {
        await tx.user.update({
          where: { id: profile.userId! },
          data: {
            name: data.name,
            phone: data.phone,
          },
        });
      }

      // Update patient profile
      const updated = await tx.patientProfile.update({
        where: { id: patientId },
        data: {
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodType: data.bloodType,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          address: data.address,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          doctorId: data.doctorId,
          riskLevel: data.riskLevel as any,
          conditions: data.conditions,
          status: data.status,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
        },
      });

      return updated;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_PATIENT",
      targetType: "PatientProfile",
      targetId: patientId,
      metadata: data,
      severity: "info",
    });

    return patient;
  }

  async deletePatient(patientId: string, adminId: string) {
    const patient = await prisma.$transaction(async (tx) => {
      const profile = await tx.patientProfile.findUnique({
        where: { id: patientId },
        include: { user: true },
      });

      if (!profile) {
        throw new Error("Patient not found");
      }

      await tx.patientProfile.delete({ where: { id: patientId } });
      if (profile.userId) {
        await tx.user.delete({ where: { id: profile.userId } });
      }

      return profile;
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "DELETE_PATIENT",
      targetType: "PatientProfile",
      targetId: patientId,
      metadata: { email: patient.user?.email, patientCode: patient.patientCode },
      severity: "warning",
    });

    return { message: "Patient deleted successfully" };
  }

  async getPatientDetails(patientId: string) {
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatar: true,
            status: true,
          },
        },
        appointments: {
          take: 5,
          orderBy: { date: "desc" },
        },
        consultations: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        labResults: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        medications: true,
        patientVitals: {
          take: 10,
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    return patient;
  }

  // ===== Roles & Permissions =====
  async getRoles() {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return roles;
  }

  async createRole(data: CreateRoleInput, adminId: string) {
    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "CREATE_ROLE",
      targetType: "Role",
      targetId: role.id,
      metadata: { name: role.name },
      severity: "info",
    });

    return role;
  }

  async updateRole(roleId: string, data: UpdateRoleInput, adminId: string) {
    const role = await prisma.role.update({
      where: { id: roleId },
      data,
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_ROLE",
      targetType: "Role",
      targetId: roleId,
      metadata: data,
      severity: "info",
    });

    return role;
  }

  async deleteRole(roleId: string, adminId: string) {
    // Check if role has users
    const usersCount = await prisma.user.count({
      where: { roleId },
    });

    if (usersCount > 0) {
      throw new Error("Cannot delete role with assigned users");
    }

    const role = await prisma.role.delete({
      where: { id: roleId },
    });

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "DELETE_ROLE",
      targetType: "Role",
      targetId: roleId,
      metadata: { name: role.name },
      severity: "warning",
    });

    return { message: "Role deleted successfully" };
  }

  async getRolePermissions(roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    return role.permissions.map((rp) => rp.permission);
  }

  async updateRolePermissions(
    roleId: string,
    data: UpdateRolePermissionsInput,
    adminId: string
  ) {
    // Remove existing permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Add new permissions
    const rolePermissions = await Promise.all(
      data.permissionIds.map((permissionId) =>
        prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
          include: {
            permission: true,
          },
        })
      )
    );

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_ROLE_PERMISSIONS",
      targetType: "Role",
      targetId: roleId,
      metadata: { permissionIds: data.permissionIds },
      severity: "warning",
    });

    return rolePermissions.map((rp) => rp.permission);
  }

  // ===== System Logs =====
  async getLogs(query: AuditLogQueryInput) {
    const { type, severity, userId, from, to, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.action = { contains: type, mode: "insensitive" };
    }

    if (severity) {
      where.severity = severity;
    }

    if (userId) {
      where.userId = userId;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Enrich with user info
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const user = await prisma.user.findUnique({
          where: { id: log.userId },
          select: { name: true, email: true },
        });
        return {
          ...log,
          userName: user?.name || user?.email || "Unknown",
        };
      })
    );

    return {
      logs: enrichedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== System Settings =====
  async getSettings() {
    const settings = await prisma.systemSetting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    // Group by category
    const grouped = settings.reduce((acc: any, setting) => {
      const category = setting.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        updatedBy: setting.updatedBy,
        updatedAt: setting.updatedAt,
      });
      return acc;
    }, {});

    return grouped;
  }

  async updateSettings(data: UpdateSettingsInput, adminId: string) {
    const results = await Promise.all(
      data.settings.map(async (setting) => {
        const existing = await prisma.systemSetting.findUnique({
          where: { key: setting.key },
        });

        if (existing) {
          return prisma.systemSetting.update({
            where: { key: setting.key },
            data: {
              value: setting.value,
              category: setting.category,
              updatedBy: adminId,
            },
          });
        } else {
          return prisma.systemSetting.create({
            data: {
              key: setting.key,
              value: setting.value,
              category: setting.category,
              updatedBy: adminId,
            },
          });
        }
      })
    );

    // Log audit
    await this.logAudit({
      userId: adminId,
      action: "UPDATE_SETTINGS",
      targetType: "SystemSetting",
      metadata: { settings: data.settings.map((s) => s.key) },
      severity: "warning",
    });

    return results;
  }

  // ===== Helper: Audit Logging =====
  private async logAudit(data: {
    userId: string;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: any;
    severity: "info" | "warning" | "error" | "critical";
  }) {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        metadata: data.metadata,
        severity: data.severity,
      },
    });
  }
}

export const adminService = new AdminService();
