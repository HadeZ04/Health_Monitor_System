"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

export default function MedicalHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const medicalRecords = [
    {
      id: 1,
      date: "2025-01-05",
      doctor: "BS. Trần Thị B",
      specialty: "Tim mạch",
      diagnosis: "Cao huyết áp nhẹ",
      symptoms: "Đau đầu, chóng mặt nhẹ",
      treatment: "Điều chỉnh thuốc huyết áp, tái khám sau 1 tháng",
      prescriptions: ["Amlodipine 5mg", "Losartan 50mg"],
      notes: "Bệnh nhân cần theo dõi huyết áp hàng ngày. Hạn chế muối trong chế độ ăn.",
      attachments: ["Kết quả điện tim.pdf", "Siêu âm tim.pdf"],
    },
    {
      id: 2,
      date: "2024-12-20",
      doctor: "BS. Lê Văn C",
      specialty: "Nội tiết",
      diagnosis: "Đái tháo đường type 2",
      symptoms: "Đường huyết cao, mệt mỏi",
      treatment: "Điều chỉnh insulin, chế độ ăn kiêng",
      prescriptions: ["Metformin 850mg", "Insulin Glargine"],
      notes: "HbA1c = 7.8%. Cần theo dõi đường huyết 4 lần/ngày.",
      attachments: ["Xét nghiệm đường huyết.pdf"],
    },
    {
      id: 3,
      date: "2024-11-10",
      doctor: "BS. Nguyễn Văn D",
      specialty: "Nội khoa tổng quát",
      diagnosis: "Viêm dạ dày - Helicobacter pylori (+)",
      symptoms: "Đau thượng vị, ợ nóng, đầy hơi",
      treatment: "Thuốc kháng sinh diệt HP, thuốc bảo vệ niêm mạc",
      prescriptions: ["Omeprazole 40mg", "Clarithromycin 500mg", "Amoxicillin 1g"],
      notes: "Điều trị trong 14 ngày. Tái khám kiểm tra sau 4 tuần.",
      attachments: ["Nội soi dạ dày.pdf", "Xét nghiệm HP.pdf"],
    },
    {
      id: 4,
      date: "2024-09-15",
      doctor: "BS. Phạm Thị E",
      specialty: "Da liễu",
      diagnosis: "Viêm da cơ địa",
      symptoms: "Ngứa, da khô, mẩn đỏ",
      treatment: "Kem bôi corticoid, thuốc kháng histamine",
      prescriptions: ["Betamethasone cream", "Cetirizine 10mg"],
      notes: "Tránh tiếp xúc với chất gây dị ứng. Dùng kem dưỡng ẩm thường xuyên.",
      attachments: [],
    },
  ];

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      selectedYear === "all" || record.date.startsWith(selectedYear);

    return matchesSearch && matchesYear;
  });

  const years = ["all", "2025", "2024", "2023"];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lịch sử khám bệnh</h1>
        <p className="text-slate-600 mt-1">
          Xem lại các lần khám và điều trị trước đây
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo chẩn đoán, bác sĩ, chuyên khoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900"
              >
                <option value="all">Tất cả năm</option>
                {years.slice(1).map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {medicalRecords.length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Tổng số lần khám</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600">4</div>
              <div className="text-sm text-slate-600 mt-1">Chuyên khoa</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-info-600">8</div>
              <div className="text-sm text-slate-600 mt-1">Đơn thuốc</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-600">5</div>
              <div className="text-sm text-slate-600 mt-1">File đính kèm</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{record.diagnosis}</CardTitle>
                        <Badge variant="outline">{record.specialty}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {record.doctor}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/patient/history/${record.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Symptoms */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      Triệu chứng:
                    </h4>
                    <p className="text-sm text-slate-600">{record.symptoms}</p>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      Phương pháp điều trị:
                    </h4>
                    <p className="text-sm text-slate-600">{record.treatment}</p>
                  </div>

                  {/* Prescriptions */}
                  {record.prescriptions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Đơn thuốc:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.prescriptions.map((med, index) => (
                          <Badge key={index} variant="secondary">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {record.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        File đính kèm:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.attachments.map((file, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Paperclip className="w-3 h-3 mr-1" />
                            {file}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor's Notes */}
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      Ghi chú của bác sĩ:
                    </h4>
                    <p className="text-sm text-slate-600 italic">{record.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-slate-600">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline View Toggle */}
      <Card className="bg-gradient-to-br from-info-50 to-primary-50 border-info-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Xem theo dòng thời gian
              </h3>
              <p className="text-sm text-slate-600">
                Trực quan hóa hành trình sức khỏe của bạn
              </p>
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Chuyển sang Timeline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
