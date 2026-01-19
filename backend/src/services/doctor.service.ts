/**
 * Doctor Service
 * Business logic for doctor-related operations
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Dashboard Data Types
 */
export interface DoctorDashboardData {
  stats: {
    todayAppointments: number;
    completedToday: number;
    patientsUnderCare: number;
    highRiskPatients: number;
    pendingLabOrders: number;
    urgentLabOrders: number;
    unreadMessages: number;
    highPriorityMessages: number;
  };
  todaySchedule: Array<{
    id: string;
    time: string;
    patientName: string | null;
    patientId: string;
    reason: string | null;
    status: string;
  }>;
  criticalAlerts: Array<{
    id: string;
    patientName: string | null;
    patientId: string;
    type: string;
    message: string;
    severity: string;
    createdAt: Date;
  }>;
}

/**
 * Get doctor dashboard data
 */
export const getDashboard = async (doctorId: string): Promise<DoctorDashboardData> => {
  // Verify doctor profile exists
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's appointments count
  const todayAppointments = await prisma.appointment.count({
    where: {
      doctorId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get completed consultations today
  const completedToday = await prisma.consultation.count({
    where: {
      doctorId: doctorProfile.id,
      status: 'completed',
      updatedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get patients under care (with recent consultations)
  const patientsUnderCare = await prisma.consultation.findMany({
    where: {
      doctorId: doctorProfile.id,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    distinct: ['patientId'],
    select: { patientId: true },
  });

  // Get high risk patients
  const highRiskPatients = await prisma.patientProfile.count({
    where: {
      riskLevel: 'high',
      consultations: {
        some: {
          doctorId: doctorProfile.id,
        },
      },
    },
  });

  // Get pending lab orders
  const pendingLabOrders = await prisma.labOrder.count({
    where: {
      doctorId: doctorProfile.id,
      status: 'pending',
    },
  });

  // Get urgent lab orders
  const urgentLabOrders = await prisma.labOrder.count({
    where: {
      doctorId: doctorProfile.id,
      priority: 'urgent',
      status: {
        in: ['pending', 'approved', 'inProgress'],
      },
    },
  });

  // Get unread messages
  const conversations = await prisma.conversation.findMany({
    where: { doctorId: doctorProfile.id },
    select: { id: true },
  });

  const conversationIds = conversations.map((c) => c.id);

  const unreadMessages = await prisma.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderRole: 'patient',
      readAt: null,
    },
  });

  // For high priority messages, we can count urgent conversations (simplified)
  const highPriorityMessages = await prisma.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderRole: 'patient',
      readAt: null,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  // Get today's schedule
  const todayScheduleAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { time: 'asc' },
  });

  const todaySchedule = todayScheduleAppointments.map((appt) => ({
    id: appt.id,
    time: appt.time,
    patientName: appt.patient.name,
    patientId: appt.patientId,
    reason: appt.reason,
    status: appt.status,
  }));

  // Get critical alerts (using Alert model)
  const criticalAlertsRaw = await prisma.alert.findMany({
    where: {
      type: { in: ['critical', 'urgent', 'high'] },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
      user: {
        patientProfile: {
          consultations: {
            some: {
              doctorId: doctorProfile.id,
            },
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          patientProfile: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const criticalAlerts = criticalAlertsRaw.map((alert) => ({
    id: alert.id,
    patientName: alert.user?.name || null,
    patientId: alert.user?.patientProfile?.id || '',
    type: alert.type,
    message: alert.message,
    severity: alert.type,
    createdAt: alert.createdAt,
  }));

  return {
    stats: {
      todayAppointments,
      completedToday,
      patientsUnderCare: patientsUnderCare.length,
      highRiskPatients,
      pendingLabOrders,
      urgentLabOrders,
      unreadMessages,
      highPriorityMessages,
    },
    todaySchedule,
    criticalAlerts,
  };
};

/**
 * Get doctor's patients list with filters
 */
export const getPatients = async (
  doctorId: string,
  filters: {
    search?: string;
    status?: string;
    priority?: string;
    gender?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const { search, status, priority, gender, sortBy = 'name', page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.PatientProfileWhereInput = {
    consultations: {
      some: {
        doctorId: doctorProfile.id,
      },
    },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (gender) {
    where.gender = gender;
  }

  if (priority) {
    // Map priority to risk level
    const riskMap: Record<string, string> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
    };
    where.riskLevel = riskMap[priority] as any;
  }

  // Build orderBy
  let orderBy: Prisma.PatientProfileOrderByWithRelationInput = {};
  switch (sortBy) {
    case 'name':
      orderBy = { name: 'asc' };
      break;
    case 'age':
      orderBy = { age: 'desc' };
      break;
    case 'riskLevel':
      orderBy = { riskLevel: 'desc' };
      break;
    case 'lastVisit':
      orderBy = { updatedAt: 'desc' };
      break;
    default:
      orderBy = { name: 'asc' };
  }

  // Get patients
  const [patients, total] = await Promise.all([
    prisma.patientProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        patientVitals: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          distinct: ['type'],
        },
        consultations: {
          where: { doctorId: doctorProfile.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
    prisma.patientProfile.count({ where }),
  ]);

  // Format response
  const patientsData = patients.map((patient) => {
    const latestVitals: Record<string, any> = {};
    patient.patientVitals.forEach((vital) => {
      latestVitals[vital.type] = {
        value: vital.value,
        status: vital.status,
        timestamp: vital.timestamp,
      };
    });

    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType,
      riskLevel: patient.riskLevel,
      healthScore: patient.healthScore,
      email: patient.user?.email,
      phone: patient.user?.phone,
      lastVisit: patient.consultations[0]?.createdAt || null,
      vitals: latestVitals,
    };
  });

  return {
    data: patientsData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get patient detail
 */
export const getPatientDetail = async (doctorId: string, patientId: string) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const patient = await prisma.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      user: {
        select: {
          email: true,
          phone: true,
          avatar: true,
        },
      },
      medications: true,
      appointments: {
        where: { doctorId },
        orderBy: { date: 'desc' },
        take: 5,
      },
      consultations: {
        where: { doctorId: doctorProfile.id },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!patient) {
    throw new NotFoundError('Patient not found');
  }

  return patient;
};

/**
 * Get patient medical history
 */
export const getPatientHistory = async (
  doctorId: string,
  patientId: string,
  filters: {
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const { type = 'all', from, to, limit = 50 } = filters;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  const history: any = {};

  if (type === 'all' || type === 'consultations') {
    history.consultations = await prisma.consultation.findMany({
      where: {
        patientId,
        doctorId: doctorProfile.id,
        ...(from || to ? { createdAt: dateFilter } : {}),
      },
      include: {
        prescriptions: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  if (type === 'all' || type === 'labOrders') {
    history.labOrders = await prisma.labOrder.findMany({
      where: {
        patientId,
        doctorId: doctorProfile.id,
        ...(from || to ? { createdAt: dateFilter } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  if (type === 'all' || type === 'appointments') {
    history.appointments = await prisma.appointment.findMany({
      where: {
        patientId,
        doctorId,
        ...(from || to ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  return history;
};

/**
 * Get patient vitals
 */
export const getPatientVitals = async (
  doctorId: string,
  patientId: string,
  filters: {
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const { type, from, to, limit = 100 } = filters;

  const where: Prisma.PatientVitalWhereInput = {
    patientId,
  };

  if (type) {
    where.type = type as any;
  }

  if (from || to) {
    where.timestamp = {};
    if (from) where.timestamp.gte = new Date(from);
    if (to) where.timestamp.lte = new Date(to);
  }

  const vitals = await prisma.patientVital.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  });

  return vitals;
};

/**
 * Create consultation
 */
export const createConsultation = async (
  doctorId: string,
  data: {
    patientId: string;
    symptoms?: any;
    diagnosis?: string;
    notes?: string;
    nextAppointment?: string;
    prescriptions?: Array<{
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    labOrders?: Array<{
      testType: string;
      priority: 'normal' | 'urgent';
      notes?: string;
    }>;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  // Verify patient exists
  const patient = await prisma.patientProfile.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) {
    throw new NotFoundError('Patient not found');
  }

  // Create consultation with prescriptions and lab orders
  const consultation = await prisma.consultation.create({
    data: {
      doctorId: doctorProfile.id,
      patientId: data.patientId,
      symptoms: data.symptoms || null,
      diagnosis: data.diagnosis,
      notes: data.notes,
      nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : null,
      status: 'completed',
      prescriptions: data.prescriptions
        ? {
            create: data.prescriptions,
          }
        : undefined,
    },
    include: {
      prescriptions: true,
    },
  });

  // Create lab orders if provided
  if (data.labOrders && data.labOrders.length > 0) {
    await prisma.labOrder.createMany({
      data: data.labOrders.map((order) => ({
        doctorId: doctorProfile.id,
        patientId: data.patientId,
        testType: order.testType,
        priority: order.priority,
        notes: order.notes,
        status: 'pending',
      })),
    });
  }

  // Create appointment if nextAppointment is provided
  if (data.nextAppointment) {
    const appointmentDate = new Date(data.nextAppointment);
    await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId,
        doctorName: doctorProfile.user?.name || 'Doctor',
        specialty: doctorProfile.specialty,
        date: appointmentDate,
        time: appointmentDate.toTimeString().slice(0, 5),
        status: 'confirmed',
        type: 'follow-up',
        reason: 'Follow-up consultation',
      },
    });
  }

  return consultation;
};

/**
 * Update consultation
 */
export const updateConsultation = async (
  doctorId: string,
  consultationId: string,
  data: {
    symptoms?: any;
    diagnosis?: string;
    notes?: string;
    status?: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
    nextAppointment?: string;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  // Verify consultation exists and belongs to doctor
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  });

  if (!consultation) {
    throw new NotFoundError('Consultation not found');
  }

  if (consultation.doctorId !== doctorProfile.id) {
    throw new ForbiddenError('You do not have access to this consultation');
  }

  // Update consultation
  const updated = await prisma.consultation.update({
    where: { id: consultationId },
    data: {
      symptoms: data.symptoms !== undefined ? data.symptoms : undefined,
      diagnosis: data.diagnosis,
      notes: data.notes,
      status: data.status,
      nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : undefined,
    },
    include: {
      prescriptions: true,
    },
  });

  return updated;
};

/**
 * Get consultation by ID
 */
export const getConsultation = async (doctorId: string, consultationId: string) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
    include: {
      prescriptions: true,
      patient: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!consultation) {
    throw new NotFoundError('Consultation not found');
  }

  if (consultation.doctorId !== doctorProfile.id) {
    throw new ForbiddenError('You do not have access to this consultation');
  }

  return consultation;
};

/**
 * Get doctor schedule
 */
export const getSchedule = async (
  doctorId: string,
  filters: { from?: string; to?: string }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const where: Prisma.DoctorScheduleWhereInput = {
    doctorId: doctorProfile.id,
    isActive: true,
  };

  if (filters.from || filters.to) {
    where.AND = [];
    if (filters.from) {
      where.AND.push({
        OR: [
          { toDate: null },
          { toDate: { gte: new Date(filters.from) } },
        ],
      });
    }
    if (filters.to) {
      where.AND.push({
        fromDate: { lte: new Date(filters.to) },
      });
    }
  }

  const schedules = await prisma.doctorSchedule.findMany({
    where,
    orderBy: [{ dayOfWeek: 'asc' }],
  });

  return schedules;
};

/**
 * Update doctor schedule
 */
export const updateSchedule = async (
  doctorId: string,
  schedules: Array<{
    dayOfWeek: number;
    timeSlots: any;
    fromDate: string;
    toDate?: string;
    isActive?: boolean;
  }>
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  // Delete existing schedules for the doctor
  await prisma.doctorSchedule.deleteMany({
    where: { doctorId: doctorProfile.id },
  });

  // Create new schedules
  const created = await prisma.doctorSchedule.createMany({
    data: schedules.map((schedule) => ({
      doctorId: doctorProfile.id,
      dayOfWeek: schedule.dayOfWeek,
      timeSlots: schedule.timeSlots,
      fromDate: new Date(schedule.fromDate),
      toDate: schedule.toDate ? new Date(schedule.toDate) : null,
      isActive: schedule.isActive ?? true,
    })),
  });

  return created;
};

/**
 * Get lab orders
 */
export const getLabOrders = async (
  doctorId: string,
  filters: {
    status?: string;
    priority?: string;
    patientId?: string;
    page?: number;
    limit?: number;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const { status, priority, patientId, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.LabOrderWhereInput = {
    doctorId: doctorProfile.id,
  };

  if (status) {
    where.status = status as any;
  }

  if (priority) {
    where.priority = priority as any;
  }

  if (patientId) {
    where.patientId = patientId;
  }

  const [labOrders, total] = await Promise.all([
    prisma.labOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.labOrder.count({ where }),
  ]);

  return {
    data: labOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Approve lab order
 */
export const approveLabOrder = async (doctorId: string, orderId: string) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const labOrder = await prisma.labOrder.findUnique({
    where: { id: orderId },
  });

  if (!labOrder) {
    throw new NotFoundError('Lab order not found');
  }

  // Only the doctor who created the order can approve it
  if (labOrder.doctorId !== doctorProfile.id) {
    throw new ForbiddenError('You do not have permission to approve this lab order');
  }

  const updated = await prisma.labOrder.update({
    where: { id: orderId },
    data: {
      status: 'approved',
      approvedBy: doctorId,
      approvedAt: new Date(),
    },
  });

  return updated;
};

/**
 * Get lab order results
 */
export const getLabOrderResults = async (doctorId: string, orderId: string) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const labOrder = await prisma.labOrder.findUnique({
    where: { id: orderId },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!labOrder) {
    throw new NotFoundError('Lab order not found');
  }

  if (labOrder.doctorId !== doctorProfile.id) {
    throw new ForbiddenError('You do not have access to this lab order');
  }

  return labOrder;
};

/**
 * Get messages (conversations)
 */
export const getMessages = async (
  doctorId: string,
  filters: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const { page = 1, limit = 50, unreadOnly = false } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.ConversationWhereInput = {
    doctorId: doctorProfile.id,
  };

  if (unreadOnly) {
    where.messages = {
      some: {
        senderRole: 'patient',
        readAt: null,
      },
    };
  }

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { lastMessageAt: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderRole: 'patient',
                readAt: null,
              },
            },
          },
        },
      },
    }),
    prisma.conversation.count({ where }),
  ]);

  return {
    data: conversations.map((conv) => ({
      id: conv.id,
      patientId: conv.patientId,
      patientName: conv.patient.name,
      patientAvatar: conv.patient.user?.avatar,
      lastMessage: conv.messages[0]?.content || null,
      lastMessageAt: conv.lastMessageAt,
      unreadCount: conv._count.messages,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Send message
 */
export const sendMessage = async (
  doctorId: string,
  data: {
    patientId: string;
    content: string;
  }
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  // Find or create conversation
  let conversation = await prisma.conversation.findUnique({
    where: {
      patientId_doctorId: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
        lastMessageAt: new Date(),
      },
    });
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: doctorId,
      senderRole: 'doctor',
      content: data.content,
    },
  });

  // Update conversation lastMessageAt
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  return message;
};

/**
 * Get conversation messages
 */
export const getConversationMessages = async (
  doctorId: string,
  conversationId: string,
  page: number = 1,
  limit: number = 50
) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorProfile) {
    throw new NotFoundError('Doctor profile not found');
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  if (conversation.doctorId !== doctorProfile.id) {
    throw new ForbiddenError('You do not have access to this conversation');
  }

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.message.count({ where: { conversationId } }),
  ]);

  // Mark patient messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderRole: 'patient',
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return {
    data: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Verify doctor access (for RBAC)
 */
export const verifyDoctorAccess = async (
  userId: string,
  userRole: string,
  doctorId: string
): Promise<boolean> => {
  // Admin can access any doctor
  if (userRole === 'admin') {
    return true;
  }

  // Doctor can only access their own data
  if (userRole === 'doctor') {
    return userId === doctorId;
  }

  return false;
};
