"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  User,
  Phone,
  MapPin,
  Clock,
  Eye,
  MessageSquare,
  FileText,
  Bell,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function CriticalMonitoringPage() {
  const [filterLevel, setFilterLevel] = useState<"all" | "critical" | "warning">("all");

  const criticalPatients = [
    {
      id: 1,
      patient: "Phạm Thị Dung",
      code: "BN001237",
      age: 55,
      room: "ICU-402",
      bed: "Giường 02",
      condition: "Nhồi máu cơ tim",
      level: "critical",
      alerts: [
        { type: "critical", metric: "Huyết áp", value: "180/110 mmHg", time: "10 phút trước" },
        { type: "critical", metric: "Nhịp tim", value: "105 bpm", time: "15 phút trước" },
        { type: "warning", metric: "SpO2", value: "92%", time: "20 phút trước" },
      ],
      vitals: {
        bloodPressure: "180/110",
        heartRate: 105,
        spo2: 92,
        temperature: 37.2,
      },
      phone: "0934567890",
      lastChecked: "2025-01-13 14:30",
      assignedNurse: "Y tá Nguyễn Thị D",
    },
    {
      id: 2,
      patient: "Trần Văn F",
      code: "BN001239",
      age: 68,
      room: "P-302",
      bed: "Giường 03",
      condition: "Suy tim độ III",
      level: "critical",
      alerts: [
        { type: "critical", metric: "Huyết áp", value: "175/105 mmHg", time: "25 phút trước" },
        { type: "warning", metric: "Nhịp thở", value: "24 /phút", time: "30 phút trước" },
      ],
      vitals: {
        bloodPressure: "175/105",
        heartRate: 95,
        spo2: 94,
        temperature: 36.8,
      },
      phone: "0945678901",
      lastChecked: "2025-01-13 14:15",
      assignedNurse: "Y tá Lê Thị E",
    },
    {
      id: 3,
      patient: "Nguyễn Thị G",
      code: "BN001240",
      age: 54,
      room: "P-205",
      bed: "Giường 01",
      condition: "Tiểu đường type 2 mất kiểm soát",
      level: "warning",
      alerts: [
        { type: "warning", metric: "Đường huyết", value: "280 mg/dL", time: "1 giờ trước" },
      ],
      vitals: {
        bloodPressure: "140/90",
        heartRate: 88,
        spo2: 96,
        temperature: 36.5,
      },
      phone: "0956789012",
      lastChecked: "2025-01-13 13:45",
      assignedNurse: "Y tá Phạm Văn F",
    },
    {
      id: 4,
      patient: "Lê Thị H",
      code: "BN001241",
      age: 72,
      room: "P-401",
      bed: "Giường 04",
      condition: "COPD, suy hô hấp",
      level: "critical",
      alerts: [
        { type: "critical", metric: "SpO2", value: "88%", time: "45 phút trước" },
        { type: "warning", metric: "Nhịp thở", value: "28 /phút", time: "50 phút trước" },
      ],
      vitals: {
        bloodPressure: "135/85",
        heartRate: 92,
        spo2: 88,
        temperature: 37.5,
      },
      phone: "0967890123",
      lastChecked: "2025-01-13 13:30",
      assignedNurse: "Y tá Hoàng Thị G",
    },
  ];

  const filteredPatients = criticalPatients.filter(
    (p) => filterLevel === "all" || p.level === filterLevel
  );

  const getLevelColor = (level: string) => {
    return level === "critical"
      ? "from-danger-500 to-red-500"
      : "from-orange-500 to-amber-500";
  };

  const getLevelBg = (level: string) => {
    return level === "critical"
      ? "from-danger-50 to-red-50 border-danger-200"
      : "from-orange-50 to-amber-50 border-orange-200";
  };

  const getAlertColor = (type: string) => {
    return type === "critical"
      ? "bg-danger-100 text-danger-700 border-danger-200"
      : "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-danger-500" />
            Theo dõi bệnh nhân nguy cơ cao
          </h1>
          <p className="text-slate-600">
            Giám sát và xử lý các ca bệnh cần chú ý đặc biệt
          </p>
        </div>
        <Button variant="outline" className="border-slate-300">
          <Bell className="w-4 h-4 mr-2" />
          Cài đặt cảnh báo
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-danger-50 to-red-50 border-danger-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Nguy kịch</p>
                <p className="text-3xl font-bold text-danger-700">
                  {criticalPatients.filter((p) => p.level === "critical").length}
                </p>
                <p className="text-xs text-slate-600 mt-1">Cần can thiệp ngay</p>
              </div>
              <div className="w-12 h-12 bg-danger-500 rounded-xl flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Cảnh báo</p>
                <p className="text-3xl font-bold text-orange-700">
                  {criticalPatients.filter((p) => p.level === "warning").length}
                </p>
                <p className="text-xs text-slate-600 mt-1">Cần theo dõi sát</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Tổng cảnh báo</p>
                <p className="text-3xl font-bold text-primary-700">
                  {criticalPatients.reduce((sum, p) => sum + p.alerts.length, 0)}
                </p>
                <p className="text-xs text-slate-600 mt-1">Trong 2 giờ qua</p>
              </div>
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterLevel === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel("all")}
              className={filterLevel === "all" ? "bg-primary-500 text-white" : ""}
            >
              Tất cả ({criticalPatients.length})
            </Button>
            <Button
              variant={filterLevel === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel("critical")}
              className={
                filterLevel === "critical"
                  ? "bg-danger-500 text-white hover:bg-danger-600"
                  : "border-danger-300 text-danger-600"
              }
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Nguy kịch ({criticalPatients.filter((p) => p.level === "critical").length})
            </Button>
            <Button
              variant={filterLevel === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel("warning")}
              className={
                filterLevel === "warning"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "border-orange-300 text-orange-600"
              }
            >
              Cảnh báo ({criticalPatients.filter((p) => p.level === "warning").length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Patients List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className={`bg-gradient-to-br ${getLevelBg(patient.level)} shadow-xl hover:shadow-2xl transition-all`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Patient Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar with Level Indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getLevelColor(patient.level)} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-xl`}>
                      {patient.patient.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                        patient.level === "critical"
                          ? "bg-danger-500 animate-pulse"
                          : "bg-orange-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Patient Name & Priority */}
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/doctor/patients/${patient.id}`}
                        className="text-xl font-bold text-slate-800 hover:text-primary-600 transition-colors"
                      >
                        {patient.patient}
                      </Link>
                      <Badge
                        className={
                          patient.level === "critical"
                            ? "bg-danger-100 text-danger-700 border-danger-300"
                            : "bg-orange-100 text-orange-700 border-orange-300"
                        }
                      >
                        {patient.level === "critical" ? "NGUY KỊCH" : "CẢNH BÁO"}
                      </Badge>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>{patient.code} • {patient.age} tuổi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{patient.room} - {patient.bed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Kiểm tra: {patient.lastChecked}</span>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="p-3 bg-white/70 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Chẩn đoán</p>
                      <p className="text-sm font-semibold text-slate-800">{patient.condition}</p>
                    </div>

                    {/* Current Vitals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="p-2 bg-white/70 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Heart className="w-3 h-3 text-danger-500" />
                          <span className="text-xs text-slate-600">Huyết áp</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {patient.vitals.bloodPressure}
                        </p>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-3 h-3 text-primary-500" />
                          <span className="text-xs text-slate-600">Nhịp tim</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {patient.vitals.heartRate} bpm
                        </p>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-3 h-3 text-teal-500" />
                          <span className="text-xs text-slate-600">SpO2</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {patient.vitals.spo2}%
                        </p>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-slate-600">Nhiệt độ</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {patient.vitals.temperature}°C
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Alerts & Actions */}
                <div className="lg:w-80 space-y-4">
                  {/* Recent Alerts */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Cảnh báo gần đây ({patient.alerts.length})
                    </p>
                    <div className="space-y-2">
                      {patient.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border ${getAlertColor(alert.type)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs font-semibold mb-1">{alert.metric}</p>
                              <p className="text-sm font-bold">{alert.value}</p>
                            </div>
                            {alert.type === "critical" && (
                              <AlertTriangle className="w-4 h-4 text-danger-600 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{alert.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Nurse */}
                  <div className="p-2 bg-white/70 rounded-lg">
                    <p className="text-xs text-slate-600">Điều dưỡng phụ trách</p>
                    <p className="text-sm font-semibold text-slate-800">{patient.assignedNurse}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Link href={`/doctor/patients/${patient.id}`} className="block">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hồ sơ chi tiết
                      </Button>
                    </Link>
                    <Link href={`/doctor/consultation/${patient.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Khám & điều trị
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Gọi y tá
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-success-600 border-success-300"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đánh dấu đã xử lý
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Tất cả bệnh nhân đều ổn định
            </h3>
            <p className="text-slate-600">Không có bệnh nhân nào cần theo dõi đặc biệt</p>
          </CardContent>
        </Card>
      )}

      {/* Emergency Protocol Card */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-none shadow-2xl text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-danger-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Quy trình khẩn cấp</h3>
                <p className="text-slate-300 text-sm">
                  Kích hoạt code blue hoặc gọi đội cấp cứu ngay lập tức
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-danger-500 hover:bg-danger-600 text-white">
                <Bell className="w-4 h-4 mr-2" />
                Code Blue
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                Gọi cấp cứu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
