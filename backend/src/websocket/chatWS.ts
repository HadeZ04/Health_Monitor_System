import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { chatService } from "../services/chat.service";
import { config } from "../config/env.js";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  conversationId?: string;
  isAlive?: boolean;
}

const JWT_SECRET = config.jwt.secret;

/**
 * WebSocket server for real-time chat messaging
 * Endpoint: ws://server/chat/:conversationId?token=JWT
 */
export function initializeChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade requests
  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);

    // Handle /chat/:conversationId path
    if (url.pathname.startsWith("/chat/")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", async (ws: AuthenticatedWebSocket, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get("token");
    const pathParts = url.pathname.split("/");
    const conversationId = pathParts[2]; // /chat/:conversationId

    // Authenticate
    if (!token) {
      ws.send(JSON.stringify({ type: "error", message: "No token provided" }));
      ws.close();
      return;
    }

    if (!conversationId) {
      ws.send(JSON.stringify({ type: "error", message: "No conversation ID provided" }));
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
      if (!decoded.userId) {
        throw new Error("Invalid token payload");
      }

      const userId = decoded.userId;
      ws.userId = userId;
      ws.conversationId = conversationId;
      ws.isAlive = true;

      console.log(`[ChatWS] User ${ws.userId} connected to conversation ${conversationId}`);

      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Connected to chat",
          conversationId,
        })
      );

      // Optionally send recent messages
      const result = await chatService.getMessages(conversationId, userId, 1, 20);
      ws.send(
        JSON.stringify({
          type: "initial_messages",
          messages: result.messages,
        })
      );
    } catch (error: any) {
      ws.send(JSON.stringify({ type: "error", message: error.message || "Authentication failed" }));
      ws.close();
      return;
    }

    // Handle pong messages
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Handle incoming messages
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        } else if (message.type === "send_message" && ws.userId && ws.conversationId) {
          // Client sends message via WebSocket
          if (!message.content) {
            ws.send(JSON.stringify({ type: "error", message: "Message content required" }));
            return;
          }

          // Determine sender role (simplified - you might want to check from token)
          const senderRole = message.senderRole || "patient";

          const newMessage = await chatService.sendMessage(ws.conversationId, {
            senderId: ws.userId,
            senderRole,
            content: message.content,
          });

          // Send confirmation to sender
          ws.send(
            JSON.stringify({
              type: "message_sent",
              data: newMessage,
            })
          );
        } else if (message.type === "typing") {
          // Broadcast typing indicator to other participants
          broadcastToConversation(
            wss,
            ws.conversationId!,
            {
              type: "typing",
              userId: ws.userId,
            },
            ws.userId
          );
        }
      } catch (error: any) {
        console.error("[ChatWS] Error processing message:", error);
        ws.send(JSON.stringify({ type: "error", message: error.message }));
      }
    });

    ws.on("close", () => {
      console.log(`[ChatWS] User ${ws.userId} disconnected from conversation ${conversationId}`);
    });

    ws.on("error", (error) => {
      console.error("[ChatWS] WebSocket error:", error);
    });
  });

  // Listen to chat service events
  chatService.on("message:sent", ({ conversationId, message }) => {
    // Broadcast new message to all participants in the conversation
    broadcastToConversation(wss, conversationId, {
      type: "new_message",
      data: message,
    });
  });

  // Heartbeat to keep connections alive
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // 30 seconds

  wss.on("close", () => {
    clearInterval(heartbeat);
  });

  return wss;
}

/**
 * Broadcast message to all users in a conversation except sender
 */
function broadcastToConversation(
  wss: WebSocketServer,
  conversationId: string,
  message: any,
  excludeUserId?: string
) {
  wss.clients.forEach((client: AuthenticatedWebSocket) => {
    if (
      client.conversationId === conversationId &&
      client.userId !== excludeUserId &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(JSON.stringify(message));
    }
  });
}
