import type { Request, Response } from "express";

export const listAlerts = (_req: Request, res: Response) => {
  res.json({
    alerts: [
      { id: "AL-01", type: "HR", severity: "high" },
      { id: "AL-02", type: "SpO2", severity: "critical" }
    ]
  });
};

export const getAlertRules = (_req: Request, res: Response) => {
  res.json({
    rules: [
      { id: "HR_HIGH", threshold: 150 },
      { id: "SPO2_LOW", threshold: 88 }
    ]
  });
};

export const createTestAlert = (_req: Request, res: Response) => {
  res.status(201).json({ message: "Alert created" });
};
