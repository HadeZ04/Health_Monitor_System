import type { Request, Response } from "express";

const patients = [
  { id: "PAT-01", name: "Ava Nguyen", age: 42, role: "patient" },
  { id: "PAT-02", name: "Liam Tran", age: 55, role: "patient" }
];

export const listPatients = (_req: Request, res: Response) => {
  res.json({ patients });
};

export const getPatient = (req: Request, res: Response) => {
  const patient = patients.find((item) => item.id === req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json({ patient });
};

export const getPatientVitals = (req: Request, res: Response) => {
  res.json({
    patientId: req.params.id,
    vitals: [
      { type: "ecg", value: [] },
      { type: "spo2", value: [] }
    ]
  });
};

export const getPatientEhr = (req: Request, res: Response) => {
  res.json({
    patientId: req.params.id,
    ehr: { history: [], medications: [] }
  });
};
