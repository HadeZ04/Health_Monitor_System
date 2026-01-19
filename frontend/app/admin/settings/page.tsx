"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Save,
  Globe,
  Shield,
  Bell,
  Database,
  Mail,
  Image,
  Clock,
  Key,
  Server,
  Cloud,
  Lock,
  Check,
  Upload
} from "lucide-react";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "email" | "storage">("general");

  // Mock data
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Healthcare Monitoring System",
    systemLogo: "/logo.png",
    domain: "health-monitor.vn",
    defaultLanguage: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "VND"
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    require2FA: false,
    ipWhitelist: "",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@health-monitor.vn",
    smtpPassword: "********",
    senderName: "Healthcare System",
    senderEmail: "noreply@health-monitor.vn",
    enableEmailNotifications: true,
  });

  const [storageSettings, setStorageSettings] = useState({
    provider: "local",
    maxFileSize: 10,
    allowedFileTypes: "pdf,jpg,png,doc,docx",
    storageQuota: 100,
    currentUsage: 45.2,
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
  });

  const tabs = [
    { id: "general", label: "Cài đặt chung", icon: Settings },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
    { id: "storage", label: "Lưu trữ", icon: Database },
  ];

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="System Configuration"
        title="Cài đặt hệ thống"
        description="Cấu hình tổng thể hệ thống, bảo mật, email và lưu trữ"
        icon="⚙️"
        badges={["System Admin", "Configuration", "Security"]}
        stats={[
          { label: "Storage Used", value: `${storageSettings.currentUsage}GB`, helper: `/${storageSettings.storageQuota}GB` },
          { label: "Security Score", value: "95%", helper: "Excellent" },
          { label: "Uptime", value: "99.9%", helper: "Last 30 days" }
        ]}
        actions={
          <>
            <Button size="sm" variant="secondary">
              <Save className="h-4 w-4 mr-2" />
              Lưu tất cả
            </Button>
            <Button size="sm" variant="outline">
              <Cloud className="h-4 w-4 mr-2" />
              Backup ngay
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "outline"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                Thông tin hệ thống
              </CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản và hiển thị</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Tên hệ thống</label>
                  <Input
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Domain</label>
                  <Input
                    value={generalSettings.domain}
                    onChange={(e) => setGeneralSettings({...generalSettings, domain: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Logo hệ thống</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Image className="h-10 w-10 text-slate-600" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload logo mới
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Ngôn ngữ mặc định</label>
                  <select 
                    value={generalSettings.defaultLanguage}
                    onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Timezone</label>
                  <select 
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Định dạng ngày</label>
                  <select 
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-yellow-400" />
                Chính sách mật khẩu
              </CardTitle>
              <CardDescription>Cấu hình yêu cầu bảo mật cho mật khẩu người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Độ dài tối thiểu</label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Thời gian session (phút)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-700 pt-4">
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireUppercase}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span>Yêu cầu chữ hoa</span>
                  {securitySettings.passwordRequireUppercase && <Check className="h-4 w-4 text-green-400" />}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireNumbers}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span>Yêu cầu số</span>
                  {securitySettings.passwordRequireNumbers && <Check className="h-4 w-4 text-green-400" />}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireSpecialChars}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecialChars: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span>Yêu cầu ký tự đặc biệt</span>
                  {securitySettings.passwordRequireSpecialChars && <Check className="h-4 w-4 text-green-400" />}
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-400" />
                Bảo vệ tài khoản
              </CardTitle>
              <CardDescription>Cấu hình bảo vệ chống truy cập trái phép</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Số lần đăng nhập sai tối đa</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Thời gian khóa (phút)</label>
                  <Input
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-700 pt-4">
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.require2FA}
                    onChange={(e) => setSecuritySettings({...securitySettings, require2FA: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span>Bắt buộc xác thực 2 yếu tố (2FA)</span>
                  {securitySettings.require2FA && <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>}
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-400" />
                Cấu hình SMTP
              </CardTitle>
              <CardDescription>Thiết lập máy chủ email để gửi thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">SMTP Host</label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">SMTP Port</label>
                  <Input
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">SMTP Username</label>
                  <Input
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">SMTP Password</label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Sender Name</label>
                  <Input
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Sender Email</label>
                  <Input
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Storage Settings */}
      {activeTab === "storage" && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                Cấu hình lưu trữ
              </CardTitle>
              <CardDescription>Quản lý dung lượng và cấu hình file upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Storage Usage */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Dung lượng đã sử dụng</span>
                  <span className="text-white font-medium">
                    {storageSettings.currentUsage}GB / {storageSettings.storageQuota}GB
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(storageSettings.currentUsage / storageSettings.storageQuota) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {((storageSettings.currentUsage / storageSettings.storageQuota) * 100).toFixed(1)}% đã sử dụng
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Kích thước file tối đa (MB)</label>
                  <Input
                    type="number"
                    value={storageSettings.maxFileSize}
                    onChange={(e) => setStorageSettings({...storageSettings, maxFileSize: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Storage Provider</label>
                  <select 
                    value={storageSettings.provider}
                    onChange={(e) => setStorageSettings({...storageSettings, provider: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="local">Local Storage</option>
                    <option value="s3">Amazon S3</option>
                    <option value="azure">Azure Blob</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Loại file cho phép</label>
                <Input
                  value={storageSettings.allowedFileTypes}
                  onChange={(e) => setStorageSettings({...storageSettings, allowedFileTypes: e.target.value})}
                  placeholder="pdf,jpg,png,doc,docx"
                  className="bg-slate-800/50 border-slate-600"
                />
                <p className="text-xs text-slate-400">Phân cách bằng dấu phẩy</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cloud className="h-5 w-5 text-green-400" />
                Tự động sao lưu
              </CardTitle>
              <CardDescription>Cấu hình backup tự động cho dữ liệu hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storageSettings.autoBackup}
                  onChange={(e) => setStorageSettings({...storageSettings, autoBackup: e.target.checked})}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                />
                <span>Bật tự động sao lưu</span>
                {storageSettings.autoBackup && <Badge className="bg-green-500/20 text-green-400">Active</Badge>}
              </label>

              {storageSettings.autoBackup && (
                <div className="grid gap-4 md:grid-cols-2 ml-7">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Tần suất backup</label>
                    <select 
                      value={storageSettings.backupFrequency}
                      onChange={(e) => setStorageSettings({...storageSettings, backupFrequency: e.target.value})}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="hourly">Mỗi giờ</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Giữ backup (ngày)</label>
                    <Input
                      type="number"
                      value={storageSettings.backupRetention}
                      onChange={(e) => setStorageSettings({...storageSettings, backupRetention: parseInt(e.target.value)})}
                      className="bg-slate-800/50 border-slate-600"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Lưu thay đổi</h3>
              <p className="text-sm text-slate-300">Nhấn nút bên phải để áp dụng các cài đặt mới</p>
            </div>
            <Button size="lg" variant="secondary">
              <Save className="h-5 w-5 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
