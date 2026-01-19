"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

// DEMO MODE: Set to false for production, true for development
const DEMO_MODE = false;

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API authentication
    // See BACKEND_API_PLAN.md - GET /api/auth/me
    
    // Trong demo mode, tự động set session giả
    if (DEMO_MODE) {
      const mockSession = {
        token: "demo-token-123",
        user: {
          id: "admin-1",
          email: "admin@demo.com",
          name: "Demo Admin",
          role: requiredRole || "admin"
        }
      };
      localStorage.setItem("session", JSON.stringify(mockSession));
      setReady(true);
      return;
    }

    // Production mode: check real session
    const session = getSession();
    if (!session?.token) {
      router.replace("/auth/login");
      return;
    }

    // Check role if required
    if (requiredRole && session.user?.role !== requiredRole) {
      router.replace("/dashboard");
      return;
    }

    setReady(true);
  }, [router, requiredRole]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">
            {DEMO_MODE ? "Demo Mode" : "Securing session"}
          </p>
          <p className="text-lg font-semibold">
            {DEMO_MODE ? "Loading demo data..." : "Đang xác thực tài khoản..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


