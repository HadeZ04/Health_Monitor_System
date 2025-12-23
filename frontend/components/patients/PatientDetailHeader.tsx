import { Badge } from "@/components/ui/badge";

interface PatientDetailProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
}

export function PatientDetailHeader({ id, name, age, gender, condition }: PatientDetailProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-900 p-6 sm:p-8">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="relative flex flex-wrap items-center gap-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Patient #{id}</p>
          <h1 className="text-3xl font-semibold text-white">{name}</h1>
          <p className="text-sm text-slate-300">
            {age} years · {gender}
          </p>
        </div>
        <Badge variant="outline" className="bg-white/10 text-white">
          {condition}
        </Badge>
      </div>
      <div className="relative mt-6 grid gap-4 text-sm sm:grid-cols-3">
        {[
          { label: "Age", value: `${age}` },
          { label: "Gender", value: gender },
          { label: "Care Plan", value: condition }
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
