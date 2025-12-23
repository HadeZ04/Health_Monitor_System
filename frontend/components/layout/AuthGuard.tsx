"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session?.token) {
      router.replace("/auth/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Securing session</p>
          <p className="text-lg font-semibold">Đang xác thực tài khoản...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


