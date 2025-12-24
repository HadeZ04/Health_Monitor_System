import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

/**
 * Chat Routes
 * All routes require authentication
 * 
 * WebSocket endpoint for real-time messaging:
 * ws://server/chat/:conversationId?token=JWT
 */

// Get user's conversations
router.get("/conversations/:userId", authenticateJWT, chatController.getConversations.bind(chatController));

// Create or get conversation
router.post("/conversations", authenticateJWT, chatController.createConversation.bind(chatController));

// Get messages in a conversation
router.get("/conversations/:conversationId/messages", authenticateJWT, chatController.getMessages.bind(chatController));

// Send message
router.post("/conversations/:conversationId/messages", authenticateJWT, chatController.sendMessage.bind(chatController));

// Delete message
router.delete("/messages/:messageId", authenticateJWT, chatController.deleteMessage.bind(chatController));

// Get unread count
router.get("/unread-count", authenticateJWT, chatController.getUnreadCount.bind(chatController));

// Search messages
router.get("/search", authenticateJWT, chatController.searchMessages.bind(chatController));

export default router;
