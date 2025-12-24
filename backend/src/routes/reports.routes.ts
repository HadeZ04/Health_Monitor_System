import { Router } from "express";
import { reportsController } from "../controllers/analytics-monitoring-reports.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Public route for accessing shared reports
 * GET /api/reports/shared/:shareToken
 */
router.get("/shared/:shareToken", reportsController.getSharedReport.bind(reportsController));

// All other routes require authentication
router.use(authenticateJWT);

/**
 * GET /api/reports/:patientId
 * Get all reports for a patient
 */
router.get("/:patientId", reportsController.getReportsByPatient.bind(reportsController));

/**
 * GET /api/reports/detail/:reportId
 * Get single report by ID
 */
router.get("/detail/:reportId", reportsController.getReportById.bind(reportsController));

/**
 * POST /api/reports
 * Create a new report
 */
router.post("/", reportsController.createReport.bind(reportsController));

/**
 * PUT /api/reports/:reportId
 * Update a report
 */
router.put("/:reportId", reportsController.updateReport.bind(reportsController));

/**
 * DELETE /api/reports/:reportId
 * Delete a report
 */
router.delete("/:reportId", reportsController.deleteReport.bind(reportsController));

/**
 * GET /api/reports/:reportId/download
 * Download report file
 */
router.get("/:reportId/download", reportsController.downloadReport.bind(reportsController));

/**
 * POST /api/reports/:reportId/share
 * Generate share link for report
 */
router.post("/:reportId/share", reportsController.shareReport.bind(reportsController));

/**
 * DELETE /api/reports/:reportId/share
 * Revoke share link
 */
router.delete("/:reportId/share", reportsController.revokeShareLink.bind(reportsController));

export default router;
