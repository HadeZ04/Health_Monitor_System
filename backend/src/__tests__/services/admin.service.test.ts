import { AdminService } from "../../services/admin.service";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Mock Prisma
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },
    doctorProfile: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    patientProfile: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointment: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    role: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
    rolePermission: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    systemSetting: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    consultation: {
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient)),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock bcrypt
jest.mock("bcrypt");

describe("AdminService", () => {
  let adminService: AdminService;
  let mockPrisma: any;

  beforeEach(() => {
    adminService = new AdminService();
    mockPrisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe("getDashboard", () => {
    it("should return dashboard data with KPIs and charts", async () => {
      // Mock counts
      mockPrisma.user.count.mockResolvedValue(100);
      mockPrisma.doctorProfile.count.mockResolvedValue(20);
      mockPrisma.patientProfile.count.mockResolvedValue(80);
      mockPrisma.appointment.count.mockResolvedValue(150);

      // Mock login activity
      mockPrisma.user.groupBy.mockResolvedValue([
        { lastLogin: new Date("2024-01-01"), _count: 10 },
        { lastLogin: new Date("2024-01-02"), _count: 15 },
      ]);

      // Mock appointment trends
      mockPrisma.appointment.groupBy.mockResolvedValue([
        { date: new Date("2024-01-01"), _count: 5 },
        { date: new Date("2024-01-02"), _count: 8 },
      ]);

      // Mock user distribution
      mockPrisma.role.findMany.mockResolvedValue([
        { id: "1", name: "admin", _count: { users: 5 } },
        { id: "2", name: "doctor", _count: { users: 20 } },
        { id: "3", name: "patient", _count: { users: 75 } },
      ]);

      // Mock recent activities
      mockPrisma.auditLog.findMany.mockResolvedValue([
        {
          id: "1",
          userId: "user1",
          action: "CREATE_USER",
          targetType: "User",
          targetId: "user2",
          severity: "info",
          createdAt: new Date(),
        },
      ]);

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user1",
        name: "Admin User",
        email: "admin@test.com",
      });

      const result = await adminService.getDashboard();

      expect(result).toHaveProperty("kpi");
      expect(result.kpi.totalUsers).toBe(100);
      expect(result.kpi.totalDoctors).toBe(20);
      expect(result.kpi.totalPatients).toBe(80);
      expect(result.kpi.totalAppointments).toBe(150);

      expect(result).toHaveProperty("charts");
      expect(result.charts).toHaveProperty("loginActivity");
      expect(result.charts).toHaveProperty("appointmentTrends");
      expect(result.charts).toHaveProperty("userDistribution");

      expect(result).toHaveProperty("recentActivities");
      expect(result.recentActivities).toHaveLength(1);
    });
  });

  describe("getUsers", () => {
    it("should return paginated users with filters", async () => {
      const mockUsers = [
        {
          id: "1",
          email: "user1@test.com",
          name: "User 1",
          password: "hashed",
          role: { id: "role1", name: "patient" },
          status: "active",
          createdAt: new Date(),
        },
        {
          id: "2",
          email: "user2@test.com",
          name: "User 2",
          password: "hashed",
          role: { id: "role2", name: "doctor" },
          status: "active",
          createdAt: new Date(),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const result = await adminService.getUsers({
        search: "user",
        page: 1,
        limit: 10,
      });

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).not.toHaveProperty("password");
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });
  });

  describe("createUser", () => {
    it("should create a new user and log audit", async () => {
      const userData = {
        email: "newuser@test.com",
        password: "password123",
        name: "New User",
        roleId: "role1",
      };

      const mockUser = {
        id: "user1",
        email: userData.email,
        name: userData.name,
        password: "hashed_password",
        roleId: userData.roleId,
        role: { id: "role1", name: "patient" },
        status: "active",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await adminService.createUser(userData, "admin1");

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "CREATE_USER",
            targetType: "User",
          }),
        })
      );
      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe(userData.email);
    });
  });

  describe("updateUser", () => {
    it("should update user and log audit", async () => {
      const updateData = {
        name: "Updated Name",
        status: "inactive" as const,
      };

      const mockUser = {
        id: "user1",
        email: "user@test.com",
        name: updateData.name,
        password: "hashed",
        status: updateData.status,
        role: { id: "role1", name: "patient" },
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await adminService.updateUser("user1", updateData, "admin1");

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user1" },
          data: updateData,
        })
      );
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty("password");
    });
  });

  describe("lockUser", () => {
    it("should lock user and log audit", async () => {
      const mockUser = {
        id: "user1",
        email: "user@test.com",
        name: "Test User",
        password: "hashed",
        status: "locked",
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await adminService.lockUser("user1", "admin1");

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user1" },
          data: { status: "locked" },
        })
      );
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "LOCK_USER",
            severity: "warning",
          }),
        })
      );
      expect(result.status).toBe("locked");
    });
  });

  describe("resetPassword", () => {
    it("should reset user password and log audit", async () => {
      const newPassword = "newPassword123";

      (bcrypt.hash as jest.Mock).mockResolvedValue("new_hashed_password");
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await adminService.resetPassword("user1", newPassword, "admin1");

      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user1" },
          data: { password: "new_hashed_password" },
        })
      );
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "RESET_PASSWORD",
            severity: "warning",
          }),
        })
      );
      expect(result.message).toBe("Password reset successfully");
    });
  });

  describe("getDoctors", () => {
    it("should return paginated doctors with filters", async () => {
      const mockDoctors = [
        {
          id: "doc1",
          userId: "user1",
          specialty: "Cardiology",
          status: "active",
          user: {
            id: "user1",
            email: "doc1@test.com",
            name: "Dr. Smith",
          },
          _count: { consultations: 10 },
        },
      ];

      mockPrisma.doctorProfile.findMany.mockResolvedValue(mockDoctors);
      mockPrisma.doctorProfile.count.mockResolvedValue(1);

      const result = await adminService.getDoctors({
        specialty: "Cardiology",
        page: 1,
        limit: 10,
      });

      expect(result.doctors).toHaveLength(1);
      expect(result.doctors[0].specialty).toBe("Cardiology");
      expect(result.pagination.total).toBe(1);
    });
  });

  describe("getRoles", () => {
    it("should return all roles with permissions", async () => {
      const mockRoles = [
        {
          id: "role1",
          name: "admin",
          description: "Administrator",
          permissions: [
            {
              permission: {
                id: "perm1",
                code: "admin.*",
                description: "Full admin access",
              },
            },
          ],
          _count: { users: 5 },
        },
      ];

      mockPrisma.role.findMany.mockResolvedValue(mockRoles);

      const result = await adminService.getRoles();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("admin");
      expect(result[0].permissions).toHaveLength(1);
    });
  });

  describe("updateSettings", () => {
    it("should update system settings and log audit", async () => {
      const settingsData = {
        settings: [
          { key: "maintenanceMode", value: false, category: "system" },
          { key: "maxUploadSize", value: 10485760, category: "upload" },
        ],
      };

      mockPrisma.systemSetting.findUnique
        .mockResolvedValueOnce(null) // First setting doesn't exist
        .mockResolvedValueOnce({ id: "1", key: "maxUploadSize" }); // Second exists

      mockPrisma.systemSetting.create.mockResolvedValue({
        id: "new1",
        key: "maintenanceMode",
        value: false,
        category: "system",
      });

      mockPrisma.systemSetting.update.mockResolvedValue({
        id: "1",
        key: "maxUploadSize",
        value: 10485760,
        category: "upload",
      });

      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await adminService.updateSettings(settingsData, "admin1");

      expect(result).toHaveLength(2);
      expect(mockPrisma.systemSetting.create).toHaveBeenCalled();
      expect(mockPrisma.systemSetting.update).toHaveBeenCalled();
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "UPDATE_SETTINGS",
            severity: "warning",
          }),
        })
      );
    });
  });
});
