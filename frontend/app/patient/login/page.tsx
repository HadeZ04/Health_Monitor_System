"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { Heart, Mail, Lock, AlertCircle, User } from "lucide-react";

export default function PatientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<{
        user: { id: string; email: string; name: string | null; role: { name: string } | null };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Check if user is patient
      if ((data.user.role?.name ?? "") !== "patient") {
        setError("Tài khoản này không phải là tài khoản bệnh nhân.");
        setLoading(false);
        return;
      }

      saveSession({
        token: data.accessToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.name ?? data.user.email,
          role: data.user.role?.name ?? "patient",
        },
      });
      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Cổng Bệnh Nhân
          </h1>
          <p className="text-slate-600">
            Đăng nhập để quản lý sức khỏe của bạn
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để truy cập tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email hoặc Số điện thoại
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/patient/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* Demo Account Info */}
              <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
                <p className="text-xs text-info-800 font-medium mb-1">
                  🧪 Tài khoản demo:
                </p>
                <p className="text-xs text-info-700">
                  Email: patient@demo.com | Mật khẩu: patient123
                </p>
              </div>

              {/* Register Link */}
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-slate-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/patient/register"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Dành cho nhân viên y tế?{" "}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Đăng nhập hệ thống
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
