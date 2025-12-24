"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [requires2FA, setRequires2FA] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock authentication
    setTimeout(() => {
      if (formData.email === "doctor@techxen.health" && formData.password === "doctor123") {
        if (!requires2FA) {
          // Simulate 2FA requirement
          setRequires2FA(true);
          setIsLoading(false);
        } else {
          // Verify 2FA and login
          if (formData.twoFactorCode === "123456") {
            router.push("/doctor/dashboard");
          } else {
            setError("Mã xác thực không đúng");
            setIsLoading(false);
          }
        }
      } else {
        setError("Email hoặc mật khẩu không chính xác");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl shadow-xl shadow-primary-500/25 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Doctor Portal
          </h1>
          <p className="text-slate-600">
            Đăng nhập để truy cập hệ thống quản lý bệnh nhân
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-slate-800">
              {requires2FA ? "Xác thực hai yếu tố" : "Đăng nhập"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {requires2FA
                ? "Nhập mã xác thực từ ứng dụng Authenticator"
                : "Nhập thông tin đăng nhập của bạn"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!requires2FA ? (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="doctor@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-12 bg-white border-slate-300 focus:border-primary-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Mật khẩu
                      </label>
                      <Link
                        href="/doctor/forgot-password"
                        className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 h-12 bg-white border-slate-300 focus:border-primary-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 bg-white border-slate-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* 2FA Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Mã xác thực 6 chữ số
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={formData.twoFactorCode}
                        onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, "") })}
                        className="pl-10 h-12 bg-white border-slate-300 focus:border-primary-400 text-center text-2xl tracking-widest font-mono"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Sử dụng: <code className="bg-slate-100 px-2 py-1 rounded text-primary-600">123456</code> (demo)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRequires2FA(false)}
                    className="text-sm text-slate-600 hover:text-slate-800"
                  >
                    ← Quay lại
                  </button>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-primary-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <span>{requires2FA ? "Xác thực và đăng nhập" : "Đăng nhập"}</span>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-2">🔐 Thông tin demo:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Email: <code className="bg-white px-2 py-0.5 rounded">doctor@techxen.health</code></p>
                <p>Password: <code className="bg-white px-2 py-0.5 rounded">doctor123</code></p>
                <p>2FA Code: <code className="bg-white px-2 py-0.5 rounded">123456</code></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <p>
            Cần hỗ trợ?{" "}
            <Link href="/support" className="text-primary-600 hover:text-primary-700 font-medium">
              Liên hệ IT Support
            </Link>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            © 2025 TechXen Health Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
