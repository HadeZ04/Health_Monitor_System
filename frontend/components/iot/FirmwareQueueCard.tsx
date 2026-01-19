import { firmwareQueue } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FirmwareQueueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OTA firmware queue</CardTitle>
        <CardDescription>Schedule + status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {firmwareQueue.map((item) => (
          <div key={item.id} className="rounded-xl border border-dashed border-white/10 p-3">
            <p className="font-semibold">{item.id}</p>
            <p className="text-xs text-muted-foreground">Version {item.version}</p>
            <p className="text-xs text-primary">{item.status} · {item.eta}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
