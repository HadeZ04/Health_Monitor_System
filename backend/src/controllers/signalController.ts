import type { Request, Response } from "express";

const stubData = (type: string) => ({ type, data: [] });

export const getEcg = (_req: Request, res: Response) => res.json(stubData("ecg"));
export const getSpo2 = (_req: Request, res: Response) => res.json(stubData("spo2"));
export const getHeartRate = (_req: Request, res: Response) => res.json(stubData("heartrate"));
export const getPpg = (_req: Request, res: Response) => res.json(stubData("ppg"));
export const getPcg = (_req: Request, res: Response) => res.json(stubData("pcg"));
export const getGps = (_req: Request, res: Response) => res.json(stubData("gps"));
