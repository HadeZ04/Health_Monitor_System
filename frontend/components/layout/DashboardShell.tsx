import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="grid-pattern absolute inset-0 opacity-10" />
          <div className="absolute -top-10 left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <TopNav />

        <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-900/80 p-10">
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
