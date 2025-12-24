"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Stethoscope,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Award,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

// TODO: Fetch data from API - GET /api/admin/doctors
// See BACKEND_API_PLAN.md for API specifications

const specialties = [
  "Tất cả",
  "Tim mạch",
  "Nội tiết",
  "Thần kinh",
  "Nhi khoa",
  "Da liễu",
  "Tiêu hóa",
  "Hô hấp"
];

export default function DoctorsManagementPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mockDoctors: Array<any> = [];
  const filteredDoctors = mockDoctors;

  const stats = {
    total: 0,
    active: 0,
    totalPatients: 0,
    totalAppointments: 0,
    avgRating: "0"
  };

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Doctor Management"
        title="Quản lý bác sĩ"
        description="Quản lý thông tin bác sĩ, chuyên khoa, lịch làm việc và bệnh nhân phụ trách"
        icon="👨‍⚕️"
        badges={["Medical Staff", "Specialist Management", "Care Quality"]}
        stats={[
          { label: "Tổng bác sĩ", value: `${stats.total}`, helper: `${stats.active} đang hoạt động` },
          { label: "Bệnh nhân", value: `${stats.totalPatients}`, helper: "Đang quản lý" },
          { label: "Đánh giá TB", value: `${stats.avgRating}⭐`, helper: "Điểm chất lượng" }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/doctors/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm bác sĩ
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/doctors/schedule">
                <Calendar className="h-4 w-4 mr-2" />
                Lịch làm việc
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-900/70 to-green-900/30 border-green-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-200">Bác sĩ đang hoạt động</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.active}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-300">
            / {stats.total} tổng số
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/70 to-blue-900/30 border-blue-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-200">Bệnh nhân đang quản lý</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.totalPatients}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-300">
            Tổng số bệnh nhân
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/70 to-purple-900/30 border-purple-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-200">Lịch khám hôm nay</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.totalAppointments}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-purple-300">
            Đang chờ khám
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/70 to-yellow-900/30 border-yellow-700/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-yellow-200">Đánh giá trung bình</CardDescription>
            <CardTitle className="text-3xl text-white">{stats.avgRating} / 5.0</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-300">
            <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" /> Chất lượng cao
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
                placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>

            {/* Specialty Filter */}
            <div className="flex gap-2 flex-wrap">
              {specialties.map(specialty => (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "active" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("active")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </Button>
              <Button
                variant={selectedStatus === "inactive" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("inactive")}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    {doctor.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{doctor.name}</CardTitle>
                    <CardDescription className="text-slate-400">{doctor.specialty}</CardDescription>
                  </div>
                </div>
                <Badge className={doctor.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                  {doctor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Users className="h-3 w-3" />
                    Bệnh nhân
                  </div>
                  <div className="text-white font-bold text-xl">{doctor.patients}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar className="h-3 w-3" />
                    Lịch hôm nay
                  </div>
                  <div className="text-white font-bold text-xl">{doctor.appointments}</div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-400" />
                    Kinh nghiệm:
                  </span>
                  <span className="text-white font-medium">{doctor.experience} năm</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    Đánh giá:
                  </span>
                  <span className="text-white font-medium">{doctor.rating} / 5.0</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Tham gia:
                  </span>
                  <span className="text-white font-medium">{doctor.joinedDate}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-3 border-t border-slate-700 space-y-1">
                <p className="text-xs text-slate-400">📧 {doctor.email}</p>
                <p className="text-xs text-slate-400">📱 {doctor.phone}</p>
                <p className="text-xs text-slate-400">🏥 License: {doctor.license}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button asChild variant="secondary" size="sm" className="flex-1">
                  <Link href={`/admin/doctors/${doctor.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Lịch làm việc
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Không tìm thấy bác sĩ nào</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
