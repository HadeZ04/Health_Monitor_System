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
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function LabResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const labResults = [
    {
      id: 1,
      type: "Xét nghiệm máu tổng quát",
      date: "2025-01-05",
      orderedBy: "BS. Trần Thị B",
      status: "completed",
      facility: "Phòng xét nghiệm BV Chợ Rẫy",
      results: [
        {
          parameter: "Hồng cầu (RBC)",
          value: "4.8",
          unit: "triệu/µL",
          normalRange: "4.5-5.5",
          status: "normal",
        },
        {
          parameter: "Bạch cầu (WBC)",
          value: "7.2",
          unit: "nghìn/µL",
          normalRange: "4.0-10.0",
          status: "normal",
        },
        {
          parameter: "Tiểu cầu",
          value: "245",
          unit: "nghìn/µL",
          normalRange: "150-400",
          status: "normal",
        },
        {
          parameter: "Hemoglobin",
          value: "14.2",
          unit: "g/dL",
          normalRange: "13.5-17.5",
          status: "normal",
        },
      ],
      summary: "Các chỉ số trong giới hạn bình thường",
      doctorNote: "Tiếp tục theo dõi. Tái khám sau 3 tháng.",
      hasFile: true,
    },
    {
      id: 2,
      type: "Xét nghiệm đường huyết",
      date: "2025-01-03",
      orderedBy: "BS. Lê Văn C",
      status: "completed",
      facility: "Phòng xét nghiệm BV Thống Nhất",
      results: [
        {
          parameter: "Glucose lúc đói",
          value: "105",
          unit: "mg/dL",
          normalRange: "70-100",
          status: "warning",
        },
        {
          parameter: "HbA1c",
          value: "6.8",
          unit: "%",
          normalRange: "< 5.7",
          status: "warning",
        },
      ],
      summary: "Đường huyết cao hơn bình thường, cần theo dõi",
      doctorNote: "Điều chỉnh liều insulin. Kiểm soát chế độ ăn uống.",
      hasFile: true,
    },
    {
      id: 3,
      type: "Xét nghiệm chức năng gan",
      date: "2024-12-28",
      orderedBy: "BS. Nguyễn Văn D",
      status: "completed",
      facility: "Phòng xét nghiệm BV Chợ Rẫy",
      results: [
        {
          parameter: "ALT (SGPT)",
          value: "32",
          unit: "U/L",
          normalRange: "< 40",
          status: "normal",
        },
        {
          parameter: "AST (SGOT)",
          value: "28",
          unit: "U/L",
          normalRange: "< 40",
          status: "normal",
        },
        {
          parameter: "Bilirubin tổng",
          value: "0.9",
          unit: "mg/dL",
          normalRange: "0.3-1.2",
          status: "normal",
        },
      ],
      summary: "Chức năng gan bình thường",
      doctorNote: "Không có vấn đề. Tiếp tục theo dõi định kỳ.",
      hasFile: true,
    },
    {
      id: 4,
      type: "Xét nghiệm lipid máu",
      date: "2024-12-20",
      orderedBy: "BS. Trần Thị B",
      status: "completed",
      facility: "Phòng xét nghiệm BV Chợ Rẫy",
      results: [
        {
          parameter: "Cholesterol toàn phần",
          value: "210",
          unit: "mg/dL",
          normalRange: "< 200",
          status: "warning",
        },
        {
          parameter: "HDL",
          value: "45",
          unit: "mg/dL",
          normalRange: "> 40",
          status: "normal",
        },
        {
          parameter: "LDL",
          value: "135",
          unit: "mg/dL",
          normalRange: "< 130",
          status: "warning",
        },
        {
          parameter: "Triglyceride",
          value: "150",
          unit: "mg/dL",
          normalRange: "< 150",
          status: "normal",
        },
      ],
      summary: "Cholesterol và LDL cao hơn bình thường",
      doctorNote: "Hạn chế chất béo bão hòa. Tăng cường vận động. Tái khám sau 2 tháng.",
      hasFile: true,
    },
    {
      id: 5,
      type: "Xét nghiệm nước tiểu",
      date: "2024-12-15",
      orderedBy: "BS. Lê Văn C",
      status: "pending",
      facility: "Phòng xét nghiệm BV Thống Nhất",
      results: [],
      summary: "Đang chờ kết quả",
      doctorNote: null,
      hasFile: false,
    },
  ];

  const filteredResults = labResults.filter((result) => {
    const matchesSearch =
      result.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.orderedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || result.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: { variant: "default" as const, text: "Bình thường", icon: CheckCircle },
      warning: { variant: "secondary" as const, text: "Cần theo dõi", icon: AlertTriangle },
      danger: { variant: "destructive" as const, text: "Bất thường", icon: AlertTriangle },
    };
    const config = variants[status as keyof typeof variants] || variants.normal;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getResultStatus = (status: string) => {
    if (status === "pending") {
      return <Badge variant="secondary">Đang chờ</Badge>;
    }
    return <Badge variant="default">Đã có kết quả</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kết quả xét nghiệm</h1>
          <p className="text-slate-600 mt-1">
            Xem và theo dõi các kết quả xét nghiệm của bạn
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Xuất tất cả
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo loại xét nghiệm hoặc bác sĩ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900"
              >
                <option value="all">Tất cả</option>
                <option value="completed">Đã có kết quả</option>
                <option value="pending">Đang chờ</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary-600">
              {labResults.length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Tổng xét nghiệm</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-success-600">
              {labResults.filter((r) => r.status === "completed").length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Đã có kết quả</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-warning-600">
              {labResults.filter((r) => r.status === "pending").length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Đang chờ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-info-600">
              {labResults.filter((r) => r.results.some((res) => res.status === "warning")).length}
            </div>
            <div className="text-sm text-slate-600 mt-1">Cần theo dõi</div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-info-400 to-primary-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{result.type}</CardTitle>
                        {getResultStatus(result.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(result.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {result.orderedBy}
                        </div>
                        <div className="text-xs">{result.facility}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {result.hasFile && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống
                      </Button>
                    )}
                    <Link href={`/patient/lab-results/${result.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>

              {result.status === "completed" && (
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-semibold text-slate-700 mb-1">
                        Tóm tắt:
                      </p>
                      <p className="text-sm text-slate-600">{result.summary}</p>
                    </div>

                    {/* Results Table */}
                    {result.results.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                                Chỉ số
                              </th>
                              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                                Kết quả
                              </th>
                              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                                Đơn vị
                              </th>
                              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                                Giới hạn bình thường
                              </th>
                              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                                Đánh giá
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.results.map((item, index) => (
                              <tr
                                key={index}
                                className={`border-t ${
                                  item.status !== "normal" ? "bg-warning-50" : ""
                                }`}
                              >
                                <td className="px-4 py-2 font-medium">
                                  {item.parameter}
                                </td>
                                <td className="px-4 py-2 font-bold">{item.value}</td>
                                <td className="px-4 py-2">{item.unit}</td>
                                <td className="px-4 py-2">{item.normalRange}</td>
                                <td className="px-4 py-2">
                                  {getStatusBadge(item.status)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Doctor's Note */}
                    {result.doctorNote && (
                      <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
                        <p className="text-sm font-semibold text-info-900 mb-1">
                          Nhận xét của bác sĩ:
                        </p>
                        <p className="text-sm text-info-800">{result.doctorNote}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}

              {result.status === "pending" && (
                <CardContent>
                  <div className="text-center py-8 text-slate-400">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p>Kết quả xét nghiệm đang được xử lý</p>
                    <p className="text-sm mt-1">
                      Bạn sẽ nhận được thông báo khi có kết quả
                    </p>
                  </div>
                </CardContent>
              )}
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

      {/* Health Tips */}
      <Card className="bg-gradient-to-br from-success-50 to-primary-50 border-success-200">
        <CardHeader>
          <CardTitle>🔬 Lưu ý về xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-700">
            ✓ Xét nghiệm máu nên được thực hiện sau 8-12 giờ nhịn ăn để có kết quả chính xác
          </p>
          <p className="text-sm text-slate-700">
            ✓ Hãy tham khảo bác sĩ để hiểu rõ ý nghĩa của các chỉ số xét nghiệm
          </p>
          <p className="text-sm text-slate-700">
            ✓ Lưu trữ kết quả xét nghiệm để theo dõi sự thay đổi theo thời gian
          </p>
          <p className="text-sm text-slate-700">
            ✓ Không tự ý điều trị dựa trên kết quả xét nghiệm mà không có chỉ định của bác sĩ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
