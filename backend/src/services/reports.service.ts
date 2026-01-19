import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

interface CreateReportInput {
  patientId: string;
  type: "medical" | "lab" | "consultation" | "summary" | "custom";
  title: string;
  description?: string;
  fileUrl?: string;
  metadata?: any;
  createdBy: string;
}

interface ShareReportInput {
  expiresInHours?: number;
}

export class ReportsService {
  /**
   * Get all reports for a patient
   */
  async getReportsByPatient(patientId: string, userId: string, userRole: string) {
    // Check permissions
    await this.checkAccess(patientId, userId, userRole);

    const reports = await prisma.reportModel.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        fileUrl: true,
        metadata: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        // Don't expose share token by default
      },
    });

    // Enrich with creator info
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const creator = await prisma.user.findUnique({
          where: { id: report.createdBy },
          select: { name: true, email: true },
        });

        return {
          ...report,
          createdByName: creator?.name || creator?.email || "Unknown",
        };
      })
    );

    return enrichedReports;
  }

  /**
   * Get single report by ID
   */
  async getReportById(reportId: string, userId: string, userRole: string) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
      include: {
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

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions
    await this.checkAccess(report.patientId, userId, userRole);

    // Get creator info
    const creator = await prisma.user.findUnique({
      where: { id: report.createdBy },
      select: { name: true, email: true },
    });

    return {
      ...report,
      createdByName: creator?.name || creator?.email || "Unknown",
    };
  }

  /**
   * Create a new report
   */
  async createReport(data: CreateReportInput) {
    // Verify patient exists
    const patient = await prisma.patientProfile.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Create report
    const report = await prisma.reportModel.create({
      data: {
        patientId: data.patientId,
        type: data.type,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        metadata: data.metadata || {},
        createdBy: data.createdBy,
      },
      include: {
        patient: {
          select: {
            name: true,
            patientCode: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit({
      userId: data.createdBy,
      action: "CREATE_REPORT",
      targetType: "Report",
      targetId: report.id,
      metadata: { patientId: data.patientId, type: data.type, title: data.title },
    });

    return report;
  }

  /**
   * Update a report
   */
  async updateReport(
    reportId: string,
    data: Partial<CreateReportInput>,
    userId: string,
    userRole: string
  ) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions
    await this.checkAccess(report.patientId, userId, userRole);

    // Update report
    const updated = await prisma.reportModel.update({
      where: { id: reportId },
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        metadata: data.metadata,
      },
    });

    // Log audit
    await this.logAudit({
      userId,
      action: "UPDATE_REPORT",
      targetType: "Report",
      targetId: reportId,
      metadata: data,
    });

    return updated;
  }

  /**
   * Delete a report
   */
  async deleteReport(reportId: string, userId: string, userRole: string) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions (only admin or creator can delete)
    if (userRole !== "admin" && report.createdBy !== userId) {
      throw new Error("Insufficient permissions to delete this report");
    }

    await prisma.reportModel.delete({
      where: { id: reportId },
    });

    // Log audit
    await this.logAudit({
      userId,
      action: "DELETE_REPORT",
      targetType: "Report",
      targetId: reportId,
      metadata: { patientId: report.patientId },
    });

    return { message: "Report deleted successfully" };
  }

  /**
   * Generate share link for report
   */
  async shareReport(reportId: string, params: ShareReportInput, userId: string, userRole: string) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions
    await this.checkAccess(report.patientId, userId, userRole);

    // Generate share token
    const shareToken = this.generateShareToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (params.expiresInHours || 24));

    // Update report with share token
    const updated = await prisma.reportModel.update({
      where: { id: reportId },
      data: {
        shareToken,
        sharedAt: new Date(),
        expiresAt,
      },
    });

    // Log audit
    await this.logAudit({
      userId,
      action: "SHARE_REPORT",
      targetType: "Report",
      targetId: reportId,
      metadata: { expiresAt },
    });

    // Generate share URL
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/api/reports/shared/${shareToken}`;

    return {
      shareToken,
      shareUrl,
      expiresAt,
    };
  }

  /**
   * Get report by share token (public access)
   */
  async getReportByShareToken(shareToken: string) {
    const report = await prisma.reportModel.findUnique({
      where: { shareToken },
      include: {
        patient: {
          select: {
            name: true,
            patientCode: true,
            age: true,
            gender: true,
          },
        },
      },
    });

    if (!report) {
      throw new Error("Report not found or invalid share link");
    }

    // Check if link has expired
    if (report.expiresAt && report.expiresAt < new Date()) {
      throw new Error("Share link has expired");
    }

    // Don't expose sensitive patient data in shared reports
    return {
      id: report.id,
      type: report.type,
      title: report.title,
      description: report.description,
      fileUrl: report.fileUrl,
      metadata: report.metadata,
      createdAt: report.createdAt,
      patient: {
        name: report.patient.name,
        code: report.patient.patientCode,
        age: report.patient.age,
        gender: report.patient.gender,
      },
    };
  }

  /**
   * Revoke share link
   */
  async revokeShareLink(reportId: string, userId: string, userRole: string) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions
    await this.checkAccess(report.patientId, userId, userRole);

    // Remove share token
    await prisma.reportModel.update({
      where: { id: reportId },
      data: {
        shareToken: null,
        sharedAt: null,
        expiresAt: null,
      },
    });

    // Log audit
    await this.logAudit({
      userId,
      action: "REVOKE_REPORT_SHARE",
      targetType: "Report",
      targetId: reportId,
    });

    return { message: "Share link revoked successfully" };
  }

  /**
   * Download report file
   */
  async downloadReport(reportId: string, userId: string, userRole: string) {
    const report = await prisma.reportModel.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    // Check permissions
    await this.checkAccess(report.patientId, userId, userRole);

    if (!report.fileUrl) {
      throw new Error("Report has no file attached");
    }

    // Log audit
    await this.logAudit({
      userId,
      action: "DOWNLOAD_REPORT",
      targetType: "Report",
      targetId: reportId,
    });

    return {
      fileUrl: report.fileUrl,
      title: report.title,
      type: report.type,
    };
  }

  // ===== Helper Methods =====

  /**
   * Check if user has access to patient's reports
   */
  private async checkAccess(patientId: string, userId: string, userRole: string) {
    // Admin has access to all
    if (userRole === "admin") {
      return true;
    }

    // Check if user is the patient
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { user: true },
    });

    if (patient?.userId === userId) {
      return true;
    }

    // Check if user is the assigned doctor
    if (userRole === "doctor") {
      const doctor = await prisma.doctorProfile.findFirst({
        where: { userId },
      });

      if (doctor && patient?.doctorId === doctor.id) {
        return true;
      }

      // Check if doctor has consultations with this patient
      const consultation = await prisma.consultation.findFirst({
        where: {
          patientId,
          doctorId: doctor?.id,
        },
      });

      if (consultation) {
        return true;
      }
    }

    throw new Error("Insufficient permissions to access this report");
  }

  /**
   * Generate unique share token
   */
  private generateShareToken(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Log audit action
   */
  private async logAudit(data: {
    userId: string;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: any;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          targetType: data.targetType,
          targetId: data.targetId,
          metadata: data.metadata,
          severity: "info",
        },
      });
    } catch (error) {
      console.error("Failed to log audit:", error);
    }
  }
}

export const reportsService = new ReportsService();
