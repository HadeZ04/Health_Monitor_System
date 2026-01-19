import { alertEvents } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function AlertTicker() {
  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Alerts</p>
        <Badge variant="outline">Live rules</Badge>
      </div>
      <div className="space-y-2 text-sm">
        {alertEvents.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between rounded-xl border border-dashed border-white/10 bg-background/60 px-3 py-2">
            <div>
              <p className="font-medium">{alert.type}</p>
              <p className="text-xs text-muted-foreground">{alert.triggeredAt}</p>
            </div>
            <Badge variant={alert.severity === "critical" ? "destructive" : "outline"}>{alert.severity}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
