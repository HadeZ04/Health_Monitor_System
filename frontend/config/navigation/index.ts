/**
 * ============================================
 * NAVIGATION CONFIGURATION
 * HEALTHCARE DESIGN SYSTEM
 * ============================================
 * 
 * Role-based navigation for 3 user types:
 * - Patient
 * - Doctor
 * - Admin
 */

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
  History,
  Calendar,
  Heart,
  Pill,
  ClipboardList,
  Stethoscope,
  UserCog,
  BarChart3,
  Shield,
  Database,
  HardDrive,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number | string; // For notification counts
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * ========================================
 * PATIENT NAVIGATION
 * ========================================
 */
export const patientNavigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Your health overview',
      },
      {
        label: 'My Health',
        href: '/dashboard/health',
        icon: Heart,
        description: 'Current health status',
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      {
        label: 'Live Vitals',
        href: '/dashboard/monitoring/live',
        icon: Activity,
        description: 'Real-time vital signs',
      },
      {
        label: 'History',
        href: '/dashboard/history',
        icon: History,
        description: 'View past records',
      },
      {
        label: 'GPS Tracking',
        href: '/dashboard/metrics/gps',
        icon: MapPinned,
        description: 'Location tracking',
      },
    ],
  },
  {
    title: 'Care',
    items: [
      {
        label: 'Appointments',
        href: '/dashboard/appointments',
        icon: Calendar,
        description: 'Schedule & manage',
      },
      {
        label: 'Medications',
        href: '/dashboard/medications',
        icon: Pill,
        description: 'Prescription tracker',
      },
      {
        label: 'Chat with Doctor',
        href: '/dashboard/chat',
        icon: MessageCircle,
        description: 'Message your doctor',
        badge: 2, // Unread messages
      },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      {
        label: 'AI Health Assistant',
        href: '/dashboard/ai-chat',
        icon: MessageSquare,
        description: 'Get instant answers',
      },
      {
        label: 'Alerts',
        href: '/dashboard/alerts',
        icon: Bell,
        description: 'Health notifications',
        badge: 3,
      },
      {
        label: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
        description: 'Medical reports',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: UserRound,
        description: 'Personal information',
      },
    ],
  },
];

/**
 * ========================================
 * DOCTOR NAVIGATION
 * ========================================
 */
export const doctorNavigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Clinical overview',
      },
      {
        label: 'Today\'s Schedule',
        href: '/dashboard/schedule',
        icon: Calendar,
        description: 'Appointments today',
        badge: 8,
      },
    ],
  },
  {
    title: 'Patient Care',
    items: [
      {
        label: 'Patients',
        href: '/dashboard/patients',
        icon: Users,
        description: 'Patient list',
      },
      {
        label: 'Live Monitoring',
        href: '/dashboard/monitoring/live',
        icon: Activity,
        description: 'Real-time vitals',
        badge: 'NEW',
      },
      {
        label: 'Replay Center',
        href: '/dashboard/monitoring/replay',
        icon: History,
        description: 'Historical data',
      },
      {
        label: 'Consultations',
        href: '/dashboard/consultations',
        icon: Stethoscope,
        description: 'Video & chat',
        badge: 2,
      },
    ],
  },
  {
    title: 'Clinical Tools',
    items: [
      {
        label: 'ECG Analysis',
        href: '/dashboard/metrics/ecg',
        icon: Activity,
        description: 'ECG monitoring',
      },
      {
        label: 'Vital Signs',
        href: '/dashboard/metrics',
        icon: Gauge,
        description: 'All vital signs',
      },
      {
        label: 'Lab Results',
        href: '/dashboard/lab-results',
        icon: ClipboardList,
        description: 'Test results',
      },
      {
        label: 'Prescriptions',
        href: '/dashboard/prescriptions',
        icon: Pill,
        description: 'Manage medications',
      },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      {
        label: 'AI Clinical Assistant',
        href: '/dashboard/ai-chat',
        icon: MessageSquare,
        description: 'AI-powered insights',
      },
      {
        label: 'Alert Center',
        href: '/dashboard/alerts',
        icon: Bell,
        description: 'Critical alerts',
        badge: 5,
      },
      {
        label: 'Analytics Hub',
        href: '/dashboard/analytics',
        icon: Gauge,
        description: 'Data analytics',
      },
      {
        label: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
        description: 'Generate reports',
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        label: 'Messages',
        href: '/dashboard/chat',
        icon: MessageCircle,
        description: 'Patient messages',
        badge: 12,
      },
      {
        label: 'Team Chat',
        href: '/dashboard/team-chat',
        icon: Users,
        description: 'Doctor collaboration',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: UserRound,
        description: 'Your profile',
      },
    ],
  },
];

