import { Router } from "express";
import { devicesController, signalsController } from "../controllers/devices-signals.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Devices & Signals Routes
 * All routes require authentication
 * 
 * Device endpoints
 */

// Get devices
router.get("/", authenticateJWT, devicesController.getDevices.bind(devicesController));

// Get device by ID
router.get("/:id", authenticateJWT, devicesController.getDeviceById.bind(devicesController));

// Create device
router.post("/", authenticateJWT, devicesController.createDevice.bind(devicesController));

// Update device
router.put("/:id", authenticateJWT, devicesController.updateDevice.bind(devicesController));

// Delete device
router.delete("/:id", authenticateJWT, devicesController.deleteDevice.bind(devicesController));

// Get device status
router.get("/:id/status", authenticateJWT, devicesController.getDeviceStatus.bind(devicesController));

// Get device statistics
router.get("/statistics/summary", authenticateJWT, devicesController.getStatistics.bind(devicesController));

// Get latest signals for device
router.get("/:deviceId/signals/latest", authenticateJWT, signalsController.getLatestSignals.bind(signalsController));

export default router;
