"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Heart,
  Activity,
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  User,
  ChevronRight,
  CheckCircle,
  Bell,
  MessageCircle,
} from "lucide-react";

export default function PatientDashboardPage() {
  // TODO: Fetch data from API - GET /api/patients/dashboard/:patientId
  // See BACKEND_API_PLAN.md for API specifications
  const patientProfile = {
    name: "",
    age: 0,
    gender: "",
    bloodType: "",
    avatar: "",
  };

  const latestVitals: Array<{
    label: string;
    value: string;
    unit: string;
    status: string;
    icon: any;
    color: string;
    bgColor: string;
  }> = [];

  const upcomingAppointments: Array<{
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
  }> = [];

  const medications: Array<{
    id: number;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }> = [];

  const notifications: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    unread: boolean;
  }> = [];

  const healthScore = 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header với thông tin bệnh nhân */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Xin chào, {patientProfile.name}!
              </h1>
              <p className="text-primary-100 text-sm">
                {patientProfile.age} tuổi · {patientProfile.gender} · Nhóm máu {patientProfile.bloodType}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{healthScore}</div>
            <div className="text-sm text-primary-100">Điểm sức khỏe</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/patient/appointments/book">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary-300">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-3">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Đặt lịch khám</h3>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patient/medications">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-secondary-300">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 mb-3">
                <Pill className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Đơn thuốc</h3>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patient/lab-results">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-info-300">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-info-100 mb-3">
                <FileText className="w-6 h-6 text-info-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Kết quả XN</h3>
            </CardContent>
          </Card>
        </Link>

        <Link href="/patient/chat">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-warning-300">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning-100 mb-3">
                <MessageCircle className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Chat BS</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chỉ số sức khỏe gần nhất */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-600" />
                    Chỉ số sức khỏe hiện tại
                  </CardTitle>
                  <CardDescription>Cập nhật 30 phút trước</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patient/metrics">
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {latestVitals.map((vital) => (
                  <div
                    key={vital.label}
                    className={`${vital.bgColor} rounded-lg p-4 text-center`}
                  >
                    <vital.icon className={`w-6 h-6 ${vital.color} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${vital.color}`}>
                      {vital.value}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{vital.unit}</div>
                    <div className="text-xs font-medium text-slate-700 mt-1">
                      {vital.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Trend Chart Placeholder */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-700">Xu hướng 7 ngày</h4>
                  <TrendingUp className="w-4 h-4 text-success-600" />
                </div>
                <div className="h-32 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400">
                  Biểu đồ xu hướng (Chart sẽ được thêm vào)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lịch khám sắp tới */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Lịch khám sắp tới
                  </CardTitle>
                  <CardDescription>
                    Bạn có {upcomingAppointments.length} lịch khám
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patient/appointments">
                    Xem tất cả
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {appointment.doctor}
                        </h4>
                        <p className="text-sm text-slate-600">{appointment.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600">
                            {appointment.date} · {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={appointment.status === "confirmed" ? "default" : "secondary"}
                    >
                      {appointment.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                    </Badge>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có lịch khám nào</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/patient/appointments/book">Đặt lịch khám</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Nhắc uống thuốc trong ngày */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-secondary-600" />
                    Nhắc uống thuốc hôm nay
                  </CardTitle>
                  <CardDescription>
                    {medications.filter(m => !m.taken).length} liều cần uống
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/patient/medications">
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      med.taken ? "bg-success-50" : "bg-warning-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {med.taken ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning-600" />
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-900">{med.name}</h4>
                        <p className="text-sm text-slate-600">{med.dosage}</p>
                        <p className="text-xs text-slate-500 mt-1">{med.time}</p>
                      </div>
                    </div>
                    {!med.taken && (
                      <Button size="sm" variant="outline">
                        Đánh dấu đã uống
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Thông báo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
                Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.unread
                        ? "bg-primary-50 border-primary-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-sm text-slate-900 mb-1">{notif.message}</p>
                    <p className="text-xs text-slate-500">{notif.time}</p>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/patient/notifications">Xem tất cả thông báo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hồ sơ sức khỏe */}
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ sức khỏe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/patient/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Thông tin cá nhân
                </Button>
              </Link>
              <Link href="/patient/history">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Lịch sử khám bệnh
                </Button>
              </Link>
              <Link href="/patient/metrics">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Theo dõi chỉ số
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tip sức khỏe */}
          <Card className="bg-gradient-to-br from-info-50 to-primary-50 border-info-200">
            <CardHeader>
              <CardTitle className="text-info-900">💡 Lời khuyên hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-info-800">
                Hãy duy trì uống đủ 8 ly nước mỗi ngày để giữ cơ thể luôn khỏe mạnh. 
                Nước giúp cải thiện tuần hoàn máu và chức năng các cơ quan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
