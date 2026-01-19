export interface User {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin" | "researcher";
}

export interface Device {
  id: string;
  name: string;
  status: "online" | "offline";
}

export interface SignalRecord {
  id: string;
  type: "ecg" | "spo2" | "heartrate" | "ppg" | "pcg" | "gps";
  recordedAt: Date;
}

export interface PatientProfile {
  id: string;
  userId: string;
  age?: number;
  gender?: string;
  medicalHistory?: string;
}

export interface AlertRule {
  id: string;
  label: string;
  condition: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  triggeredAt: Date;
  status: "open" | "acknowledged" | "resolved";
}

export interface FirmwareJob {
  id: string;
  deviceId: string;
  version: string;
  status: "queued" | "deploying" | "completed";
}
