import { medications } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function MedicationList() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-card/80 p-6">
      <p className="text-sm font-semibold">Medications</p>
      <div className="mt-4 space-y-3 text-sm">
        {medications.map((med) => (
          <div key={med.id} className="rounded-xl border border-white/5 bg-background/70 p-3">
            <p className="font-semibold">{med.name}</p>
            <p className="text-xs text-muted-foreground">{med.dosage} · {med.schedule}</p>
            <Badge variant="outline" className="mt-2">
              {med.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
