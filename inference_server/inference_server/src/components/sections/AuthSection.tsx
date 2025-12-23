import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginUser, registerUser, redirectToDashboard } from '../../lib/auth';
import { saveSession } from '../../lib/session';

type Status = { type: 'idle' | 'success' | 'error'; message?: string };

const roleOptions = [
  { value: 'patient', label: 'Patient', description: 'Personal health tracking' },
  { value: 'doctor', label: 'Doctor', description: 'Care team insights' },
  { value: 'admin', label: 'Admin', description: 'Operations visibility' },
  { value: 'researcher', label: 'Researcher', description: 'Data exploration' }
] as const;

export default function AuthSection() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient',
    age: '',
    gender: ''
  });

  const [loginStatus, setLoginStatus] = useState<Status>({ type: 'idle' });
  const [registerStatus, setRegisterStatus] = useState<Status>({ type: 'idle' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginStatus({ type: 'idle' });
    try {
      const session = await loginUser(loginForm);
      saveSession(session);
      setLoginStatus({ type: 'success', message: 'Đăng nhập thành công, chuyển đến bảng điều khiển...' });
      setTimeout(() => redirectToDashboard(), 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đăng nhập';
      setLoginStatus({ type: 'error', message });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterLoading(true);
    setRegisterStatus({ type: 'idle' });

    try {
      const session = await registerUser({
        ...registerForm,
        age: registerForm.age ? Number(registerForm.age) : undefined
      });
      saveSession(session);
      setRegisterStatus({ type: 'success', message: 'Tạo tài khoản thành công! Đang chuyển đến bảng điều khiển...' });
      setTimeout(() => redirectToDashboard(), 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tạo tài khoản';
      setRegisterStatus({ type: 'error', message });
    } finally {
      setRegisterLoading(false);
    }
  };

  const badgeStyles = (status: Status) => {
    if (status.type === 'success') return 'text-emerald-300';
    if (status.type === 'error') return 'text-rose-300';
    return 'text-slate-400';
  };

  return (
    <section id="auth" className="relative py-24 md:py-32 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(6,182,212,0.15),_transparent_45%)]" />
        <div className="absolute inset-0 medical-grid-pattern" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <motion.p
            className="text-sm uppercase tracking-[0.6em] text-cyan-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ACCESS LEVELS
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Đăng nhập & Đăng ký tài khoản Health Monitor
          </motion.h2>
          <motion.p
            className="text-xl text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Các tài khoản được lưu trữ an toàn trên máy chủ bảo mật. Bạn có thể sử dụng chung thông tin này để đăng nhập vào bộ ứng dụng quản trị tại khu vực nội bộ.
          </motion.p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            id="auth-login"
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Existing member</p>
                <h3 className="text-3xl font-bold text-white mt-2">Đăng nhập hệ thống</h3>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-200">
                SSO + JWT
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@hospital.org"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Mật khẩu</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                />
              </label>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                <p className="font-semibold">Sau khi xác thực:</p>
                <ul className="mt-2 space-y-1 text-cyan-50/90">
                  <li>• Nhận token JWT hợp lệ (4 giờ)</li>
                  <li>• Truy cập bảng điều khiển thời gian thực</li>
                  <li>• Đồng bộ với ứng dụng nội bộ trong thư mục <code className="text-xs">frontend</code></li>
                </ul>
              </div>

              {loginStatus.type !== 'idle' && (
                <p className={`text-sm font-semibold ${badgeStyles(loginStatus)}`}>
                  {loginStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-lg font-semibold text-slate-900 hover:opacity-90 transition disabled:opacity-60"
              >
                {loginLoading ? 'Đang đăng nhập...' : 'Tiếp tục tới Dashboard'}
              </button>
            </form>
          </motion.div>

          <motion.div
            id="auth-register"
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-rose-300">New organization</p>
                <h3 className="text-3xl font-bold text-white mt-2">Tạo tài khoản</h3>
              </div>
              <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-1 text-sm text-rose-100">
                2 phút
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Họ và tên *</span>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-rose-400 focus:outline-none"
                    value={registerForm.fullName}
                    onChange={(event) => setRegisterForm({ ...registerForm, fullName: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Email *</span>
                  <input
                    type="email"
                    required
                    placeholder="care@techxen.org"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-rose-400 focus:outline-none"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Tuổi</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="32"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-rose-400 focus:outline-none"
                    value={registerForm.age}
                    onChange={(event) => setRegisterForm({ ...registerForm, age: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Giới tính</span>
                  <select
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-rose-400 focus:outline-none"
                    value={registerForm.gender}
                    onChange={(event) => setRegisterForm({ ...registerForm, gender: event.target.value })}
                  >
                    <option value="">Lựa chọn</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Mật khẩu *</span>
                <input
                  type="password"
                  required
                  placeholder="Ít nhất 8 ký tự"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-rose-400 focus:outline-none"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {roleOptions.map((role) => (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => setRegisterForm({ ...registerForm, role: role.value })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      registerForm.role === role.value
                        ? 'border-rose-400 bg-rose-400/10 text-white'
                        : 'border-white/10 text-slate-300 hover:border-rose-300/50'
                    }`}
                  >
                    <p className="text-lg font-semibold">{role.label}</p>
                    <p className="text-sm text-slate-400 mt-1">{role.description}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
                <p className="font-semibold">Tích hợp backend:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Tạo tài khoản qua endpoint <code className="text-xs">POST /auth/register</code></li>
                  <li>• Mã hóa mật khẩu bằng bcrypt</li>
                  <li>• Tự động nhận token và chuyển đến ứng dụng trong thư mục <code className="text-xs">frontend</code></li>
                </ul>
              </div>

              {registerStatus.type !== 'idle' && (
                <p className={`text-sm font-semibold ${badgeStyles(registerStatus)}`}>
                  {registerStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 py-3 text-lg font-semibold text-slate-900 hover:opacity-90 transition disabled:opacity-60"
              >
                {registerLoading ? 'Đang tạo tài khoản...' : 'Đăng ký & truy cập ngay'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


