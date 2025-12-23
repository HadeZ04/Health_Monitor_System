import { alertRules } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AlertRuleList() {
  return (
    <div className="rounded-2xl border bg-card/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Alert rules</p>
          <p className="text-xs text-muted-foreground">Heart rate, SpO2, AFib</p>
        </div>
        <Button size="sm" variant="outline">
          New rule
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        {alertRules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-dashed border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{rule.label}</p>
                <p className="text-xs text-muted-foreground">Threshold {rule.threshold}</p>
              </div>
              <Badge variant={rule.enabled ? "success" : "outline"}>{rule.enabled ? "Active" : "Paused"}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Channels: {rule.channels.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
