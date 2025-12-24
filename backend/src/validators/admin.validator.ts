import { z } from "zod";

// ===== User Management Schemas =====

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  roleId: z.string().uuid("Invalid role ID"),
  status: z.enum(["active", "inactive", "locked"]).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional(),
  roleId: z.string().uuid("Invalid role ID").optional(),
  status: z.enum(["active", "inactive", "locked"]).optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// ===== Doctor Management Schemas =====

export const createDoctorSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.number().int().min(0, "Experience must be non-negative").optional(),
  license: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(["active", "inactive", "onLeave"]).optional(),
});

export const updateDoctorSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  license: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(["active", "inactive", "onLeave"]).optional(),
});

// ===== Patient Management Schemas =====

export const createPatientSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  doctorId: z.string().uuid().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  conditions: z.array(z.string()).optional(),
});

export const updatePatientSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  doctorId: z.string().uuid().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  conditions: z.array(z.string()).optional(),
  status: z.string().optional(),
});

// ===== Role & Permission Schemas =====

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").optional(),
  description: z.string().optional(),
});

export const updateRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid("Invalid permission ID")),
});

// ===== System Settings Schema =====

export const updateSettingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1, "Setting key is required"),
      value: z.any(),
      category: z.string().optional(),
    })
  ),
});

// ===== Query Schemas =====

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["active", "inactive", "locked"]).optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const doctorQuerySchema = z.object({
  search: z.string().optional(),
  specialty: z.string().optional(),
  status: z.enum(["active", "inactive", "onLeave"]).optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const patientQuerySchema = z.object({
  search: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  gender: z.string().optional(),
  status: z.string().optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const auditLogQuerySchema = z.object({
  type: z.string().optional(),
  severity: z.enum(["info", "warning", "error", "critical"]).optional(),
  userId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type DoctorQueryInput = z.infer<typeof doctorQuerySchema>;
export type PatientQueryInput = z.infer<typeof patientQuerySchema>;
export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;
