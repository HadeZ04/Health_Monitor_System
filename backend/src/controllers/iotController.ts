import type { Request, Response } from "express";

export const listIotDevices = (_req: Request, res: Response) => {
  res.json({ devices: [] });
};

export const scheduleFirmware = (_req: Request, res: Response) => {
  res.status(202).json({ message: "OTA scheduled" });
};

export const getOtaStatus = (_req: Request, res: Response) => {
  res.json({ queue: [] });
};
