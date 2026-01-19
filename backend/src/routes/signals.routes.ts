import { Router } from "express";
import { signalsController } from "../controllers/devices-signals.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Signals Routes
 * All routes require authentication
 * 
 * Signal endpoints for IoT data
 */

// Create signal (IoT device endpoint)
router.post("/", authenticateJWT, signalsController.createSignal.bind(signalsController));

// Get signals with filters
router.get("/", authenticateJWT, signalsController.getSignals.bind(signalsController));

// Get signal statistics
router.get("/statistics", authenticateJWT, signalsController.getStatistics.bind(signalsController));

// Cleanup old signals (admin only)
router.delete("/cleanup", authenticateJWT, signalsController.cleanup.bind(signalsController));

export default router;
