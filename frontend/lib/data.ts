export const overviewCards = [
  { title: "Last HR", value: "74 bpm", change: "+2", trend: "up" },
  { title: "Last SpO2", value: "97%", change: "Stable", trend: "flat" },
  { title: "Last ECG state", value: "Normal sinus", change: "Real-time", trend: "stable" },
  { title: "Device status", value: "3 online", change: "1 maintenance", trend: "warn" }
];

export const devices = [
  { id: "DEV-221", name: "Chest Strap", status: "online", battery: 86, lastSync: "2m ago" },
  { id: "DEV-146", name: "Pulse Oximeter", status: "offline", battery: 0, lastSync: "13m ago" },
  { id: "DEV-312", name: "ECG Patch", status: "online", battery: 64, lastSync: "Just now" }
];

export const doctors = [
  { name: "Dr. Rivera", specialty: "Cardiology", patients: 32 },
  { name: "Dr. Walsh", specialty: "Pulmonology", patients: 18 }
];

export const historyRecords = Array.from({ length: 8 }).map((_, idx) => ({
  id: idx + 1,
  signal: ["ECG", "SpO2", "HR", "PPG"][idx % 4],
  date: `2024-09-${10 + idx}`,
  status: idx % 2 === 0 ? "Normal" : "Needs review"
}));

export const liveSignals = [
  { id: "ecg", label: "ECG", value: "72 bpm", status: "stable", unit: "bpm", change: "+3", lastUpdated: "2s" },
  { id: "spo2", label: "SpO2", value: "97%", status: "stable", unit: "%", change: "0", lastUpdated: "5s" },
  { id: "hr", label: "Heart Rate", value: "74 bpm", status: "watch", unit: "bpm", change: "+4", lastUpdated: "1s" },
  { id: "ppg", label: "PPG", value: "Smooth", status: "stable", unit: "wave", change: "-", lastUpdated: "4s" },
  { id: "pcg", label: "PCG", value: "72 dB", status: "stable", unit: "dB", change: "-2", lastUpdated: "7s" },
  { id: "gps", label: "GPS", value: "Active", status: "tracking", unit: "path", change: "--", lastUpdated: "10s" }
];

export const streamStatuses = [
  { id: "ws", label: "WebSocket", protocol: "wss://", status: "connected", uptime: "3h 12m", throughput: "512 kbps" },
  { id: "mqtt", label: "MQTT", protocol: "mqtt://", status: "connected", uptime: "12h", throughput: "1.2 kbps" },
  { id: "backup", label: "Backup Stream", protocol: "https://", status: "standby", uptime: "-", throughput: "-" }
];

export const replaySegments = [
  { id: "r1", label: "Morning Round", duration: "2h 15m", hrAvg: 72, spo2Avg: 96 },
  { id: "r2", label: "Training Session", duration: "1h 05m", hrAvg: 128, spo2Avg: 94 },
  { id: "r3", label: "Night Rest", duration: "6h 40m", hrAvg: 58, spo2Avg: 98 }
];

export const aiInsights = [
  { id: "ai1", title: "Arrhythmia prediction", detail: "AFib probability 12% in next 48h", confidence: 0.12 },
  { id: "ai2", title: "PPG abnormality", detail: "Possible elevated blood pressure", confidence: 0.32 },
  { id: "ai3", title: "PCG acoustic note", detail: "Soft systolic murmur detected", confidence: 0.21 }
];

export const patientList = [
  { id: "PAT-01", name: "Ava Nguyen", age: 42, gender: "F", condition: "Cardiac rehab", lastSignal: "ECG" },
  { id: "PAT-02", name: "Liam Tran", age: 55, gender: "M", condition: "Hypertension", lastSignal: "SpO2" },
  { id: "PAT-03", name: "Mia Pham", age: 34, gender: "F", condition: "Arrhythmia watch", lastSignal: "PPG" }
];

export const patientVitals = Array.from({ length: 12 }).map((_, idx) => ({
  time: `${idx + 1}:00`,
  hr: 70 + Math.round(Math.sin(idx) * 6),
  spo2: 95 + (idx % 3),
  arrhythmia: idx % 4 === 0 ? 1 : 0
}));

