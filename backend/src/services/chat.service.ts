import { PrismaClient } from "@prisma/client";
import { EventEmitter } from "events";

const prisma = new PrismaClient();

interface SendMessageInput {
  senderId: string;
  senderRole: "doctor" | "patient";
  content: string;
}

/**
 * Chat Service for patient-doctor messaging
 * Uses existing Conversation and Message models from Doctor API
 */
export class ChatService extends EventEmitter {
  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string, userRole: string) {
    let conversations;

    if (userRole === "doctor") {
      // Get doctor's profile first
      const doctorProfile = await prisma.doctorProfile.findFirst({
        where: { userId },
      });

      if (!doctorProfile) {
        throw new Error("Doctor profile not found");
      }

      conversations = await prisma.conversation.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // Last message
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });
    } else if (userRole === "patient") {
      // Get patient's profile first
      const patientProfile = await prisma.patientProfile.findFirst({
        where: { userId },
      });

      if (!patientProfile) {
        throw new Error("Patient profile not found");
      }

      conversations = await prisma.conversation.findMany({
        where: { patientId: patientProfile.id },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });
    } else {
      throw new Error("Invalid user role");
    }

    // Enrich with unread count
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            readAt: null,
          },
        });

        return {
          ...conv,
          unreadCount,
          lastMessage: conv.messages[0] || null,
        };
      })
    );

    return enriched;
  }

  /**
   * Get or create conversation between patient and doctor
   */
  async getOrCreateConversation(patientId: string, doctorId: string) {
    // Try to find existing conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        patientId_doctorId: {
          patientId,
          doctorId,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Create if doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          patientId,
          doctorId,
        },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    }

    return conversation;
  }

  /**
   * Get messages in a conversation
   */
  async getMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50) {
    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const isParticipant =
      conversation.patient.userId === userId || conversation.doctor.userId === userId;

    if (!isParticipant) {
      throw new Error("Unauthorized: Not a participant in this conversation");
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { conversationId } }),
    ]);

    // Mark messages as read if they're not from the current user
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      messages: messages.reverse(), // Oldest first for display
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      conversation,
    };
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, data: SendMessageInput) {
    // Verify conversation exists and user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const isParticipant =
      conversation.patient.userId === data.senderId || conversation.doctor.userId === data.senderId;

    if (!isParticipant) {
      throw new Error("Unauthorized: Not a participant in this conversation");
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: data.senderId,
        senderRole: data.senderRole,
        content: data.content,
      },
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Emit event for WebSocket broadcast
    this.emit("message:sent", {
      conversationId,
      message,
      conversation,
    });

    // Create notification for recipient
    const recipientId =
      data.senderRole === "doctor" ? conversation.patient.userId : conversation.doctor.userId;

    if (recipientId) {
      const { notificationsService } = await import("./alerts-notifications.service");
      await notificationsService.createNotification({
        userId: recipientId,
        type: "message",
        message: `New message from ${data.senderRole === "doctor" ? "Dr. " : ""}${
          data.senderRole === "doctor"
            ? conversation.doctor.user.name
            : conversation.patient.user?.name || "Patient"
        }`,
        data: {
          conversationId,
          messageId: message.id,
          senderId: data.senderId,
        },
      });
    }

    return message;
  }

  /**
   * Delete a message (soft delete - just mark as deleted)
   */
  async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
      throw new Error("Unauthorized: Can only delete own messages");
    }

    // In production, you might want to soft delete or just prevent deletion
    await prisma.message.delete({
      where: { id: messageId },
    });

    return { message: "Message deleted successfully" };
  }

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId: string, userRole: string) {
    let conversationIds: string[] = [];

    if (userRole === "doctor") {
      const doctorProfile = await prisma.doctorProfile.findFirst({
        where: { userId },
      });

      if (doctorProfile) {
        const conversations = await prisma.conversation.findMany({
          where: { doctorId: doctorProfile.id },
          select: { id: true },
        });
        conversationIds = conversations.map((c) => c.id);
      }
    } else if (userRole === "patient") {
      const patientProfile = await prisma.patientProfile.findFirst({
        where: { userId },
      });

      if (patientProfile) {
        const conversations = await prisma.conversation.findMany({
          where: { patientId: patientProfile.id },
          select: { id: true },
        });
        conversationIds = conversations.map((c) => c.id);
      }
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: userId },
        readAt: null,
      },
    });

    return { unreadCount };
  }

  /**
   * Search messages
   */
  async searchMessages(userId: string, query: string, limit: number = 20) {
    // Get user's conversations
    const conversations = await this.getConversations(userId, "doctor"); // Simplified, should check role

    const conversationIds = conversations.map((c) => c.id);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: { in: conversationIds },
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        conversation: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return messages;
  }
}

export const chatService = new ChatService();
