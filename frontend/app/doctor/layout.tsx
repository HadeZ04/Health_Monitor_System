"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  AlertTriangle,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Stethoscope,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: number;
}

const navigation: NavItem[] = [
  { href: "/doctor/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Bệnh nhân", icon: Users },
  { href: "/doctor/schedule", label: "Lịch khám", icon: Calendar, badge: 5 },
  { href: "/doctor/lab-orders", label: "Xét nghiệm", icon: FlaskConical, badge: 3 },
  { href: "/doctor/critical", label: "Theo dõi ưu tiên", icon: AlertTriangle, badge: 2 },
  { href: "/doctor/messages", label: "Tin nhắn", icon: MessageSquare, badge: 8 },
];

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock doctor data
  const doctor = {
    name: "BS. Trần Thị Minh Châu",
    specialty: "Tim mạch",
    avatar: "/api/placeholder/40/40",
    unreadNotifications: 5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo + Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link href="/doctor/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800">TechXen Health</h1>
                <p className="text-xs text-slate-500 -mt-1">Doctor Portal</p>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân, mã hồ sơ, lịch hẹn..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-primary-300 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              {doctor.unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  TC
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-800">{doctor.name}</p>
                  <p className="text-xs text-slate-500">{doctor.specialty}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <Link
                    href="/doctor/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Hồ sơ cá nhân</span>
                  </Link>
                  <Link
                    href="/doctor/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Cài đặt</span>
                  </Link>
                  <hr className="my-2 border-slate-200" />
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-danger-50 transition-colors w-full text-left">
                    <LogOut className="w-4 h-4 text-danger-500" />
                    <span className="text-sm text-danger-600">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg shadow-primary-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-500"
                  )}
                />
                <span className={cn("font-medium text-sm", isActive && "text-white")}>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <Badge
                    className={cn(
                      "ml-auto text-xs",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-danger-100 text-danger-700"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats in Sidebar */}
        <div className="p-4 mt-4 space-y-3">
          <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-4 border border-primary-100">
            <p className="text-xs text-slate-600 mb-1">Ca khám hôm nay</p>
            <p className="text-2xl font-bold text-primary-600">12</p>
            <p className="text-xs text-slate-500 mt-1">8 đã hoàn thành</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-danger-50 rounded-xl p-4 border border-orange-100">
            <p className="text-xs text-slate-600 mb-1">Bệnh nhân ưu tiên</p>
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-xs text-slate-500 mt-1">Cần theo dõi sát</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "pl-0"
        )}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
