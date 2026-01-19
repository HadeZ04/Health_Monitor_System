"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navSections } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { clearSession } from "@/lib/session";
import { useSession } from "@/hooks/useSession";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const handleSignOut = () => {
    clearSession();
    router.push("/auth/login");
  };

  return (
    <aside className="relative flex h-full w-72 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900/60 px-6 py-8 text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle,_rgba(6,182,212,0.25),_transparent_60%)]" />
      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/20 p-3 text-cyan-200">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">TechXen</p>
          <p className="text-lg font-semibold">BioSignal Lab</p>
        </div>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                    pathname.startsWith(item.href)
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="rounded-lg bg-white/5 p-1.5 text-cyan-200 group-hover:bg-cyan-500/20">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">{session?.user.fullName ?? "Đang tải tài khoản"}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200 mt-1">{session?.user.role ?? "role"}</p>
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-white/40 text-white hover:bg-white/10"
        type="button"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </aside>
  );
}
