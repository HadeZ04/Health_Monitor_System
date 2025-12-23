import type { Request, Response } from "express";

export const exportReport = (_req: Request, res: Response) => {
  res.status(202).json({ message: "Report generation queued" });
};

export const listReportTemplates = (_req: Request, res: Response) => {
  res.json({ templates: ["PDF diagnostic", "Excel vitals", "EHR sync"] });
};
