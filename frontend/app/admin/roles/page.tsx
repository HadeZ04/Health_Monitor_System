"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Shield,
  Check,
  X,
  Edit,
  Plus,
  Users,
  Lock
} from "lucide-react";

// Mock data - sẽ thay thế bằng API calls
const roles = [
  { id: 1, name: "Admin", slug: "admin", users: 5, color: "red", description: "Toàn quyền quản trị hệ thống" },
  { id: 2, name: "Doctor", slug: "doctor", users: 45, color: "green", description: "Bác sĩ - quản lý bệnh nhân và khám chữa bệnh" },
  { id: 3, name: "Patient", slug: "patient", users: 1247, color: "blue", description: "Bệnh nhân - xem và quản lý hồ sơ cá nhân" },
  { id: 4, name: "Staff", slug: "staff", users: 23, color: "purple", description: "Nhân viên - hỗ trợ vận hành" },
];

const modules = [
  { id: 1, name: "Dashboard", key: "dashboard", description: "Trang tổng quan" },
  { id: 2, name: "User Management", key: "users", description: "Quản lý người dùng" },
  { id: 3, name: "Doctor Management", key: "doctors", description: "Quản lý bác sĩ" },
  { id: 4, name: "Patient Management", key: "patients", description: "Quản lý bệnh nhân" },
  { id: 5, name: "Appointments", key: "appointments", description: "Quản lý lịch hẹn" },
  { id: 6, name: "Medical Records", key: "medical_records", description: "Hồ sơ bệnh án" },
  { id: 7, name: "Live Monitoring", key: "monitoring", description: "Theo dõi sinh hiệu" },
  { id: 8, name: "AI Chat", key: "ai_chat", description: "Trợ lý AI" },
  { id: 9, name: "Reports", key: "reports", description: "Báo cáo" },
  { id: 10, name: "Analytics", key: "analytics", description: "Phân tích dữ liệu" },
  { id: 11, name: "IoT Devices", key: "iot", description: "Quản lý thiết bị" },
  { id: 12, name: "System Settings", key: "settings", description: "Cài đặt hệ thống" },
  { id: 13, name: "Audit Logs", key: "logs", description: "Nhật ký hệ thống" },
  { id: 14, name: "Security", key: "security", description: "Bảo mật" },
];

// Permission matrix: role -> module -> permissions
const permissionMatrix: Record<string, Record<string, { read: boolean; write: boolean; delete: boolean }>> = {
  admin: {
    dashboard: { read: true, write: true, delete: true },
    users: { read: true, write: true, delete: true },
    doctors: { read: true, write: true, delete: true },
    patients: { read: true, write: true, delete: true },
    appointments: { read: true, write: true, delete: true },
    medical_records: { read: true, write: true, delete: true },
    monitoring: { read: true, write: true, delete: true },
    ai_chat: { read: true, write: true, delete: false },
    reports: { read: true, write: true, delete: true },
    analytics: { read: true, write: true, delete: false },
    iot: { read: true, write: true, delete: true },
    settings: { read: true, write: true, delete: false },
    logs: { read: true, write: false, delete: false },
    security: { read: true, write: true, delete: false },
  },
  doctor: {
    dashboard: { read: true, write: false, delete: false },
    users: { read: false, write: false, delete: false },
    doctors: { read: true, write: false, delete: false },
    patients: { read: true, write: true, delete: false },
    appointments: { read: true, write: true, delete: false },
    medical_records: { read: true, write: true, delete: false },
    monitoring: { read: true, write: false, delete: false },
    ai_chat: { read: true, write: true, delete: false },
    reports: { read: true, write: true, delete: false },
    analytics: { read: true, write: false, delete: false },
    iot: { read: true, write: false, delete: false },
    settings: { read: false, write: false, delete: false },
    logs: { read: false, write: false, delete: false },
    security: { read: false, write: false, delete: false },
  },
  patient: {
    dashboard: { read: true, write: false, delete: false },
    users: { read: false, write: false, delete: false },
    doctors: { read: true, write: false, delete: false },
    patients: { read: false, write: false, delete: false },
    appointments: { read: true, write: true, delete: false },
    medical_records: { read: true, write: false, delete: false },
    monitoring: { read: true, write: false, delete: false },
    ai_chat: { read: true, write: true, delete: false },
    reports: { read: true, write: false, delete: false },
    analytics: { read: false, write: false, delete: false },
    iot: { read: false, write: false, delete: false },
    settings: { read: false, write: false, delete: false },
    logs: { read: false, write: false, delete: false },
    security: { read: false, write: false, delete: false },
  },
  staff: {
    dashboard: { read: true, write: false, delete: false },
    users: { read: true, write: false, delete: false },
    doctors: { read: true, write: false, delete: false },
    patients: { read: true, write: true, delete: false },
    appointments: { read: true, write: true, delete: false },
    medical_records: { read: true, write: false, delete: false },
    monitoring: { read: true, write: false, delete: false },
    ai_chat: { read: true, write: false, delete: false },
    reports: { read: true, write: false, delete: false },
    analytics: { read: false, write: false, delete: false },
    iot: { read: true, write: false, delete: false },
    settings: { read: false, write: false, delete: false },
    logs: { read: false, write: false, delete: false },
    security: { read: false, write: false, delete: false },
  },
};

