"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Bell,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  const currentMedications = [
    {
      id: 1,
      name: "Aspirin 100mg",
      genericName: "Acetylsalicylic acid",
      dosage: "1 viên",
      frequency: "1 lần/ngày",
      times: ["08:00"],
      duration: "Dài hạn",
      prescribedBy: "BS. Trần Thị B",
      prescriptionDate: "2024-12-01",
      startDate: "2024-12-01",
      endDate: null,
      instructions: "Uống sau ăn sáng. Không uống khi đói.",
      purpose: "Phòng ngừa đông máu",
      sideEffects: "Có thể gây khó tiêu, chảy máu cam",
      todayTaken: true,
    },
    {
      id: 2,
      name: "Metformin 500mg",
      genericName: "Metformin hydrochloride",
      dosage: "1 viên",
      frequency: "2 lần/ngày",
      times: ["08:00", "20:00"],
      duration: "Dài hạn",
      prescribedBy: "BS. Lê Văn C",
      prescriptionDate: "2024-11-15",
      startDate: "2024-11-15",
      endDate: null,
      instructions: "Uống trong bữa ăn. Uống nhiều nước.",
      purpose: "Kiểm soát đường huyết",
      sideEffects: "Buồn nôn, tiêu chảy (thường giảm sau 1-2 tuần)",
      todayTaken: true,
    },
    {
      id: 3,
      name: "Amlodipine 5mg",
      genericName: "Amlodipine besylate",
      dosage: "1 viên",
      frequency: "1 lần/ngày",
      times: ["20:00"],
      duration: "Dài hạn",
      prescribedBy: "BS. Trần Thị B",
      prescriptionDate: "2025-01-05",
      startDate: "2025-01-05",
      endDate: null,
      instructions: "Uống cùng giờ mỗi ngày. Có thể uống trước hoặc sau ăn.",
      purpose: "Kiểm soát huyết áp",
      sideEffects: "Chóng mặt, phù chân",
      todayTaken: false,
    },
  ];

  const medicationHistory = [
    {
      id: 4,
      name: "Omeprazole 40mg",
      genericName: "Omeprazole",
      prescribedBy: "BS. Nguyễn Văn D",
      prescriptionDate: "2024-11-10",
      startDate: "2024-11-10",
      endDate: "2024-12-08",
      duration: "28 ngày",
      status: "completed",
    },
    {
      id: 5,
      name: "Clarithromycin 500mg",
      genericName: "Clarithromycin",
      prescribedBy: "BS. Nguyễn Văn D",
      prescriptionDate: "2024-11-10",
      startDate: "2024-11-10",
      endDate: "2024-11-24",
      duration: "14 ngày",
      status: "completed",
    },
  ];

  const todaySchedule = [
    {
      id: 1,
      name: "Aspirin 100mg",
      time: "08:00",
      dosage: "1 viên",
      taken: true,
      takenAt: "08:15",
    },
    {
      id: 2,
      name: "Metformin 500mg",
      time: "08:00",
      dosage: "1 viên",
      taken: true,
      takenAt: "08:15",
    },
    {
      id: 3,
      name: "Amlodipine 5mg",
      time: "20:00",
      dosage: "1 viên",
      taken: false,
      takenAt: null,
    },
    {
      id: 4,
      name: "Metformin 500mg",
      time: "20:00",
      dosage: "1 viên",
      taken: false,
      takenAt: null,
    },
  ];

  const handleMarkAsTaken = (medicationId: number) => {
    // API call to mark medication as taken
    console.log(`Marked medication ${medicationId} as taken`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Đơn thuốc & Nhắc nhở</h1>
          <p className="text-slate-600 mt-1">
            Quản lý thuốc và lịch uống thuốc của bạn
          </p>
        </div>
        <Button>
          <Bell className="w-4 h-4 mr-2" />
          Cài đặt nhắc nhở
        </Button>
      </div>

      {/* Today's Medication Schedule */}
      <Card className="border-2 border-primary-300 bg-primary-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Lịch uống thuốc hôm nay
              </CardTitle>
              <CardDescription>
                {todaySchedule.filter((s) => !s.taken).length} liều chưa uống
              </CardDescription>
            </div>
            <Badge variant="default">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySchedule.map((schedule) => (
              <div
                key={`${schedule.id}-${schedule.time}`}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  schedule.taken
                    ? "bg-success-100 border border-success-300"
                    : "bg-white border border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      schedule.taken ? "bg-success-200" : "bg-warning-100"
                    }`}
                  >
                    {schedule.taken ? (
                      <CheckCircle className="w-6 h-6 text-success-700" />
                    ) : (
                      <Clock className="w-6 h-6 text-warning-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{schedule.name}</h4>
                    <p className="text-sm text-slate-600">
                      {schedule.time} • {schedule.dosage}
                    </p>
                    {schedule.taken && (
                      <p className="text-xs text-success-700 mt-1">
                        ✓ Đã uống lúc {schedule.takenAt}
                      </p>
                    )}
                  </div>
                </div>
                {!schedule.taken && (
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsTaken(schedule.id)}
                  >
                    Đánh dấu đã uống
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary-600">
              {currentMedications.length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Thuốc đang dùng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-success-600">
              {todaySchedule.filter((s) => s.taken).length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Đã uống hôm nay</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-warning-600">
              {todaySchedule.filter((s) => !s.taken).length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Chưa uống</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-info-600">95%</div>
            <div className="text-sm text-slate-600 mt-1">Tuân thủ điều trị</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "current"
              ? "border-primary-600 text-primary-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Đang dùng ({currentMedications.length})
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-primary-600 text-primary-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Lịch sử ({medicationHistory.length})
        </button>
      </div>

      {/* Current Medications */}
      {activeTab === "current" && (
        <div className="space-y-4">
          {currentMedications.map((med) => (
            <Card key={med.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary-400 to-primary-400 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{med.name}</CardTitle>
                      <p className="text-sm text-slate-600 mb-2">{med.genericName}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {med.dosage} • {med.frequency}
                        </Badge>
                        <Badge variant={med.todayTaken ? "default" : "secondary"}>
                          {med.todayTaken ? "✓ Đã uống hôm nay" : "Chưa uống"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Link href={`/patient/medications/${med.id}`}>
                    <Button variant="ghost" size="sm">
                      Chi tiết
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Giờ uống:
                      </h4>
                      <div className="flex gap-2">
                        {med.times.map((time) => (
                          <Badge key={time} variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Bác sĩ kê đơn:
                      </h4>
                      <p className="text-sm text-slate-600">{med.prescribedBy}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      Mục đích sử dụng:
                    </h4>
                    <p className="text-sm text-slate-600">{med.purpose}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      Hướng dẫn sử dụng:
                    </h4>
                    <p className="text-sm text-slate-600">{med.instructions}</p>
                  </div>

                  <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-warning-900 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Tác dụng phụ:
                    </h4>
                    <p className="text-sm text-warning-800">{med.sideEffects}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-slate-600">
                      Bắt đầu: {new Date(med.startDate).toLocaleDateString("vi-VN")}
                      {med.endDate &&
                        ` • Kết thúc: ${new Date(med.endDate).toLocaleDateString("vi-VN")}`}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Xem đơn
                      </Button>
                      {!med.todayTaken && (
                        <Button size="sm" onClick={() => handleMarkAsTaken(med.id)}>
                          Đánh dấu đã uống
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Medication History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {medicationHistory.map((med) => (
            <Card key={med.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{med.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{med.genericName}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {med.prescribedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(med.startDate).toLocaleDateString("vi-VN")} -{" "}
                          {new Date(med.endDate).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hoàn thành
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-br from-info-50 to-primary-50 border-info-200">
        <CardHeader>
          <CardTitle>💊 Mẹo uống thuốc đúng cách</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-700">
            ✓ Uống thuốc đúng giờ mỗi ngày để đạt hiệu quả tối đa
          </p>
          <p className="text-sm text-slate-700">
            ✓ Không tự ý ngừng thuốc khi thấy khỏe, cần tham khảo bác sĩ
          </p>
          <p className="text-sm text-slate-700">
            ✓ Bảo quản thuốc ở nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp
          </p>
          <p className="text-sm text-slate-700">
            ✓ Kiểm tra hạn sử dụng trước khi uống
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
