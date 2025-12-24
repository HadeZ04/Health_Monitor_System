import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { monitoringService } from "../services/monitoring.service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "techxen-dev-secret";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  role?: string;
  isAlive?: boolean;
}

/**
 * WebSocket Server for real-time monitoring
 */
export class MonitoringWSServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<AuthenticatedWebSocket> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize WebSocket server
   */
  initialize(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/monitoring/stream",
    });

    console.log("WebSocket server initialized at /monitoring/stream");

    // Handle new connections
    this.wss.on("connection", (ws: AuthenticatedWebSocket, req) => {
      console.log("New WebSocket connection attempt");

      // Authenticate connection
      const token = this.extractToken(req.url || "");
      if (!token) {
        ws.close(1008, "Authentication required");
        return;
      }

      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        ws.userId = payload.sub;
        ws.role = payload.role;

        // Check if user has monitoring permissions (admin or doctor)
        if (!["admin", "doctor"].includes(ws.role || "")) {
          ws.close(1008, "Insufficient permissions");
          return;
        }

        console.log(`WebSocket authenticated: userId=${ws.userId}, role=${ws.role}`);

        // Add to clients
        this.clients.add(ws);
        ws.isAlive = true;

        // Send welcome message
        this.sendToClient(ws, {
          type: "connected",
          message: "Connected to monitoring stream",
          timestamp: new Date(),
        });

        // Handle pong responses
        ws.on("pong", () => {
          ws.isAlive = true;
        });

        // Handle messages from client
        ws.on("message", (data) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleClientMessage(ws, message);
          } catch (error) {
            console.error("Error parsing client message:", error);
          }
        });

        // Handle disconnect
        ws.on("close", () => {
          console.log(`WebSocket disconnected: userId=${ws.userId}`);
          this.clients.delete(ws);
        });

        ws.on("error", (error) => {
          console.error("WebSocket error:", error);
          this.clients.delete(ws);
        });
      } catch (error) {
        console.error("WebSocket authentication error:", error);
        ws.close(1008, "Invalid token");
      }
    });

    // Start monitoring service
    this.startMonitoring();

    // Start heartbeat
    this.startHeartbeat();
  }

  /**
   * Extract JWT token from query string
   */
  private extractToken(url: string): string | null {
    const match = url.match(/[?&]token=([^&]+)/);
    return match?.[1] ?? null;
  }

  /**
   * Start monitoring and broadcast metrics
   */
  private startMonitoring() {
    // Listen to monitoring service events
    monitoringService.on("metrics", (metrics) => {
      this.broadcast({
        type: "metrics",
        data: metrics,
      });
    });

    monitoringService.on("alert", (alert) => {
      this.broadcast({
        type: "alert",
        data: alert,
      });
    });

    monitoringService.on("error", (error) => {
      console.error("Monitoring service error:", error);
    });

    // Start collecting metrics
    monitoringService.startMonitoring(5000); // Every 5 seconds
  }

  /**
   * Start heartbeat to detect dead connections
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          console.log("Terminating dead connection");
          this.clients.delete(ws);
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Every 30 seconds
  }

  /**
   * Handle messages from clients
   */
  private handleClientMessage(ws: AuthenticatedWebSocket, message: any) {
    console.log("Client message:", message);

    switch (message.type) {
      case "ping":
        this.sendToClient(ws, { type: "pong", timestamp: new Date() });
        break;

      case "subscribe":
        // Client can subscribe to specific metric types
        this.sendToClient(ws, {
          type: "subscribed",
          channel: message.channel,
        });
        break;

      case "unsubscribe":
        this.sendToClient(ws, {
          type: "unsubscribed",
          channel: message.channel,
        });
        break;

      default:
        this.sendToClient(ws, {
          type: "error",
          message: "Unknown message type",
        });
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: any) {
    const payload = JSON.stringify(message);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Send message to specific client
   */
  private sendToClient(client: WebSocket, message: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast alert to all clients
   */
  broadcastAlert(alert: any) {
    this.broadcast({
      type: "alert",
      data: alert,
      timestamp: new Date(),
    });
  }

  /**
   * Get number of connected clients
   */
  getConnectedClients(): number {
    return this.clients.size;
  }

  /**
   * Shutdown WebSocket server
   */
  shutdown() {
    console.log("Shutting down WebSocket server");

    // Stop monitoring
    monitoringService.stopMonitoring();

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all connections
    this.clients.forEach((client) => {
      client.close(1000, "Server shutting down");
    });

    // Close server
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const monitoringWSServer = new MonitoringWSServer();
