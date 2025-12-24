import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import {
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  createDoctorSchema,
  updateDoctorSchema,
  createPatientSchema,
  updatePatientSchema,
  createRoleSchema,
  updateRoleSchema,
  updateRolePermissionsSchema,
  updateSettingsSchema,
  userQuerySchema,
  doctorQuerySchema,
  patientQuerySchema,
  auditLogQuerySchema,
} from "../validators/admin.validator";

const requireParam = (res: Response, value: string | undefined, name: string): string | null => {
  if (!value) {
    res.status(400).json({ error: `${name} is required` });
    return null;
  }
  return value;
};

export class AdminController {
  // ===== Dashboard =====
  async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await adminService.getDashboard();
      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch dashboard data",
        message: error.message,
      });
    }
  }

  // ===== Users Management =====
  async getUsers(req: Request, res: Response) {
    try {
      const query = userQuerySchema.parse(req.query);
      const result = await adminService.getUsers(query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: "Invalid query parameters",
        message: error.message,
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const user = await adminService.createUser(data, adminId);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Email already exists" });
      } else {
        res.status(400).json({
          error: "Failed to create user",
          message: error.message,
        });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = requireParam(res, req.params.userId, "userId");
      if (!userId) return;
      const data = updateUserSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const user = await adminService.updateUser(userId, data, adminId);
      res.json(user);
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(400).json({
          error: "Failed to update user",
          message: error.message,
        });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = requireParam(res, req.params.userId, "userId");
      if (!userId) return;
      const adminId = req.user?.id || "";
      const result = await adminService.deleteUser(userId, adminId);
      res.json(result);
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(400).json({
          error: "Failed to delete user",
          message: error.message,
        });
      }
    }
  }

  async lockUser(req: Request, res: Response) {
    try {
      const userId = requireParam(res, req.params.userId, "userId");
      if (!userId) return;
      const adminId = req.user?.id || "";
      const user = await adminService.lockUser(userId, adminId);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to lock user",
        message: error.message,
      });
    }
  }

  async unlockUser(req: Request, res: Response) {
    try {
      const userId = requireParam(res, req.params.userId, "userId");
      if (!userId) return;
      const adminId = req.user?.id || "";
      const user = await adminService.unlockUser(userId, adminId);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to unlock user",
        message: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const userId = requireParam(res, req.params.userId, "userId");
      if (!userId) return;
      const { newPassword } = resetPasswordSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const result = await adminService.resetPassword(userId, newPassword, adminId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to reset password",
        message: error.message,
      });
    }
  }

  // ===== Doctors Management =====
  async getDoctors(req: Request, res: Response) {
    try {
      const query = doctorQuerySchema.parse(req.query);
      const result = await adminService.getDoctors(query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: "Invalid query parameters",
        message: error.message,
      });
    }
  }

  async createDoctor(req: Request, res: Response) {
    try {
      const data = createDoctorSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const doctor = await adminService.createDoctor(data, adminId);
      res.status(201).json(doctor);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Email already exists" });
      } else {
        res.status(400).json({
          error: "Failed to create doctor",
          message: error.message,
        });
      }
    }
  }

  async updateDoctor(req: Request, res: Response) {
    try {
      const doctorId = requireParam(res, req.params.doctorId, "doctorId");
      if (!doctorId) return;
      const data = updateDoctorSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const doctor = await adminService.updateDoctor(doctorId, data, adminId);
      res.json(doctor);
    } catch (error: any) {
      if (error.message === "Doctor not found") {
        res.status(404).json({ error: "Doctor not found" });
      } else {
        res.status(400).json({
          error: "Failed to update doctor",
          message: error.message,
        });
      }
    }
  }

  async deleteDoctor(req: Request, res: Response) {
    try {
      const doctorId = requireParam(res, req.params.doctorId, "doctorId");
      if (!doctorId) return;
      const adminId = req.user?.id || "";
      const result = await adminService.deleteDoctor(doctorId, adminId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Doctor not found") {
        res.status(404).json({ error: "Doctor not found" });
      } else {
        res.status(400).json({
          error: "Failed to delete doctor",
          message: error.message,
        });
      }
    }
  }

  async getDoctorPerformance(req: Request, res: Response) {
    try {
      const doctorId = requireParam(res, req.params.doctorId, "doctorId");
      if (!doctorId) return;
      const performance = await adminService.getDoctorPerformance(doctorId);
      res.json(performance);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to fetch doctor performance",
        message: error.message,
      });
    }
  }

  // ===== Patients Management =====
  async getPatients(req: Request, res: Response) {
    try {
      const query = patientQuerySchema.parse(req.query);
      const result = await adminService.getPatients(query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: "Invalid query parameters",
        message: error.message,
      });
    }
  }

  async createPatient(req: Request, res: Response) {
    try {
      const data = createPatientSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const patient = await adminService.createPatient(data, adminId);
      res.status(201).json(patient);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Email already exists" });
      } else {
        res.status(400).json({
          error: "Failed to create patient",
          message: error.message,
        });
      }
    }
  }

  async updatePatient(req: Request, res: Response) {
    try {
      const patientId = requireParam(res, req.params.patientId, "patientId");
      if (!patientId) return;
      const data = updatePatientSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const patient = await adminService.updatePatient(patientId, data, adminId);
      res.json(patient);
    } catch (error: any) {
      if (error.message === "Patient not found") {
        res.status(404).json({ error: "Patient not found" });
      } else {
        res.status(400).json({
          error: "Failed to update patient",
          message: error.message,
        });
      }
    }
  }

  async deletePatient(req: Request, res: Response) {
    try {
      const patientId = requireParam(res, req.params.patientId, "patientId");
      if (!patientId) return;
      const adminId = req.user?.id || "";
      const result = await adminService.deletePatient(patientId, adminId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Patient not found") {
        res.status(404).json({ error: "Patient not found" });
      } else {
        res.status(400).json({
          error: "Failed to delete patient",
          message: error.message,
        });
      }
    }
  }

  async getPatientDetails(req: Request, res: Response) {
    try {
      const patientId = requireParam(res, req.params.patientId, "patientId");
      if (!patientId) return;
      const details = await adminService.getPatientDetails(patientId);
      res.json(details);
    } catch (error: any) {
      if (error.message === "Patient not found") {
        res.status(404).json({ error: "Patient not found" });
      } else {
        res.status(400).json({
          error: "Failed to fetch patient details",
          message: error.message,
        });
      }
    }
  }

  // ===== Roles & Permissions =====
  async getRoles(req: Request, res: Response) {
    try {
      const roles = await adminService.getRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch roles",
        message: error.message,
      });
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const data = createRoleSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const role = await adminService.createRole(data, adminId);
      res.status(201).json(role);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Role name already exists" });
      } else {
        res.status(400).json({
          error: "Failed to create role",
          message: error.message,
        });
      }
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const roleId = requireParam(res, req.params.roleId, "roleId");
      if (!roleId) return;
      const data = updateRoleSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const role = await adminService.updateRole(roleId, data, adminId);
      res.json(role);
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Role not found" });
      } else {
        res.status(400).json({
          error: "Failed to update role",
          message: error.message,
        });
      }
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const roleId = requireParam(res, req.params.roleId, "roleId");
      if (!roleId) return;
      const adminId = req.user?.id || "";
      const result = await adminService.deleteRole(roleId, adminId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Cannot delete role with assigned users") {
        res.status(400).json({ error: error.message });
      } else if (error.code === "P2025") {
        res.status(404).json({ error: "Role not found" });
      } else {
        res.status(400).json({
          error: "Failed to delete role",
          message: error.message,
        });
      }
    }
  }

  async getRolePermissions(req: Request, res: Response) {
    try {
      const roleId = requireParam(res, req.params.roleId, "roleId");
      if (!roleId) return;
      const permissions = await adminService.getRolePermissions(roleId);
      res.json(permissions);
    } catch (error: any) {
      if (error.message === "Role not found") {
        res.status(404).json({ error: "Role not found" });
      } else {
        res.status(400).json({
          error: "Failed to fetch role permissions",
          message: error.message,
        });
      }
    }
  }

  async updateRolePermissions(req: Request, res: Response) {
    try {
      const roleId = requireParam(res, req.params.roleId, "roleId");
      if (!roleId) return;
      const data = updateRolePermissionsSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const permissions = await adminService.updateRolePermissions(roleId, data, adminId);
      res.json(permissions);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to update role permissions",
        message: error.message,
      });
    }
  }

  // ===== System Logs =====
  async getLogs(req: Request, res: Response) {
    try {
      const query = auditLogQuerySchema.parse(req.query);
      const result = await adminService.getLogs(query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: "Invalid query parameters",
        message: error.message,
      });
    }
  }

  // ===== System Settings =====
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await adminService.getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch settings",
        message: error.message,
      });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const data = updateSettingsSchema.parse(req.body);
      const adminId = req.user?.id || "";
      const settings = await adminService.updateSettings(data, adminId);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({
        error: "Failed to update settings",
        message: error.message,
      });
    }
  }
}

export const adminController = new AdminController();