export default function RolesManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string>("admin");

  const currentPermissions = permissionMatrix[selectedRole] || {};

  const getRoleColor = (color: string) => {
    const colors = {
      red: "bg-red-500/20 text-red-400 border-red-500/30",
      green: "bg-green-500/20 text-green-400 border-green-500/30",
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Role & Permission Management"
        title="Quản lý phân quyền"
        description="Cấu hình quyền truy cập và phân quyền cho từng role trong hệ thống"
        icon="🔐"
        badges={["Access Control", "Security", "Role-Based"]}
        stats={[
          { label: "Roles", value: `${roles.length}`, helper: "Nhóm quyền" },
          { label: "Modules", value: `${modules.length}`, helper: "Chức năng hệ thống" },
          { label: "Total Users", value: `${roles.reduce((sum, r) => sum + r.users, 0)}`, helper: "Người dùng" }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/roles/new">
                <Plus className="h-4 w-4 mr-2" />
                Tạo role mới
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/security">
                <Lock className="h-4 w-4 mr-2" />
                Security Settings
              </Link>
            </Button>
          </>
        }
      />

      {/* Role Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card 
            key={role.id} 
            className={`bg-slate-900/50 border-slate-700/50 cursor-pointer transition-all hover:scale-105 ${
              selectedRole === role.slug ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedRole(role.slug)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Shield className={`h-6 w-6 ${
                  role.color === 'red' ? 'text-red-400' :
                  role.color === 'green' ? 'text-green-400' :
                  role.color === 'blue' ? 'text-blue-400' :
                  'text-purple-400'
                }`} />
                <Badge className={getRoleColor(role.color)}>
                  {role.users} users
                </Badge>
              </div>
              <CardTitle className="text-white text-lg">{role.name}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={selectedRole === role.slug ? "secondary" : "outline"} 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedRole(role.slug)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Xem quyền
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Permission Matrix */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-400" />
                Bảng phân quyền: <Badge className="ml-2">{roles.find(r => r.slug === selectedRole)?.name}</Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                Các quyền truy cập được cấp cho role này
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-4 px-4 text-left text-sm font-medium text-slate-400 w-1/3">
                    Module / Chức năng
                  </th>
                  <th className="pb-4 px-4 text-center text-sm font-medium text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      Read
                    </div>
                  </th>
                  <th className="pb-4 px-4 text-center text-sm font-medium text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Edit className="h-4 w-4 text-blue-400" />
                      Write
                    </div>
                  </th>
                  <th className="pb-4 px-4 text-center text-sm font-medium text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <X className="h-4 w-4 text-red-400" />
                      Delete
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const perms = currentPermissions[module.key] || { read: false, write: false, delete: false };
                  return (
                    <tr key={module.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-white font-medium">{module.name}</div>
                          <div className="text-xs text-slate-400">{module.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {perms.read ? (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                            <Check className="h-5 w-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                            <X className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {perms.write ? (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                            <Check className="h-5 w-5 text-blue-400" />
                          </div>
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                            <X className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {perms.delete ? (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                            <Check className="h-5 w-5 text-red-400" />
                          </div>
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                            <X className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-700 flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-slate-300">Có quyền truy cập</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                <X className="h-5 w-5 text-slate-600" />
              </div>
              <span className="text-slate-300">Không có quyền</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Read Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Object.values(currentPermissions).filter(p => p.read).length}
            </div>
            <p className="text-sm text-slate-400">/ {modules.length} modules</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-400" />
              Write Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Object.values(currentPermissions).filter(p => p.write).length}
            </div>
            <p className="text-sm text-slate-400">/ {modules.length} modules</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" />
              Delete Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Object.values(currentPermissions).filter(p => p.delete).length}
            </div>
            <p className="text-sm text-slate-400">/ {modules.length} modules</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
