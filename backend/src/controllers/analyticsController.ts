import type { Request, Response } from "express";

export const getTrendSummary = (_req: Request, res: Response) => {
  res.json({
    heartRate: [72, 74, 76],
    spo2: [97, 96, 95],
    arrhythmia: { pvc: 12, afib: 4 }
  });
};

export const getGpsHeatmap = (_req: Request, res: Response) => {
  res.json({
    spots: [
      { lat: 10.8, lng: 106.7, count: 12 }
    ]
  });
};
