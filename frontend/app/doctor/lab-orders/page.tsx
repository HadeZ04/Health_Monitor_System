"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  User,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function LabOrdersPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "processing" | "completed">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const labOrders = [
    {
      id: 1,
      patient: "Nguyễn Văn An",
      patientCode: "BN001234",
      age: 45,
      tests: ["Xét nghiệm đường huyết", "HbA1c"],
      orderedDate: "2025-01-13",
      urgency: "normal",
      status: "pending",
      room: "P-302",
    },
    {
      id: 2,
      patient: "Trần Thị Bình",
      patientCode: "BN001235",
      age: 62,
      tests: ["Xét nghiệm máu tổng quát", "Chức năng gan"],
      orderedDate: "2025-01-13",
      urgency: "urgent",
      status: "processing",
      room: "P-205",
    },
    {
      id: 3,
      patient: "Phạm Thị Dung",
      patientCode: "BN001237",
      age: 55,
      tests: ["ECG", "Troponin", "CK-MB"],
      orderedDate: "2025-01-13",
      urgency: "stat",
      status: "processing",
      room: "ICU-402",
    },
    {
      id: 4,
      patient: "Lê Văn Công",
      patientCode: "BN001236",
      age: 38,
      tests: ["Lipid profile", "Chức năng thận"],
      orderedDate: "2025-01-12",
      urgency: "normal",
      status: "completed",
      room: "P-108",
      completedDate: "2025-01-13",
      hasResults: true,
    },
    {
      id: 5,
      patient: "Hoàng Văn Em",
      patientCode: "BN001238",
      age: 70,
      tests: ["X-quang ngực", "Xét nghiệm máu"],
      orderedDate: "2025-01-12",
      urgency: "normal",
      status: "completed",
      room: "P-310",
      completedDate: "2025-01-13",
      hasResults: true,
    },
  ];

  const filteredOrders = labOrders.filter(
    (order) =>
      order.status === activeTab &&
      (order.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.patientCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "stat":
        return "bg-danger-100 text-danger-700 border-danger-200";
      case "urgent":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "stat":
        return "Cấp cứu (STAT)";
      case "urgent":
        return "Khẩn cấp";
      default:
        return "Bình thường";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản lý xét nghiệm</h1>
          <p className="text-slate-600">
            Yêu cầu xét nghiệm và xem kết quả
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Chờ xử lý</p>
                <p className="text-2xl font-bold text-orange-700">
                  {labOrders.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Đang xử lý</p>
                <p className="text-2xl font-bold text-primary-700">
                  {labOrders.filter((o) => o.status === "processing").length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-emerald-50 border-success-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Hoàn thành</p>
                <p className="text-2xl font-bold text-success-700">
                  {labOrders.filter((o) => o.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("pending")}
                className={activeTab === "pending" ? "bg-primary-500 text-white" : ""}
              >
                Chờ xử lý ({labOrders.filter((o) => o.status === "pending").length})
              </Button>
              <Button
                variant={activeTab === "processing" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("processing")}
                className={activeTab === "processing" ? "bg-primary-500 text-white" : ""}
              >
                Đang xử lý ({labOrders.filter((o) => o.status === "processing").length})
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("completed")}
                className={activeTab === "completed" ? "bg-primary-500 text-white" : ""}
              >
                Hoàn thành ({labOrders.filter((o) => o.status === "completed").length})
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm bệnh nhân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lab Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Patient Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {order.patient.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/doctor/patients/${order.patientCode}`}
                        className="font-bold text-slate-800 hover:text-primary-600 transition-colors"
                      >
                        {order.patient}
                      </Link>
                      <Badge className={getUrgencyColor(order.urgency)}>
                        {getUrgencyLabel(order.urgency)}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      <p>{order.patientCode} • {order.age} tuổi</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Yêu cầu: {order.orderedDate}</span>
                        {order.completedDate && (
                          <>
                            <span className="text-slate-400">•</span>
                            <CheckCircle className="w-4 h-4 text-success-500" />
                            <span>Hoàn thành: {order.completedDate}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{order.room}</span>
                      </div>
                    </div>

                    {/* Tests List */}
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Xét nghiệm:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.tests.map((test, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FlaskConical className="w-3 h-3 mr-1" />
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col gap-2 lg:w-48">
                  {order.status === "completed" && order.hasResults ? (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem kết quả
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Tải về
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                      {order.status === "pending" && (
                        <Button variant="outline" size="sm" className="flex-1 text-danger-600 border-danger-300">
                          Hủy yêu cầu
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <FlaskConical className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Không có yêu cầu xét nghiệm
            </h3>
            <p className="text-slate-600">
              {activeTab === "pending" && "Chưa có yêu cầu xét nghiệm nào đang chờ xử lý"}
              {activeTab === "processing" && "Không có xét nghiệm nào đang được xử lý"}
              {activeTab === "completed" && "Không có kết quả xét nghiệm nào"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
