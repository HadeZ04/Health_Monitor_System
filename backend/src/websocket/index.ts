import type { Server } from "http";
import { WebSocketServer } from "ws";

export const createWebsocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");
    socket.on("message", (message) => {
      console.log("received", message.toString());
      socket.send(JSON.stringify({ type: "ack", message: "Stub response" }));
    });
  });

  return wss;
};
