import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
