import { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {children}
    </div>
  );
}
