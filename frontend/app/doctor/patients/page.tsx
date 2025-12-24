"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  User,
  ChevronRight,
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Eye,
  MessageSquare,
  FileText,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  Tag,
} from "lucide-react";

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // TODO: Fetch data from API - GET /api/doctors/:doctorId/patients
  // See BACKEND_API_PLAN.md for API specifications
  const patients: Array<any> = [];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || patient.priority === priorityFilter;
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesGender;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-success-100 text-success-700 border-success-200";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "critical":
        return "bg-danger-100 text-danger-700 border-danger-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "stable":
        return "Ổn định";
      case "warning":
        return "Cảnh báo";
      case "critical":
        return "Nguy kịch";
      default:
        return "Chưa xác định";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-danger-600";
      case "high":
        return "text-orange-600";
      case "normal":
        return "text-slate-600";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Danh sách bệnh nhân</h1>
          <p className="text-slate-600">
            Quản lý và theo dõi {patients.length} bệnh nhân
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white">
            <User className="w-4 h-4 mr-2" />
            Thêm bệnh nhân
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success-50 to-emerald-50 border-success-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Ổn định</p>
                <p className="text-2xl font-bold text-success-700">
                  {patients.filter((p) => p.status === "stable").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Cảnh báo</p>
                <p className="text-2xl font-bold text-orange-700">
                  {patients.filter((p) => p.status === "warning").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-danger-50 to-red-50 border-danger-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Nguy kịch</p>
                <p className="text-2xl font-bold text-danger-700">
                  {patients.filter((p) => p.status === "critical").length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-danger-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Lịch hẹn hôm nay</p>
                <p className="text-2xl font-bold text-primary-700">8</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo tên, mã bệnh nhân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 border-slate-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="stable">Ổn định</option>
                <option value="warning">Cảnh báo</option>
                <option value="critical">Nguy kịch</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              >
                <option value="all">Tất cả độ ưu tiên</option>
                <option value="critical">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="normal">Bình thường</option>
              </select>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              >
                <option value="all">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <Button variant="outline" size="sm" className="border-slate-300">
                <Filter className="w-4 h-4 mr-2" />
                Thêm bộ lọc
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || genderFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Đang lọc:</span>
              {searchQuery && (
                <Badge variant="outline" className="text-sm">
                  Tìm kiếm: {searchQuery}
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="outline" className="text-sm">
                  Trạng thái: {getStatusLabel(statusFilter)}
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="outline" className="text-sm">
                  Ưu tiên: {priorityFilter}
                </Badge>
              )}
              {genderFilter !== "all" && (
                <Badge variant="outline" className="text-sm">
                  Giới tính: {genderFilter}
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setGenderFilter("all");
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Patient Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        patient.status === "stable"
                          ? "bg-success-500"
                          : patient.status === "warning"
                          ? "bg-orange-500"
                          : "bg-danger-500 animate-pulse"
                      }`}
                    ></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div>
                        <Link
                          href={`/doctor/patients/${patient.id}`}
                          className="text-lg font-bold text-slate-800 hover:text-primary-600 transition-colors"
                        >
                          {patient.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-600">{patient.code}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">
                            {patient.age} tuổi - {patient.gender}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{patient.bloodType}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 font-medium mb-3">{patient.condition}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getStatusColor(patient.status)}>
                        {getStatusLabel(patient.status)}
                      </Badge>
                      {patient.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Contact & Room */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{patient.room}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Khám lần cuối: {patient.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Vitals */}
                <div className="lg:border-l lg:border-slate-200 lg:pl-6">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Chỉ số sinh tồn</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-danger-500" />
                        <span className="text-xs text-slate-600">Huyết áp</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {patient.vitals.bloodPressure}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-primary-500" />
                        <span className="text-xs text-slate-600">Nhịp tim</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{patient.vitals.heartRate} bpm</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-slate-600">Glucose</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{patient.vitals.glucose} mg/dL</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-teal-500" />
                        <span className="text-xs text-slate-600">SpO2</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{patient.vitals.spo2}%</p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col gap-2 lg:w-48">
                  <Link href={`/doctor/patients/${patient.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem hồ sơ
                    </Button>
                  </Link>

                  <Link href={`/doctor/consultation/${patient.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Khám bệnh
                    </Button>
                  </Link>

                  <Button variant="ghost" size="sm" className="lg:mt-auto">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nhắn tin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredPatients.length > 0 && (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Hiển thị {filteredPatients.length} / {patients.length} bệnh nhân
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="bg-primary-500 text-white border-primary-500">
                  1
                </Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Không tìm thấy bệnh nhân
            </h3>
            <p className="text-slate-600 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm khác
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setGenderFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
