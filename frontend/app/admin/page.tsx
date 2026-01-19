"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Shield
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// TODO: Fetch data from API - GET /api/admin/dashboard
// See BACKEND_API_PLAN.md for API specifications

const kpiData = {
  totalPatients: 0,
  patientsChange: "+0%",
  totalDoctors: 0,
  doctorsChange: "+0",
  totalAppointments: 0,
  appointmentsChange: "+0%",
  activeUsers: 0,
  activeChange: "+0%",
  criticalAlerts: 0,
  systemHealth: 0,
};

const loginData: Array<any> = [];
const appointmentData: Array<any> = [];
const userDistribution: Array<any> = [];
const recentActivities: Array<any> = [];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin Control Center"
        title="System Overview Dashboard"
        description="Monitor system health, user activity, and manage all aspects of the healthcare platform."
        icon="🎯"
        badges={["Admin", "System Status", "Real-time"]}
        stats={[
          { label: "System Health", value: `${kpiData.systemHealth}%`, helper: "All services operational" },
          { label: "Active Now", value: `${kpiData.activeUsers}`, helper: "Users online" },
          { label: "Alerts", value: `${kpiData.criticalAlerts}`, helper: "Requires attention", trend: "warning" }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/settings">System Settings</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/logs">View Logs</Link>
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/70 to-blue-900/30 border-blue-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Tổng số Bệnh nhân</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpiData.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-blue-300 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-green-400">{kpiData.patientsChange}</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/70 to-green-900/30 border-green-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Tổng số Bác sĩ</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpiData.totalDoctors}</div>
            <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-green-400">{kpiData.doctorsChange}</span> bác sĩ mới tuần này
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/70 to-purple-900/30 border-purple-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Lịch khám hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpiData.totalAppointments}</div>
            <p className="text-xs text-purple-300 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-green-400">{kpiData.appointmentsChange}</span> so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/70 to-orange-900/30 border-orange-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpiData.criticalAlerts}</div>
            <p className="text-xs text-orange-300 flex items-center gap-1 mt-1">
              <Shield className="h-3 w-3" />
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Login Activity Chart */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Lượt đăng nhập trong ngày</CardTitle>
            <CardDescription>Phân bố theo giờ trong ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Chart */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Lịch khám tuần này</CardTitle>
            <CardDescription>Số lượng lịch khám được tạo mỗi ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution & Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* User Distribution Pie Chart */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Phân bố người dùng</CardTitle>
            <CardDescription>Tổng: {userDistribution.reduce((a, b) => a + b.value, 0)} users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Hoạt động gần đây
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/logs">Xem tất cả</Link>
              </Button>
            </CardTitle>
            <CardDescription>Các hoạt động quan trọng trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${
                    activity.type === 'create' ? 'bg-green-500' :
                    activity.type === 'update' ? 'bg-blue-500' :
                    activity.type === 'register' ? 'bg-purple-500' :
                    activity.type === 'schedule' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-white font-medium">{activity.user}</p>
                    <p className="text-sm text-slate-400">{activity.action}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-900/30 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription>Các thao tác quản trị thường dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/users/new">
                <Users className="h-5 w-5" />
                <span>Thêm người dùng mới</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/doctors">
                <UserCheck className="h-5 w-5" />
                <span>Quản lý bác sĩ</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/settings">
                <Activity className="h-5 w-5" />
                <span>Cấu hình hệ thống</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/logs">
                <Shield className="h-5 w-5" />
                <span>Xem audit logs</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
