"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Bell,
  ArrowRight,
  User,
  Stethoscope,
  FlaskConical,
  MessageSquare,
  ChevronRight,
  BarChart3,
  ClipboardList,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: Fetch data from API - GET /api/doctors/dashboard/:doctorId
  // See BACKEND_API_PLAN.md for API specifications
  const stats: Array<any> = [];
  const todaySchedule: Array<any> = [];
  const criticalAlerts: Array<any> = [];
  const recentActivities: Array<any> = [];
  const weeklyStats: { consultations: number[]; labels: string[] } = {
    consultations: [],
    labels: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Chào buổi sáng, BS. Trần Thị Minh Châu 👋
          </h1>
          <p className="text-slate-600">
            Hôm nay là {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300">
            <BarChart3 className="w-4 h-4 mr-2" />
            Báo cáo
          </Button>
          <Button className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Xem lịch đầy đủ
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.changeType === "increase" && (
                    <TrendingUp className="w-4 h-4 text-success-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.subtext}</p>
                  <p className={`text-xs font-medium mt-2 ${
                    stat.changeType === "increase" ? "text-success-600" :
                    stat.changeType === "warning" ? "text-orange-600" :
                    "text-blue-600"
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200 shadow-lg h-full">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-800">Lịch khám hôm nay</CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    {todaySchedule.filter(s => s.status === "waiting").length} ca chờ khám
                  </CardDescription>
                </div>
                <Link href="/doctor/schedule">
                  <Button variant="ghost" size="sm">
                    Xem tất cả
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {todaySchedule.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      appointment.status === "in-progress" ? "bg-primary-50/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Time */}
                      <div className="flex-shrink-0 w-24">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">
                            {appointment.time.split(" - ")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {appointment.status === "completed" && (
                          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        )}
                        {appointment.status === "in-progress" && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                        )}
                        {appointment.status === "waiting" && (
                          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        )}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-800 truncate">
                            {appointment.patient}
                          </p>
                          <span className="text-xs text-slate-500">{appointment.age} tuổi</span>
                          {appointment.priority === "critical" && (
                            <Badge className="bg-danger-100 text-danger-700 text-xs">
                              Khẩn cấp
                            </Badge>
                          )}
                          {appointment.priority === "high" && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              Ưu tiên
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate">{appointment.reason}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        {appointment.status === "waiting" && (
                          <Link href={`/doctor/consultation/${appointment.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-primary-500 to-teal-500">
                              Bắt đầu khám
                            </Button>
                          </Link>
                        )}
                        {appointment.status === "in-progress" && (
                          <Link href={`/doctor/consultation/${appointment.id}`}>
                            <Button size="sm" variant="outline" className="border-primary-500 text-primary-600">
                              Tiếp tục
                            </Button>
                          </Link>
                        )}
                        {appointment.status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-success-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Critical Alerts */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                <CardTitle className="text-lg text-slate-800">Cảnh báo quan trọng</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        alert.severity === "critical" ? "bg-danger-500 animate-pulse" : "bg-orange-500"
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm mb-1">
                          {alert.patient}, {alert.age} tuổi
                        </p>
                        <p className="text-sm text-slate-700 mb-1">{alert.issue}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{alert.room}</span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100">
                <Link href="/doctor/critical">
                  <Button variant="ghost" size="sm" className="w-full">
                    Xem tất cả cảnh báo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-600">{activity.patient}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card className="bg-gradient-to-br from-primary-50 to-teal-50 border-primary-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Hiệu suất tuần này</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-2 h-32">
                  {weeklyStats.consultations.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-teal-500 rounded-t-lg transition-all hover:from-primary-600 hover:to-teal-600"
                        style={{ height: `${(value / 15) * 100}%` }}
                      ></div>
                      <span className="text-xs text-slate-600 font-medium">
                        {weeklyStats.labels[index]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Trung bình/ngày</span>
                    <span className="font-bold text-primary-600">
                      {Math.round(weeklyStats.consultations.reduce((a, b) => a + b, 0) / 7)} ca
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-none shadow-2xl text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Cần hỗ trợ khẩn cấp?</h3>
              <p className="text-slate-300 text-sm">
                Liên hệ với đội ngũ y tá hoặc yêu cầu hỗ trợ kỹ thuật
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                <Bell className="w-4 h-4 mr-2" />
                Gọi y tá
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-slate-100">
                <MessageSquare className="w-4 h-4 mr-2" />
                IT Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
