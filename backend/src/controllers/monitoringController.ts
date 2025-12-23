import type { Request, Response } from "express";

export const getStreams = (_req: Request, res: Response) => {
  res.json({
    streams: [
      { id: "ws", protocol: "wss://stream", status: "connected" },
      { id: "mqtt", protocol: "mqtt://broker", status: "connected" }
    ]
  });
};

export const getReplaySegments = (_req: Request, res: Response) => {
  res.json({
    segments: [
      { id: "morning", duration: 120 },
      { id: "training", duration: 80 }
    ]
  });
};

export const requestExport = (_req: Request, res: Response) => {
  res.status(202).json({ message: "Export queued" });
};