export const ehrEvents = [
  { id: "ehr1", title: "Admission", date: "2024-03-12", description: "Arrhythmia evaluation", type: "event" },
  { id: "ehr2", title: "Medication updated", date: "2024-05-01", description: "Added beta blocker", type: "medication" },
  { id: "ehr3", title: "Telehealth consult", date: "2024-06-21", description: "Symptom review", type: "note" }
];

export const medications = [
  { id: "med1", name: "Metoprolol", dosage: "25mg", schedule: "2x daily", status: "active" },
  { id: "med2", name: "Atorvastatin", dosage: "10mg", schedule: "Night", status: "active" },
  { id: "med3", name: "Omega-3", dosage: "1g", schedule: "Daily", status: "supplement" }
];

export const doctorMessages = [
  { id: "msg1", author: "Doctor", content: "How are your symptoms today?", timestamp: "09:12" },
  { id: "msg2", author: "Patient", content: "Feeling better, HR is smoother.", timestamp: "09:15" }
];

export const alertEvents = [
  { id: "AL-01", type: "Heart Rate", severity: "high", status: "Open", triggeredAt: "2m ago" },
  { id: "AL-02", type: "SpO2", severity: "critical", status: "Escalated", triggeredAt: "10m ago" },
  { id: "AL-03", type: "AFib", severity: "medium", status: "Review", triggeredAt: "1h ago" }
];

export const alertRules = [
  { id: "HR_HIGH", label: "HR > 150 bpm", channels: ["SMS", "Email"], threshold: "150", enabled: true },
  { id: "HR_LOW", label: "HR < 40 bpm", channels: ["SMS"], threshold: "40", enabled: true },
  { id: "SPO2_LOW", label: "SpO2 < 88%", channels: ["SMS", "Telegram", "Zalo"], threshold: "88", enabled: true }
];

export const deliveryChannels = [
  { id: "sms", label: "SMS", status: "connected" },
  { id: "email", label: "Email", status: "connected" },
  { id: "telegram", label: "Telegram Bot", status: "connected" },
  { id: "zalo", label: "Zalo Notify", status: "pending" }
];

export const firmwareQueue = [
  { id: "DEV-221", version: "1.0.5", status: "deploying", eta: "5m" },
  { id: "DEV-146", version: "1.0.3", status: "queued", eta: "Tonight" }
];

export const analyticsSeries = {
  heartRate: [
    { label: "Mon", value: 72 },
    { label: "Tue", value: 76 },
    { label: "Wed", value: 74 },
    { label: "Thu", value: 78 },
    { label: "Fri", value: 81 },
    { label: "Sat", value: 70 },
    { label: "Sun", value: 68 }
  ],
  spo2: [
    { label: "Mon", value: 97 },
    { label: "Tue", value: 96 },
    { label: "Wed", value: 95 },
    { label: "Thu", value: 96 },
    { label: "Fri", value: 95 },
    { label: "Sat", value: 97 },
    { label: "Sun", value: 98 }
  ]
};

export const arrhythmiaStats = [
  { label: "PVC", value: 12 },
  { label: "PAC", value: 8 },
  { label: "AFib", value: 4 }
];

export const alertTotals = [
  { label: "Alerts this week", value: 23, trend: "+8%" },
  { label: "Critical responded", value: "9/9", trend: "100%" },
  { label: "Average response", value: "3m", trend: "-1m" }
];

export const gpsHeatSpots = [
  { id: "gps1", label: "District 1", count: 12 },
  { id: "gps2", label: "Tan Binh", count: 7 },
  { id: "gps3", label: "Thu Duc", count: 5 }
];

export const ragSources = [
  { id: "src1", title: "WHO Arrhythmia 2024", region: "Global", language: "EN" },
  { id: "src2", title: "Vietnam MoH Telehealth", region: "VN", language: "VI" },
  { id: "src3", title: "PubMed PPG Studies", region: "Global", language: "EN" }
];
