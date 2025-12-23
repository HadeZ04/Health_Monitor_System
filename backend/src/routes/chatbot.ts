import { Router } from "express";
import { askChatbot } from "../controllers/chatController";
import { jwtMiddleware } from "../middleware/auth";
import { checkInferenceHealth } from "../services/inferenceService.js";

export const chatbotRouter = Router();

chatbotRouter.post("/ask", jwtMiddleware, askChatbot);

// Health check endpoint (no auth required for monitoring)
chatbotRouter.get("/health", async (_req, res) => {
  try {
    const health = await checkInferenceHealth();
    res.json(health);
  } catch (error) {
    res.status(503).json({ status: "unavailable" });
  }
});