/**
 * ========================================
 * ADMIN NAVIGATION
 * ========================================
 */
export const adminNavigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Admin Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'System overview & KPIs',
      },
      {
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'System analytics',
      },
    ],
  },
  {
    title: 'User Management',
    items: [
      {
        label: 'All Users',
        href: '/admin/users',
        icon: Users,
        description: 'Manage all users',
      },
      {
        label: 'Doctors',
        href: '/admin/doctors',
        icon: Stethoscope,
        description: 'Manage doctors',
      },
      {
        label: 'Patients',
        href: '/admin/patients',
        icon: Heart,
        description: 'Manage patients',
      },
      {
        label: 'Roles & Permissions',
        href: '/admin/roles',
        icon: Shield,
        description: 'Role management',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'System Settings',
        href: '/admin/settings',
        icon: ServerCog,
        description: 'System configuration',
      },
      {
        label: 'IoT Devices',
        href: '/dashboard/iot',
        icon: Cpu,
        description: 'Device management',
      },
      {
        label: 'Database',
        href: '/dashboard/database',
        icon: Database,
        description: 'Database admin',
      },
      {
        label: 'Storage',
        href: '/dashboard/storage',
        icon: HardDrive,
        description: 'File storage',
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      {
        label: 'Live Monitoring',
        href: '/dashboard/monitoring/live',
        icon: Activity,
        description: 'Real-time overview',
      },
      {
        label: 'Audit Logs',
        href: '/admin/logs',
        icon: ClipboardList,
        description: 'System activity logs',
      },
      {
        label: 'Alert Management',
        href: '/dashboard/alerts',
        icon: Bell,
        description: 'Alert rules',
        badge: 8,
      },
      {
        label: 'Emergency Center',
        href: '/dashboard/emergency',
        icon: AlertTriangle,
        description: 'Emergency alerts',
        badge: 'URGENT',
      },
    ],
  },
  {
    title: 'Reports & Support',
    items: [
      {
        label: 'System Reports',
        href: '/dashboard/reports',
        icon: FileText,
        description: 'Generate reports',
      },
      {
        label: 'Documentation',
        href: '/admin/docs',
        icon: FileText,
        description: 'Admin guide',
      },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      {
        label: 'AI Chat',
        href: '/dashboard/ai-chat',
        icon: MessageSquare,
        description: 'AI assistant',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: UserRound,
        description: 'Your profile',
      },
    ],
  },
];

/**
 * ========================================
 * NAVIGATION SELECTOR
 * ========================================
 */
export function getNavigationForRole(role?: string): NavSection[] {
  switch (role?.toLowerCase()) {
    case 'patient':
      return patientNavigation;
    case 'doctor':
      return doctorNavigation;
    case 'admin':
      return adminNavigation;
    default:
      return patientNavigation; // Default fallback
  }
}

/**
 * Get all available routes for a role (for authorization)
 */
export function getAllowedRoutesForRole(role?: string): string[] {
  const navigation = getNavigationForRole(role);
  return navigation.flatMap(section => section.items.map(item => item.href));
}
