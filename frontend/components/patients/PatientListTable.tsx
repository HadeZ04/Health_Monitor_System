import Link from "next/link";
import { patientList } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function PatientListTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card/80">
      <table className="min-w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Patient</th>
            <th className="px-4 py-3">Condition</th>
            <th className="px-4 py-3">Last signal</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {patientList.map((patient) => (
            <tr key={patient.id} className="border-t border-white/5">
              <td className="px-4 py-3">
                <p className="font-semibold">{patient.name}</p>
                <p className="text-xs text-muted-foreground">
                  {patient.gender} · {patient.age} yrs
                </p>
              </td>
              <td className="px-4 py-3">{patient.condition}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{patient.lastSignal}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/dashboard/patients/${patient.id}`} className="text-primary underline-offset-2 hover:underline">
                  View detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
