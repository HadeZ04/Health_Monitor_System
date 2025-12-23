import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { deviceRouter } from "./routes/devices.js";
import { signalRouter } from "./routes/signals.js";
import { chatbotRouter } from "./routes/chatbot.js";
import { monitoringRouter } from "./routes/monitoring.js";
import { patientsRouter } from "./routes/patients.js";
import { alertsRouter } from "./routes/alerts.js";
import { analyticsRouter } from "./routes/analytics.js";
import { reportsRouter } from "./routes/reports.js";
import { iotRouter } from "./routes/iot.js";
import { createWebsocketServer } from "./websocket/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/devices", deviceRouter);
app.use("/signals", signalRouter);
app.use("/chat", chatbotRouter);
app.use("/monitoring", monitoringRouter);
app.use("/patients", patientsRouter);
app.use("/alerts", alertsRouter);
app.use("/analytics", analyticsRouter);
app.use("/reports", reportsRouter);
app.use("/iot", iotRouter);

const port = process.env.PORT ?? 4000;
const server = app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

createWebsocketServer(server);
