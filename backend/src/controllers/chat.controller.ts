import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

const requireParam = (
  res: Response,
  value: string | undefined,
  name: string
): string | null => {
  if (!value) {
    res.status(400).json({ message: `${name} is required` });
    return null;
  }
  return value;
};

const requireAuth = (
  req: Request,
  res: Response
): { userId: string; userRole: string } | null => {
  const userId = req.user?.id;
  const userRole = req.user?.role?.name;
  if (!userId || !userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return { userId, userRole };
};

const isChatRole = (role: string): role is 'doctor' | 'patient' =>
  role === 'doctor' || role === 'patient';

/**
 * Chat Controller for messaging between patients and doctors
 */
export class ChatController {
  /**
   * GET /api/chat/conversations/:userId
   * Get all conversations for a user
   */
  async getConversations(req: Request, res: Response) {
    try {
      const targetUserId = requireParam(res, req.params.userId, 'userId');
      if (!targetUserId) return;

      const auth = requireAuth(req, res);
      if (!auth) return;

      if (auth.userRole !== 'admin' && auth.userId !== targetUserId) {
        res.status(403).json({
          message: 'Forbidden: Can only access your own conversations',
        });
        return;
      }

      if (!isChatRole(auth.userRole)) {
        res.status(403).json({ message: 'Forbidden: invalid chat role' });
        return;
      }

      const conversations = await chatService.getConversations(targetUserId, auth.userRole);
      res.json(conversations);
    } catch (error: any) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: error.message || 'Failed to get conversations' });
    }
  }

  /**
   * POST /api/chat/conversations
   * Create or get conversation between patient and doctor
   */
  async createConversation(req: Request, res: Response) {
    try {
      const { patientId, doctorId } = req.body as {
        patientId?: string;
        doctorId?: string;
      };

      if (!patientId || !doctorId) {
        res.status(400).json({ message: 'patientId and doctorId are required' });
        return;
      }

      const conversation = await chatService.getOrCreateConversation(patientId, doctorId);
      res.json(conversation);
    } catch (error: any) {
      console.error('Create conversation error:', error);
      res.status(400).json({ message: error.message || 'Failed to create conversation' });
    }
  }

  /**
   * GET /api/chat/conversations/:conversationId/messages
   * Get messages in a conversation
   */
  async getMessages(req: Request, res: Response) {
    try {
      const conversationId = requireParam(res, req.params.conversationId, 'conversationId');
      if (!conversationId) return;

      const auth = requireAuth(req, res);
      if (!auth) return;

      const { page = '1', limit = '50' } = req.query;

      const result = await chatService.getMessages(
        conversationId,
        auth.userId,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(400).json({ message: error.message || 'Failed to get messages' });
    }
  }

  /**
   * POST /api/chat/conversations/:conversationId/messages
   * Send a message in a conversation
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const conversationId = requireParam(res, req.params.conversationId, 'conversationId');
      if (!conversationId) return;

      const auth = requireAuth(req, res);
      if (!auth) return;

      const { content, senderRole } = req.body as {
        content?: string;
        senderRole?: string;
      };

      if (!content) {
        res.status(400).json({ message: 'Content is required' });
        return;
      }

      const resolvedRole = (senderRole ?? auth.userRole) as string;
      if (!isChatRole(resolvedRole)) {
        res.status(400).json({ message: 'senderRole must be doctor|patient' });
        return;
      }

      const message = await chatService.sendMessage(conversationId, {
        senderId: auth.userId,
        senderRole: resolvedRole,
        content,
      });

      res.status(201).json(message);
    } catch (error: any) {
      console.error('Send message error:', error);
      res.status(400).json({ message: error.message || 'Failed to send message' });
    }
  }

  /**
   * DELETE /api/chat/messages/:messageId
   * Delete a message
   */
  async deleteMessage(req: Request, res: Response) {
    try {
      const messageId = requireParam(res, req.params.messageId, 'messageId');
      if (!messageId) return;

      const auth = requireAuth(req, res);
      if (!auth) return;

      const result = await chatService.deleteMessage(messageId, auth.userId);
      res.json(result);
    } catch (error: any) {
      console.error('Delete message error:', error);
      res.status(400).json({ message: error.message || 'Failed to delete message' });
    }
  }

  /**
   * GET /api/chat/unread-count
   * Get unread message count for user
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      if (!isChatRole(auth.userRole)) {
        res.status(403).json({ message: 'Forbidden: invalid chat role' });
        return;
      }

      const result = await chatService.getUnreadCount(auth.userId, auth.userRole);
      res.json(result);
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: error.message || 'Failed to get unread count' });
    }
  }

  /**
   * GET /api/chat/search
   * Search messages
   */
  async searchMessages(req: Request, res: Response) {
    try {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const { query, limit = '20' } = req.query;

      if (!query) {
        res.status(400).json({ message: 'Search query is required' });
        return;
      }

      const messages = await chatService.searchMessages(
        auth.userId,
        query as string,
        parseInt(limit as string, 10)
      );
      res.json(messages);
    } catch (error: any) {
      console.error('Search messages error:', error);
      res.status(500).json({ message: error.message || 'Failed to search messages' });
    }
  }
}

export const chatController = new ChatController();
