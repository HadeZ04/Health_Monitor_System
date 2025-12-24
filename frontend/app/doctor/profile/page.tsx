"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Bell,
  Lock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Save,
  Edit,
  Camera,
  Shield,
} from "lucide-react";

export default function DoctorProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "security">("profile");
  const [isEditing, setIsEditing] = useState(false);

  const doctorInfo = {
    name: "BS. Trần Thị Minh Châu",
    title: "Bác sĩ chuyên khoa II",
    specialty: "Tim mạch",
    licenseNumber: "BYT-012345",
    yearsOfExperience: 15,
    email: "doctor@techxen.health",
    phone: "0901234567",
    address: "Bệnh viện TechXen, 123 Nguyễn Huệ, Q1, TP.HCM",
    education: [
      "Bác sĩ Đa khoa - Đại học Y Hà Nội (2005)",
      "Chuyên khoa I Tim mạch - BV Chợ Rẫy (2010)",
      "Chuyên khoa II Tim mạch - BV Tâm Đức (2015)",
    ],
    certifications: [
      "Chứng chỉ can thiệp tim mạch",
      "Chứng chỉ siêu âm tim",
      "Chứng chỉ điện tim",
    ],
    workingHours: {
      monday: "08:00 - 17:00",
      tuesday: "08:00 - 17:00",
      wednesday: "08:00 - 17:00",
      thursday: "08:00 - 17:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Nghỉ",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hồ sơ cá nhân</h1>
        <p className="text-slate-600">Quản lý thông tin và cài đặt tài khoản</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-white to-primary-50/30 border-slate-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                TC
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-50 transition-colors">
                <Camera className="w-5 h-5 text-primary-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {doctorInfo.name}
              </h2>
              <p className="text-lg text-slate-600 mb-3">{doctorInfo.title}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 text-primary-500" />
                  <span>Chuyên khoa: {doctorInfo.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Award className="w-4 h-4 text-teal-500" />
                  <span>Kinh nghiệm: {doctorInfo.yearsOfExperience} năm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Giấy phép: {doctorInfo.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{doctorInfo.email}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Đang chỉnh sửa" : "Chỉnh sửa hồ sơ"}
                </Button>
                {isEditing && (
                  <Button size="sm" className="bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium transition-all ${
            activeTab === "profile"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium transition-all ${
            activeTab === "settings"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Cài đặt
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-medium transition-all ${
            activeTab === "security"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Bảo mật
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Email
                  </label>
                  <Input value={doctorInfo.email} disabled={!isEditing} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Số điện thoại
                  </label>
                  <Input value={doctorInfo.phone} disabled={!isEditing} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Địa chỉ làm việc
                  </label>
                  <Input value={doctorInfo.address} disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Học vấn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {doctorInfo.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <p className="text-sm text-slate-700">{edu}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Chứng chỉ chuyên môn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {doctorInfo.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Giờ làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(doctorInfo.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-semibold text-slate-700 capitalize">
                      {day === "monday" && "Thứ 2"}
                      {day === "tuesday" && "Thứ 3"}
                      {day === "wednesday" && "Thứ 4"}
                      {day === "thursday" && "Thứ 5"}
                      {day === "friday" && "Thứ 6"}
                      {day === "saturday" && "Thứ 7"}
                      {day === "sunday" && "Chủ nhật"}
                    </span>
                    <span className="text-sm text-slate-600">{hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { label: "Lịch hẹn mới", description: "Thông báo khi có lịch hẹn mới từ bệnh nhân" },
                  { label: "Cảnh báo bệnh nhân", description: "Thông báo khi có cảnh báo quan trọng" },
                  { label: "Kết quả xét nghiệm", description: "Thông báo khi xét nghiệm hoàn thành" },
                  { label: "Tin nhắn mới", description: "Thông báo khi có tin nhắn từ bệnh nhân" },
                  { label: "Email tóm tắt hàng ngày", description: "Gửi email tổng hợp hoạt động hàng ngày" },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{setting.label}</p>
                      <p className="text-xs text-slate-600 mt-1">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Hiển thị
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Ngôn ngữ
                  </label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                    <option>Tiếng Việt</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Múi giờ
                  </label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                    <option>GMT+7 (Hà Nội, Bangkok)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Đổi mật khẩu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Mật khẩu hiện tại
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Mật khẩu mới
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Xác nhận mật khẩu mới
                  </label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button className="bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                  Cập nhật mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Xác thực hai yếu tố (2FA)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-700 mb-1">Trạng thái: <strong className="text-success-600">Đang bật</strong></p>
                  <p className="text-xs text-slate-600">
                    Bảo vệ tài khoản với lớp bảo mật thứ hai
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Cấu hình lại
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Lịch sử đăng nhập</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { device: "Chrome on Windows", location: "TP.HCM, Vietnam", time: "Hôm nay, 08:30", status: "current" },
                  { device: "Mobile App (iOS)", location: "TP.HCM, Vietnam", time: "Hôm qua, 18:45", status: "success" },
                  { device: "Chrome on Windows", location: "TP.HCM, Vietnam", time: "2 ngày trước, 08:15", status: "success" },
                ].map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{login.device}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {login.location} • {login.time}
                      </p>
                    </div>
                    {login.status === "current" && (
                      <Badge className="bg-success-100 text-success-700">Hiện tại</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
