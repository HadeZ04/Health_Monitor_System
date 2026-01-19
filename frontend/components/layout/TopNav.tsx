"use client";

import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useSession } from "@/hooks/useSession";

export function TopNav() {
  const session = useSession();
  const initials =
    session?.user.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "HM";

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/60 px-10 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Monitoring Lab</p>
        <h2 className="text-2xl font-semibold text-white">Live overview</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full border border-white/20 text-cyan-200 hover:bg-white/10" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{session?.user.fullName ?? "Loading..."}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{session?.user.role ?? "ROLE"}</p>
        </div>
        <Avatar initials={initials} className="bg-cyan-500/20 text-white" />
      </div>
    </header>
  );
}
