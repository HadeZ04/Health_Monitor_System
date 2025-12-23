import type { Request, Response } from "express";

export const listDevices = (_req: Request, res: Response) => {
  res.json({ devices: [] });
};

export const createDevice = (_req: Request, res: Response) => {
  res.status(201).json({ message: "Device created stub" });
};
