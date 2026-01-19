import { alertTotals, arrhythmiaStats } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AlertStatBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Alert performance</CardTitle>
          <CardDescription>Rules + response KPIs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {alertTotals.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <p>{item.label}</p>
              <p className="text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.trend}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Arrhythmia statistics</CardTitle>
          <CardDescription>Predictions per week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {arrhythmiaStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between text-sm">
              <p>{stat.label}</p>
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${stat.value * 4}%` }} />
              </div>
              <p className="w-10 text-right">{stat.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
