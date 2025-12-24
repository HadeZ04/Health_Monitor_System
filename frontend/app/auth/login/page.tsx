"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveSession, type SessionState } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@techxen.org");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        user: { id: string; email: string; name: string | null; role: { name: string } | null };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const session: SessionState = {
        token: data.accessToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.name ?? data.user.email,
          role: data.user.role?.name ?? "patient",
        },
      };

      saveSession(session);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md p-1">
        {/* Card Border Gradient/Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur opacity-75"></div>
        
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <span className="material-symbols-outlined text-white text-2xl">monitor_heart</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-2">Sign in to TechXen</h1>
            <p className="text-slate-400 text-sm">
              New to the workspace? <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">Create an account</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 text-[20px] group-focus-within:text-cyan-400 transition-colors">mail</span>
                </div>
                <input 
                  className="block w-full rounded-lg border border-slate-700 bg-slate-950/50 py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="you@hospital.org" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 text-[20px] group-focus-within:text-cyan-400 transition-colors">lock</span>
                </div>
                <input 
                  className="block w-full rounded-lg border border-slate-700 bg-slate-950/50 py-3 pl-10 pr-10 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Continue to dashboard"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">OR</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                <svg className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12s5.333 12 11.947 12c3.6 0 6.12-1.187 8.267-3.413 2.2-2.187 2.88-5.333 2.88-7.853 0-.773-.08-1.52-.24-2.227h-10.907z"/>
                </svg>
              </button>
              <button className="flex items-center justify-center px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                <svg className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.99-.75 1.57.15 3.2.79 4.14 1.94-3.75 2.16-2.9 7.2 1.05 8.8 0 .08-.04.14-.05.23-.68 1.93-2.3 3.89-4.21 6.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
              <button className="flex items-center justify-center px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                <svg className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              By continuing, you agree to the TechXen <a href="#" className="underline hover:text-slate-400">Terms</a> and <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
