"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Download,
  Video,
  MapPin,
} from "lucide-react";

export default function DoctorSchedulePage() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      time: "08:00 - 08:30",
      patient: "Nguyễn Văn An",
      age: 45,
      type: "Tái khám",
      reason: "Kiểm tra đường huyết",
      status: "confirmed",
      location: "Phòng khám 301",
      phone: "0901234567",
    },
    {
      id: 2,
      time: "08:30 - 09:00",
      patient: "Trần Thị Bình",
      age: 62,
      type: "Khám mới",
      reason: "Đau ngực, khó thở",
      status: "confirmed",
      location: "Phòng khám 301",
      phone: "0912345678",
    },
    {
      id: 3,
      time: "09:00 - 09:30",
      patient: "Lê Văn Công",
      age: 38,
      type: "Tư vấn online",
      reason: "Tư vấn kết quả xét nghiệm",
      status: "pending",
      location: "Video call",
      phone: "0923456789",
    },
    {
      id: 4,
      time: "09:30 - 10:00",
      patient: "Phạm Thị Dung",
      age: 55,
      type: "Khẩn cấp",
      reason: "Nhịp tim bất thường",
      status: "confirmed",
      location: "Phòng khám 301",
      phone: "0934567890",
    },
    {
      id: 5,
      time: "10:00 - 10:30",
      patient: "",
      type: "Nghỉ giữa giờ",
      reason: "",
      status: "break",
      location: "",
      phone: "",
    },
    {
      id: 6,
      time: "10:30 - 11:00",
      patient: "Hoàng Văn Em",
      age: 70,
      type: "Tái khám",
      reason: "Kiểm tra sau phẫu thuật",
      status: "confirmed",
      location: "Phòng khám 301",
      phone: "0945678901",
    },
    {
      id: 7,
      time: "11:00 - 11:30",
      patient: "",
      type: "Trống",
      reason: "",
      status: "available",
      location: "",
      phone: "",
    },
  ];

  const stats = [
    { label: "Tổng lịch hẹn", value: appointments.filter((a) => a.status !== "break" && a.status !== "available").length, color: "primary" },
    { label: "Đã xác nhận", value: appointments.filter((a) => a.status === "confirmed").length, color: "success" },
    { label: "Chờ xác nhận", value: appointments.filter((a) => a.status === "pending").length, color: "orange" },
    { label: "Slot trống", value: appointments.filter((a) => a.status === "available").length, color: "slate" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success-100 text-success-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-danger-100 text-danger-700";
      case "completed":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      case "break":
        return "Nghỉ giữa giờ";
      case "available":
        return "Có thể đặt";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Lịch khám của bác sĩ</h1>
          <p className="text-slate-600">
            Quản lý lịch hẹn và ca khám
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Xuất lịch
          </Button>
          <Button className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Đặt lịch mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar Controls */}
      <Card className="border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">
                  {selectedDate.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                Hôm nay
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
                className={viewMode === "day" ? "bg-primary-500 text-white" : ""}
              >
                Ngày
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "bg-primary-500 text-white" : ""}
              >
                Tuần
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
                className={viewMode === "month" ? "bg-primary-500 text-white" : ""}
              >
                Tháng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-xl text-slate-800">Lịch khám trong ngày</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 transition-colors ${
                  appointment.status === "break"
                    ? "bg-slate-50"
                    : appointment.status === "available"
                    ? "bg-slate-50/50 hover:bg-slate-100"
                    : "hover:bg-primary-50/30 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0 w-32">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {appointment.time}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  {appointment.status === "break" ? (
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-600">
                        ☕ {appointment.type}
                      </p>
                    </div>
                  ) : appointment.status === "available" ? (
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm text-slate-500 italic">Slot trống - Có thể đặt lịch</p>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Đặt lịch
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="font-semibold text-slate-800">
                            {appointment.patient}
                          </p>
                          <span className="text-xs text-slate-500">{appointment.age} tuổi</span>
                          <Badge
                            variant="outline"
                            className={
                              appointment.type === "Khẩn cấp"
                                ? "bg-danger-100 text-danger-700 border-danger-200"
                                : ""
                            }
                          >
                            {appointment.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{appointment.reason}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            {appointment.location.includes("Video") ? (
                              <Video className="w-3 h-3" />
                            ) : (
                              <MapPin className="w-3 h-3" />
                            )}
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{appointment.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>

                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" className="text-success-600 border-success-300">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Xác nhận
                              </Button>
                              <Button size="sm" variant="outline" className="text-danger-600 border-danger-300">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <>
                              {appointment.location.includes("Video") ? (
                                <Button size="sm" className="bg-blue-500 text-white">
                                  <Video className="w-4 h-4 mr-1" />
                                  Tham gia
                                </Button>
                              ) : (
                                <Button size="sm" className="bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                                  Bắt đầu khám
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Setting */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg text-slate-800">Cài đặt giờ làm việc</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Giờ làm việc tiêu chuẩn
              </label>
              <p className="text-sm text-slate-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
              <p className="text-sm text-slate-600">Thứ 7: 8:00 - 12:00</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Thời gian khám mỗi bệnh nhân
              </label>
              <p className="text-sm text-slate-600">30 phút / ca khám</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Chỉnh sửa lịch làm việc
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
