"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Users,
  Search,
  Eye,
  Lock,
  Unlock,
  Heart,
  Activity,
  Calendar,
  AlertTriangle,
  FileText,
  UserPlus
} from "lucide-react";

// TODO: Fetch data from API - GET /api/admin/patients
// See BACKEND_API_PLAN.md for API specifications

export default function PatientsManagementPage() {
  const [selectedRisk, setSelectedRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedGender, setSelectedGender] = useState<"all" | "Nam" | "Nữ">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mockPatients: Array<any> = [];
  const filteredPatients = mockPatients;

  const stats = {
    total: 0,
    active: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return variants[risk as keyof typeof variants] || variants.low;
  };

  const getRiskLabel = (risk: string) => {
    const labels = {
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
    };
    return labels[risk as keyof typeof labels] || risk;
  };

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Patient Management"
        title="Quản lý bệnh nhân"
        description="Quản lý hồ sơ bệnh nhân, theo dõi tình trạng sức khỏe và quản lý dữ liệu y tế"
        icon="🏥"
        badges={["Patient Records", "Health Monitoring", "Data Management"]}
        stats={[
          { label: "Tổng bệnh nhân", value: `${stats.total}`, helper: `${stats.active} đang hoạt động` },
          { label: "Rủi ro cao", value: `${stats.highRisk}`, helper: "Cần theo dõi chặt", trend: stats.highRisk > 0 ? "warning" : undefined },
          { label: "Rủi ro TB", value: `${stats.mediumRisk}`, helper: "Theo dõi định kỳ" }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/patients/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm bệnh nhân
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/patients/reports">
                <FileText className="h-4 w-4 mr-2" />
                Báo cáo
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-900/70 to-red-900/30 border-red-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-red-200">Rủi ro cao</CardDescription>
            <CardTitle className="text-3xl text-white flex items-center gap-2">
              {stats.highRisk}
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-300">
            Cần theo dõi chặt chẽ
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/70 to-yellow-900/30 border-yellow-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-yellow-200">Rủi ro trung bình</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.mediumRisk}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-300">
            Theo dõi định kỳ
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/70 to-green-900/30 border-green-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-200">Rủi ro thấp</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.lowRisk}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-300">
            Tình trạng ổn định
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/70 to-blue-900/30 border-blue-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Đang hoạt động</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-300">
            / {stats.total} tổng số
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên, mã BN, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRisk === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("all")}
              >
                Tất cả
              </Button>
              <Button
                variant={selectedRisk === "high" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("high")}
              >
                <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
                Cao
              </Button>
              <Button
                variant={selectedRisk === "medium" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("medium")}
              >
                Trung bình
              </Button>
              <Button
                variant={selectedRisk === "low" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("low")}
              >
                Thấp
              </Button>
            </div>

            {/* Gender & Status */}
            <div className="flex gap-2">
              <Button
                variant={selectedGender === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("all")}
              >
                Giới tính
              </Button>
              <Button
                variant={selectedGender === "Nam" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("Nam")}
              >
                Nam
              </Button>
              <Button
                variant={selectedGender === "Nữ" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedGender("Nữ")}
              >
                Nữ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Danh sách bệnh nhân ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Mã BN</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Thông tin</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Tuổi/GT</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Mức độ rủi ro</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Bác sĩ phụ trách</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Khám gần nhất</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Lịch hẹn</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-mono text-slate-300">
                        {patient.patientCode}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{patient.name}</div>
                          <div className="text-xs text-slate-400">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {patient.age} tuổi<br/>
                      <span className="text-xs text-slate-400">{patient.gender}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRiskBadge(patient.riskLevel)}>
                        {getRiskLabel(patient.riskLevel)}
                      </Badge>
                      {patient.conditions.length > 0 && (
                        <div className="text-xs text-slate-400 mt-1">
                          {patient.conditions.join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {patient.doctor}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">
                      {patient.lastVisit}
                    </td>
                    <td className="py-4 px-4">
                      {patient.nextAppointment ? (
                        <div className="text-sm">
                          <Calendar className="inline h-4 w-4 mr-1 text-blue-400" />
                          <span className="text-white">{patient.nextAppointment}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Chưa đặt</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" title="Xem hồ sơ">
                          <Link href={`/admin/patients/${patient.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" title="Chỉ số sức khỏe">
                          <Link href={`/admin/patients/${patient.id}/vitals`}>
                            <Activity className="h-4 w-4" />
                          </Link>
                        </Button>
                        {patient.status === "active" ? (
                          <Button variant="outline" size="sm" title="Khóa">
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" title="Mở khóa">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Không tìm thấy bệnh nhân nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
