import {
  LayoutDashboard,
  Activity,
  Gauge,
  MapPinned,
  MessageSquare,
  Bell,
  FileText,
  Users,
  MessageCircle,
  UserRound,
  Cpu,
  ServerCog,
  AlertTriangle,
  History
} from "lucide-react";

export const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Live Monitoring", href: "/dashboard/monitoring/live", icon: Activity },
      { label: "Replay Center", href: "/dashboard/monitoring/replay", icon: History },
      { label: "Analytics Hub", href: "/dashboard/analytics", icon: Gauge }
    ]
  },
  {
    title: "Vitals",
    items: [
      { label: "ECG", href: "/dashboard/metrics/ecg", icon: Activity },
      { label: "SpO2", href: "/dashboard/metrics/spo2", icon: Gauge },
      { label: "Heart Rate", href: "/dashboard/metrics/heartrate", icon: Activity },
      { label: "PPG", href: "/dashboard/metrics/ppg", icon: Activity },
      { label: "PCG", href: "/dashboard/metrics/pcg", icon: Activity },
      { label: "GPS", href: "/dashboard/metrics/gps", icon: MapPinned }
    ]
  },
  {
    title: "Intelligence",
    items: [
      { label: "AI Chatbot", href: "/dashboard/ai-chat", icon: MessageSquare },
      { label: "Alert Center", href: "/dashboard/alerts", icon: Bell },
      { label: "Reports", href: "/dashboard/reports", icon: FileText }
    ]
  },
  {
    title: "Care Team",
    items: [
      { label: "Patients", href: "/dashboard/patients", icon: Users },
      { label: "Doctor Chat", href: "/dashboard/chat", icon: MessageCircle },
      { label: "Doctors", href: "/dashboard/doctors", icon: Users },
      { label: "Profile", href: "/dashboard/profile", icon: UserRound }
    ]
  },
  {
    title: "Devices",
    items: [
      { label: "Devices", href: "/dashboard/devices", icon: Cpu },
      { label: "IoT Control", href: "/dashboard/iot", icon: ServerCog },
      { label: "History", href: "/dashboard/history", icon: History },
      { label: "Emergency", href: "/dashboard/emergency", icon: AlertTriangle }
    ]
  }
];
