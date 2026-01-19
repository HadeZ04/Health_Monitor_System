import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { alertsService, notificationsService } from "../services/alerts-notifications.service";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

const JWT_SECRET = config.jwt.secret;

/**
 * WebSocket server for real-time alerts and notifications
 * Endpoint: ws://server/alerts/stream?token=JWT
 */
export function initializeAlertsWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade requests
  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);

    // Only handle /alerts/stream path
    if (url.pathname === "/alerts/stream") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", async (ws: AuthenticatedWebSocket, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const token = url.searchParams.get("token");

    // Authenticate
    if (!token) {
      ws.send(JSON.stringify({ type: "error", message: "No token provided" }));
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
      ws.isAlive = true;

      console.log(`[AlertsWS] User ${ws.userId} connected`);

      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Connected to alerts stream",
          userId: ws.userId,
        })
      );

      // Send initial unread notifications count
      const stats = await notificationsService.getStatistics(userId);
      ws.send(
        JSON.stringify({
          type: "stats",
          data: stats,
        })
      );
    } catch (error) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
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
        } else if (message.type === "acknowledge_alert") {
          // Allow client to acknowledge alert via WebSocket
          if (message.alertId && ws.userId) {
            const alert = await alertsService.acknowledgeAlert(message.alertId, ws.userId);
            ws.send(
              JSON.stringify({
                type: "alert_acknowledged",
                data: alert,
              })
            );
          }
        } else if (message.type === "mark_notification_read") {
          if (message.notificationId && ws.userId) {
            await notificationsService.markAsRead(message.notificationId, ws.userId);
            ws.send(
              JSON.stringify({
                type: "notification_marked_read",
                notificationId: message.notificationId,
              })
            );
          }
        }
      } catch (error) {
        console.error("[AlertsWS] Error processing message:", error);
      }
    });

    ws.on("close", () => {
      console.log(`[AlertsWS] User ${ws.userId} disconnected`);
    });

    ws.on("error", (error) => {
      console.error("[AlertsWS] WebSocket error:", error);
    });
  });

  // Broadcast alerts to specific user
  alertsService.on("alert:created", (alert) => {
    broadcastToUser(wss, alert.userId, {
      type: "alert",
      event: "created",
      data: alert,
    });
  });

  alertsService.on("alert:acknowledged", (alert) => {
    broadcastToUser(wss, alert.userId, {
      type: "alert",
      event: "acknowledged",
      data: alert,
    });
  });

  alertsService.on("alert:resolved", (alert) => {
    broadcastToUser(wss, alert.userId, {
      type: "alert",
      event: "resolved",
      data: alert,
    });
  });

  // Broadcast notifications
  notificationsService.on("notification:created", (notification) => {
    broadcastToUser(wss, notification.userId, {
      type: "notification",
      event: "created",
      data: notification,
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
 * Broadcast message to specific user
 */
function broadcastToUser(wss: WebSocketServer, userId: string, message: any) {
  wss.clients.forEach((client: AuthenticatedWebSocket) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
