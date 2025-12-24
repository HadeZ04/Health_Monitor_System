"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bell,
  Monitor,
  Clock,
  Calendar,
  Users,
  FileText,
  Download,
  Upload,
  Database,
  Shield,
  Key,
  Globe,
  Smartphone,
  Mail,
  Printer,
  Save,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", label: "Cài đặt chung", icon: Settings },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "schedule", label: "Lịch làm việc", icon: Calendar },
    { id: "appointments", label: "Lịch hẹn", icon: Clock },
    { id: "data", label: "Dữ liệu & Sao lưu", icon: Database },
    { id: "privacy", label: "Bảo mật & Quyền riêng tư", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cài đặt hệ thống</h1>
        <p className="text-slate-600">Tùy chỉnh và quản lý cài đặt Doctor Portal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Navigation */}
        <Card className="lg:col-span-1 border-slate-200 shadow-lg h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Right: Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "general" && (
            <>
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Hiển thị giao diện</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Chế độ hiển thị
                    </label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                      <option>Tự động (theo hệ thống)</option>
                      <option>Sáng</option>
                      <option>Tối</option>
                    </select>
                  </div>
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
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Tùy chọn Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {[
                    "Hiển thị thống kê nhanh",
                    "Hiển thị lịch khám hôm nay",
                    "Hiển thị cảnh báo quan trọng",
                    "Hiển thị biểu đồ hiệu suất",
                  ].map((option, index) => (
                    <label key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-sm text-slate-700">{option}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
                    </label>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "notifications" && (
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Cài đặt thông báo</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { category: "Lịch hẹn", items: ["Lịch hẹn mới", "Thay đổi lịch hẹn", "Hủy lịch hẹn"] },
                  { category: "Bệnh nhân", items: ["Cảnh báo nguy kịch", "Chỉ số bất thường", "Tin nhắn mới"] },
                  { category: "Xét nghiệm", items: ["Kết quả xét nghiệm mới", "Yêu cầu xét nghiệm khẩn"] },
                  { category: "Hệ thống", items: ["Cập nhật hệ thống", "Thông báo bảo trì"] },
                ].map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">{group.category}</h3>
                    <div className="space-y-2">
                      {group.items.map((item, itemIndex) => (
                        <label key={itemIndex} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-sm text-slate-700">{item}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">Email</Badge>
                            <Badge variant="outline" className="text-xs">App</Badge>
                            <input type="checkbox" defaultChecked className="ml-2 w-5 h-5 text-primary-600" />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "schedule" && (
            <>
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Giờ làm việc tiêu chuẩn</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { day: "Thứ 2", from: "08:00", to: "17:00", active: true },
                      { day: "Thứ 3", from: "08:00", to: "17:00", active: true },
                      { day: "Thứ 4", from: "08:00", to: "17:00", active: true },
                      { day: "Thứ 5", from: "08:00", to: "17:00", active: true },
                      { day: "Thứ 6", from: "08:00", to: "17:00", active: true },
                      { day: "Thứ 7", from: "08:00", to: "12:00", active: true },
                      { day: "Chủ nhật", from: "", to: "", active: false },
                    ].map((schedule, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <input type="checkbox" defaultChecked={schedule.active} className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-semibold text-slate-700 w-24">{schedule.day}</span>
                        {schedule.active ? (
                          <>
                            <input
                              type="time"
                              defaultValue={schedule.from}
                              className="p-2 border border-slate-300 rounded text-sm"
                            />
                            <span className="text-slate-500">-</span>
                            <input
                              type="time"
                              defaultValue={schedule.to}
                              className="p-2 border border-slate-300 rounded text-sm"
                            />
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">Nghỉ</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Cài đặt lịch hẹn</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Thời gian mỗi ca khám (phút)
                    </label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                      <option>15 phút</option>
                      <option selected>30 phút</option>
                      <option>45 phút</option>
                      <option>60 phút</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Thời gian nghỉ giữa ca (phút)
                    </label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                      <option>Không</option>
                      <option>5 phút</option>
                      <option selected>10 phút</option>
                      <option>15 phút</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "appointments" && (
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Quy tắc đặt lịch</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Thời gian đặt trước tối thiểu
                  </label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                    <option>Không yêu cầu</option>
                    <option>2 giờ trước</option>
                    <option selected>4 giờ trước</option>
                    <option>1 ngày trước</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Cho phép đặt lịch trong khoảng
                  </label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                    <option>1 tuần tới</option>
                    <option selected>2 tuần tới</option>
                    <option>1 tháng tới</option>
                    <option>3 tháng tới</option>
                  </select>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  {[
                    "Tự động xác nhận lịch hẹn",
                    "Cho phép bệnh nhân hủy lịch",
                    "Gửi nhắc nhở trước 24 giờ",
                    "Gửi nhắc nhở trước 2 giờ",
                  ].map((option, index) => (
                    <label key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
                      <span className="text-sm text-slate-700">{option}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "data" && (
            <>
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Sao lưu dữ liệu</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-800">Sao lưu lần cuối</p>
                    </div>
                    <p className="text-sm text-blue-700">13/01/2025 lúc 02:00</p>
                    <p className="text-xs text-blue-600 mt-1">Dung lượng: 1.2 GB</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống bản sao lưu
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary-500 to-teal-500 text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sao lưu ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Xuất dữ liệu</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { label: "Danh sách bệnh nhân", icon: Users },
                      { label: "Lịch sử khám bệnh", icon: FileText },
                      { label: "Kết quả xét nghiệm", icon: FileText },
                      { label: "Đơn thuốc", icon: FileText },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-700">{item.label}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "privacy" && (
            <>
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Quyền riêng tư & Bảo mật
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-success-600" />
                      <div>
                        <p className="text-sm font-semibold text-success-800">Xác thực hai yếu tố (2FA)</p>
                        <p className="text-xs text-success-700">Đang bật - Tài khoản được bảo vệ</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Mã hóa dữ liệu bệnh nhân", status: "Đang bật" },
                      { label: "Ghi log hoạt động", status: "Đang bật" },
                      { label: "Tự động đăng xuất sau 30 phút", status: "Đang bật" },
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{setting.label}</span>
                        <Badge className="bg-success-100 text-success-700">{setting.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg text-slate-800">Lịch sử hoạt động</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { action: "Đăng nhập", time: "Hôm nay, 08:30", device: "Chrome on Windows" },
                      { action: "Cập nhật hồ sơ bệnh nhân", time: "Hôm nay, 09:15", device: "Chrome on Windows" },
                      { action: "Xuất báo cáo", time: "Hôm qua, 16:45", device: "Chrome on Windows" },
                    ].map((log, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                          <p className="text-xs text-slate-500">{log.time}</p>
                        </div>
                        <p className="text-xs text-slate-600">{log.device}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Xem toàn bộ lịch sử
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">
              Đặt lại mặc định
            </Button>
            <Button className="bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
