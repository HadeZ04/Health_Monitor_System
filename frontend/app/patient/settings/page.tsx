"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Lock,
  Bell,
  Globe,
  Shield,
  User,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Check,
} from "lucide-react";

export default function PatientSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    appointments: true,
    medications: true,
    labResults: true,
    healthTips: false,
  });

  const [language, setLanguage] = useState("vi");
  const [theme, setTheme] = useState("light");

  const handleSavePassword = () => {
    // API call to change password
    console.log("Password changed");
  };

  const handleToggleNotification = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] });
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cài đặt tài khoản</h1>
        <p className="text-slate-600 mt-1">Quản lý thông tin và tùy chọn cá nhân</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Thông tin tài khoản
          </CardTitle>
          <CardDescription>Thông tin cơ bản về tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Input value="nguyenvana@email.com" disabled />
                <Badge variant="default">Đã xác minh</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Số điện thoại
              </label>
              <div className="flex items-center gap-2">
                <Input value="0912345678" disabled />
                <Badge variant="default">Đã xác minh</Badge>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Mã bệnh nhân
            </label>
            <Input value="PT-2025-001" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Mật khẩu hiện tại
            </label>
            <Input type="password" placeholder="Nhập mật khẩu hiện tại" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Mật khẩu mới
            </label>
            <Input type="password" placeholder="Nhập mật khẩu mới" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Xác nhận mật khẩu mới
            </label>
            <Input type="password" placeholder="Nhập lại mật khẩu mới" />
          </div>
          <Button onClick={handleSavePassword}>Cập nhật mật khẩu</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>Chọn cách bạn muốn nhận thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Kênh nhận thông báo</h4>
            <div className="space-y-3">
              {[
                { key: "email", label: "Email", icon: Mail },
                { key: "sms", label: "SMS", icon: Smartphone },
                { key: "push", label: "Thông báo đẩy", icon: Bell },
              ].map((channel) => (
                <div
                  key={channel.key}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <channel.icon className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">{channel.label}</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(channel.key)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications[channel.key as keyof typeof notifications]
                        ? "bg-primary-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications[channel.key as keyof typeof notifications]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-slate-900">Loại thông báo</h4>
            <div className="space-y-3">
              {[
                { key: "appointments", label: "Lịch khám" },
                { key: "medications", label: "Nhắc uống thuốc" },
                { key: "labResults", label: "Kết quả xét nghiệm" },
                { key: "healthTips", label: "Lời khuyên sức khỏe" },
              ].map((type) => (
                <div
                  key={type.key}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="font-medium text-slate-700">{type.label}</span>
                  <button
                    onClick={() => handleToggleNotification(type.key)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications[type.key as keyof typeof notifications]
                        ? "bg-primary-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications[type.key as keyof typeof notifications]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-600" />
            Ngôn ngữ & Giao diện
          </CardTitle>
          <CardDescription>Tùy chỉnh ngôn ngữ và giao diện</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Ngôn ngữ
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-slate-900"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Giao diện
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Sáng</p>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Tối</p>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            Quyền riêng tư & Bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Quản lý quyền truy cập
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Lịch sử đăng nhập
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Thiết bị đã liên kết
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Xóa tài khoản
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Hủy thay đổi</Button>
        <Button>
          <Check className="w-4 h-4 mr-2" />
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
