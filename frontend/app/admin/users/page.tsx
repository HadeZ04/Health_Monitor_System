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
  Filter,
  MoreVertical,
  UserPlus,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Mail,
  Shield,
  RefreshCw
} from "lucide-react";

// TODO: Fetch data from API - GET /api/admin/users
// See BACKEND_API_PLAN.md for API specifications

type UserRole = "all" | "patient" | "doctor" | "staff" | "admin";
type UserStatus = "all" | "active" | "inactive" | "locked";

export default function UsersManagementPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("all");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mockUsers: Array<any> = [];
  const filteredUsers = mockUsers;

  const stats = {
    total: 0,
    patients: 0,
    doctors: 0,
    staff: 0,
    admins: 0,
    active: 0,
    locked: 0,
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      patient: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      doctor: "bg-green-500/20 text-green-400 border-green-500/30",
      staff: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      admin: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return variants[role as keyof typeof variants] || variants.patient;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      locked: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="User Management"
        title="Quản lý người dùng"
        description="Quản lý tất cả người dùng trong hệ thống: bệnh nhân, bác sĩ, nhân viên và admin"
        icon="👥"
        badges={["User Control", "Role Management", "Access Control"]}
        stats={[
          { label: "Tổng Users", value: `${stats.total}`, helper: "All users" },
          { label: "Đang hoạt động", value: `${stats.active}`, helper: "Active users" },
          { label: "Bị khóa", value: `${stats.locked}`, helper: "Locked accounts", trend: stats.locked > 0 ? "warning" : undefined }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/users/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/roles">
                <Shield className="h-4 w-4 mr-2" />
                Quản lý quyền
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Bệnh nhân</CardDescription>
            <CardTitle className="text-3xl text-blue-400">{stats.patients}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Bác sĩ</CardDescription>
            <CardTitle className="text-3xl text-green-400">{stats.doctors}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Nhân viên</CardDescription>
            <CardTitle className="text-3xl text-purple-400">{stats.staff}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Admin</CardDescription>
            <CardTitle className="text-3xl text-red-400">{stats.admins}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Đang hoạt động</CardDescription>
            <CardTitle className="text-3xl text-emerald-400">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* Filters and Search */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRole === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("all")}
              >
                Tất cả ({stats.total})
              </Button>
              <Button
                variant={selectedRole === "patient" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("patient")}
              >
                Bệnh nhân ({stats.patients})
              </Button>
              <Button
                variant={selectedRole === "doctor" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("doctor")}
              >
                Bác sĩ ({stats.doctors})
              </Button>
              <Button
                variant={selectedRole === "staff" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("staff")}
              >
                Nhân viên ({stats.staff})
              </Button>
              <Button
                variant={selectedRole === "admin" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("admin")}
              >
                Admin ({stats.admins})
              </Button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                <Filter className="h-4 w-4 mr-1" />
                All Status
              </Button>
              <Button
                variant={selectedStatus === "active" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={selectedStatus === "inactive" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={selectedStatus === "locked" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("locked")}
              >
                Locked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Danh sách người dùng ({filteredUsers.length})
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Tên</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Email</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Role</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Trạng thái</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Đăng nhập gần nhất</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Ngày tạo</th>
                  <th className="pb-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusBadge(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">{user.lastLogin}</td>
                    <td className="py-4 px-4 text-slate-400 text-sm">{user.createdAt}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" title="Xem chi tiết">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "locked" ? (
                          <Button variant="outline" size="sm" title="Mở khóa">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" title="Khóa tài khoản">
                            <Lock className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" title="Reset password">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="More actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
