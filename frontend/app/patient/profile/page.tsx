"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  Activity,
  Edit,
  Save,
  X,
  Plus,
} from "lucide-react";

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    dateOfBirth: "1980-05-15",
    gender: "Nam",
    bloodType: "O+",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    emergencyContact: "Nguyễn Thị B - 0987654321",
    insurance: "Bảo hiểm Y tế Quốc gia - 1234567890",
  });

  const [medicalConditions] = useState([
    { id: 1, name: "Tiểu đường type 2", since: "2020", controlled: true },
    { id: 2, name: "Cao huyết áp", since: "2018", controlled: true },
  ]);

  const [allergies] = useState([
    { id: 1, name: "Penicillin", severity: "Cao", reaction: "Phát ban, khó thở" },
    { id: 2, name: "Phấn hoa", severity: "Trung bình", reaction: "Hắt hơi, ngứa mũi" },
  ]);

  const [surgeries] = useState([
    { id: 1, name: "Cắt ruột thừa", date: "2015-08-10", hospital: "BV Chợ Rẫy" },
    { id: 2, name: "Phẫu thuật khớp gối", date: "2019-12-20", hospital: "BV Thống Nhất" },
  ]);

  const handleSave = () => {
    // API call to save profile
    setIsEditing(false);
    // Show success message
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hồ sơ sức khỏe của tôi</h1>
          <p className="text-slate-600 mt-1">Quản lý thông tin cá nhân và hồ sơ y tế</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Thông tin cơ bản về bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-3xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                  <p className="text-slate-600">Bệnh nhân</p>
                  <Badge variant="outline" className="mt-2">
                    Mã BN: PT-2025-001
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày sinh
                  </label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Giới tính
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Nhóm máu
                  </label>
                  <Input
                    value={profile.bloodType}
                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ
                  </label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Người liên hệ khẩn cấp
                  </label>
                  <Input
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tên - Số điện thoại"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Bảo hiểm y tế
                  </label>
                  <Input
                    value={profile.insurance}
                    onChange={(e) => setProfile({ ...profile, insurance: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bệnh nền */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-error-600" />
                    Bệnh nền
                  </CardTitle>
                  <CardDescription>Các bệnh mạn tính bạn đang mắc</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {medicalConditions.length > 0 ? (
                <div className="space-y-3">
                  {medicalConditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-error-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{condition.name}</h4>
                          <p className="text-sm text-slate-600">Từ năm {condition.since}</p>
                        </div>
                      </div>
                      <Badge variant={condition.controlled ? "default" : "destructive"}>
                        {condition.controlled ? "Đang kiểm soát" : "Cần theo dõi"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có thông tin bệnh nền</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dị ứng */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning-600" />
                    Dị ứng thuốc & thực phẩm
                  </CardTitle>
                  <CardDescription>Các chất gây dị ứng cần lưu ý</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {allergies.length > 0 ? (
                <div className="space-y-3">
                  {allergies.map((allergy) => (
                    <div
                      key={allergy.id}
                      className="p-4 bg-warning-50 border border-warning-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{allergy.name}</h4>
                        <Badge
                          variant={allergy.severity === "Cao" ? "destructive" : "secondary"}
                        >
                          Mức độ: {allergy.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        <strong>Phản ứng:</strong> {allergy.reaction}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không có dị ứng được ghi nhận</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tiền sử phẫu thuật */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-info-600" />
                    Tiền sử phẫu thuật
                  </CardTitle>
                  <CardDescription>Các ca phẫu thuật đã thực hiện</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {surgeries.length > 0 ? (
                <div className="space-y-3">
                  {surgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <h4 className="font-semibold text-slate-900 mb-2">{surgery.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {surgery.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {surgery.hospital}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tiền sử phẫu thuật</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Health Summary Card */}
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <CardHeader>
              <CardTitle>Tổng quan sức khỏe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm opacity-90 mb-1">Tuổi</div>
                <div className="text-2xl font-bold">45 tuổi</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">BMI</div>
                <div className="text-2xl font-bold">24.5</div>
                <div className="text-xs opacity-75">Bình thường</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Nhóm máu</div>
                <div className="text-2xl font-bold">{profile.bloodType}</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Bệnh nền</span>
                <span className="font-bold text-slate-900">{medicalConditions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Dị ứng</span>
                <span className="font-bold text-slate-900">{allergies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phẫu thuật</span>
                <span className="font-bold text-slate-900">{surgeries.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-error-200 bg-error-50">
            <CardHeader>
              <CardTitle className="text-error-900">Liên hệ khẩn cấp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-error-800 font-medium">{profile.emergencyContact}</p>
              <Button variant="destructive" size="sm" className="w-full mt-3">
                <Phone className="w-4 h-4 mr-2" />
                Gọi ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
