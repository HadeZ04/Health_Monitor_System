import { ehrEvents } from "@/lib/data";

export function EhrTimeline() {
  return (
    <div className="rounded-2xl border bg-card/80 p-6">
      <p className="text-sm font-semibold">EHR timeline</p>
      <div className="mt-4 space-y-4">
        {ehrEvents.map((event) => (
          <div key={event.id} className="relative pl-6">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{event.date}</p>
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
