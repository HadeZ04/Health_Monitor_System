"use client";

import Link from "next/link";
import { 
  Home, Users, Stethoscope, Activity, Calendar, Settings,
  LayoutDashboard, Heart, FileText, MessageSquare, Bell,
  ClipboardList, Pill, FlaskConical, BarChart3, Shield,
  UserCog, Lock, AlertTriangle, Globe, Cog
} from "lucide-react";

export default function TestUIPage() {
  const sections = [
    {
      title: "🏠 Landing & Auth",
      color: "from-blue-500 to-cyan-500",
      pages: [
        { name: "Landing Page", href: "/", icon: Home },
        { name: "Login", href: "/auth/login", icon: Lock },
        { name: "Register", href: "/patient/register", icon: UserCog },
      ]
    },
    {
      title: "👤 Patient Portal",
      color: "from-green-500 to-emerald-500",
      pages: [
        { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
        { name: "Appointments", href: "/patient/appointments", icon: Calendar },
        { name: "Metrics", href: "/patient/metrics", icon: Activity },
        { name: "History", href: "/patient/history", icon: FileText },
        { name: "Medications", href: "/patient/medications", icon: Pill },
        { name: "Lab Results", href: "/patient/lab-results", icon: FlaskConical },
        { name: "Chat", href: "/patient/chat", icon: MessageSquare },
        { name: "Profile", href: "/patient/profile", icon: Users },
        { name: "Settings", href: "/patient/settings", icon: Settings },
      ]
    },
    {
      title: "🩺 Doctor Portal",
      color: "from-purple-500 to-pink-500",
      pages: [
        { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
        { name: "Patients List", href: "/doctor/patients", icon: Users },
        { name: "Critical Patients", href: "/doctor/critical", icon: AlertTriangle },
        { name: "Schedule", href: "/doctor/schedule", icon: Calendar },
        { name: "Consultation", href: "/doctor/consultation", icon: Stethoscope },
        { name: "Lab Orders", href: "/doctor/lab-orders", icon: FlaskConical },
        { name: "Messages", href: "/doctor/messages", icon: MessageSquare },
        { name: "Profile", href: "/doctor/profile", icon: Users },
        { name: "Settings", href: "/doctor/settings", icon: Settings },
      ]
    },
    {
      title: "⚙️ Admin Portal",
      color: "from-red-500 to-orange-500",
      pages: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users Management", href: "/admin/users", icon: Users },
        { name: "Doctors Management", href: "/admin/doctors", icon: Stethoscope },
        { name: "Patients Management", href: "/admin/patients", icon: Heart },
        { name: "Roles & Permissions", href: "/admin/roles", icon: Shield },
        { name: "System Logs", href: "/admin/logs", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    },
    {
      title: "📊 Dashboard (General)",
      color: "from-yellow-500 to-amber-500",
      pages: [
        { name: "Main Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Monitoring", href: "/dashboard/monitoring", icon: Activity },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "IoT Devices", href: "/dashboard/iot", icon: Globe },
        { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
        { name: "Emergency", href: "/dashboard/emergency", icon: AlertTriangle },
        { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
        { name: "Reports", href: "/dashboard/reports", icon: FileText },
      ]
    },
    {
      title: "🎨 Shared Components Demo",
      color: "from-indigo-500 to-violet-500",
      pages: [
        { name: "All Shared Components", href: "/demo/shared-components", icon: Cog },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-7 w-7 text-primary-600" />
                Health Monitor System
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                UI Testing & Navigation Panel - Kiểm tra toàn bộ giao diện
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-500">Version</div>
              <div className="text-sm font-semibold text-primary-600">Frontend v0.1.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">35+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total Pages</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">User Portals</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Cog className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">10+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Shared Components</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Responsive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                {section.title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.pages.map((page, pageIdx) => (
                  <Link
                    key={pageIdx}
                    href={page.href}
                    className="group flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all hover:shadow-md"
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-sm`}>
                      <page.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                        {page.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                        {page.href}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                📌 Lưu ý khi test UI
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Mock data đã được <strong>gỡ bỏ hoàn toàn</strong> - xem <code>BACKEND_API_PLAN.md</code></li>
                <li>• Các form submit sẽ chỉ hiển thị alert/console.log</li>
                <li>• Shared components có demo riêng tại <Link href="/demo/shared-components" className="text-primary-600 hover:underline">/demo/shared-components</Link></li>
                <li>• Dark mode được support toàn bộ - toggle ở góc phải navbar</li>
                <li>• Responsive design - test trên mobile, tablet, desktop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
