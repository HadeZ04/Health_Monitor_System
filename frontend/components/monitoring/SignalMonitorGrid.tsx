import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Signal = {
  id: string;
  label: string;
  value: string;
  status: string;
  unit: string;
  change: string;
  lastUpdated: string;
};

const statusColor: Record<string, string> = {
  stable: "text-emerald-400",
  tracking: "text-sky-400",
  watch: "text-amber-400",
  critical: "text-red-400"
};

export function SignalMonitorGrid({ signals }: { signals: Signal[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {signals.map((signal) => (
        <Card key={signal.id} className="border-primary/10 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardDescription className="uppercase tracking-wide text-xs">{signal.label}</CardDescription>
            <CardTitle className="text-3xl">{signal.value}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <p>
                Status: <span className={statusColor[signal.status] ?? ""}>{signal.status}</span>
              </p>
              <p>Change: {signal.change}</p>
            </div>
            <div className="text-right text-xs">
              <p>Unit: {signal.unit}</p>
              <p>Updated {signal.lastUpdated}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
