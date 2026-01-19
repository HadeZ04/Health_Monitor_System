import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticateJWT } from "../middleware/auth";
import { requirePermission } from "../middleware/permissions";

const router = Router();

// Apply authentication to all admin routes
router.use(authenticateJWT);

// Apply admin permission check to all routes
router.use(requirePermission("admin.*"));

// ===== Dashboard =====
router.get("/dashboard", adminController.getDashboard.bind(adminController));

// ===== Users Management =====
router.get("/users", adminController.getUsers.bind(adminController));
router.post("/users", adminController.createUser.bind(adminController));
router.put("/users/:userId", adminController.updateUser.bind(adminController));
router.delete("/users/:userId", adminController.deleteUser.bind(adminController));
router.post("/users/:userId/lock", adminController.lockUser.bind(adminController));
router.post("/users/:userId/unlock", adminController.unlockUser.bind(adminController));
router.post("/users/:userId/reset-password", adminController.resetPassword.bind(adminController));

// ===== Doctors Management =====
router.get("/doctors", adminController.getDoctors.bind(adminController));
router.post("/doctors", adminController.createDoctor.bind(adminController));
router.put("/doctors/:doctorId", adminController.updateDoctor.bind(adminController));
router.delete("/doctors/:doctorId", adminController.deleteDoctor.bind(adminController));
router.get("/doctors/:doctorId/performance", adminController.getDoctorPerformance.bind(adminController));

// ===== Patients Management =====
router.get("/patients", adminController.getPatients.bind(adminController));
router.post("/patients", adminController.createPatient.bind(adminController));
router.put("/patients/:patientId", adminController.updatePatient.bind(adminController));
router.delete("/patients/:patientId", adminController.deletePatient.bind(adminController));
router.get("/patients/:patientId/details", adminController.getPatientDetails.bind(adminController));

// ===== Roles & Permissions =====
router.get("/roles", adminController.getRoles.bind(adminController));
router.post("/roles", adminController.createRole.bind(adminController));
router.put("/roles/:roleId", adminController.updateRole.bind(adminController));
router.delete("/roles/:roleId", adminController.deleteRole.bind(adminController));
router.get("/roles/:roleId/permissions", adminController.getRolePermissions.bind(adminController));
router.put("/roles/:roleId/permissions", adminController.updateRolePermissions.bind(adminController));

// ===== System Logs =====
router.get("/logs", adminController.getLogs.bind(adminController));

// ===== System Settings =====
router.get("/settings", adminController.getSettings.bind(adminController));
router.put("/settings", adminController.updateSettings.bind(adminController));

export default router;
