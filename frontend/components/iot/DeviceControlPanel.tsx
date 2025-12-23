import { devices } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DeviceControlPanel() {
  return (
    <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Device control panel</p>
          <p className="text-xs text-muted-foreground">OTA + telemetry overview</p>
        </div>
        <Button size="sm">Add device</Button>
      </div>
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="rounded-xl border border-white/5 bg-background/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{device.name}</p>
                <p className="text-xs text-muted-foreground">ID {device.id}</p>
              </div>
              <Badge variant={device.status === "online" ? "success" : "destructive"}>{device.status}</Badge>
            </div>
            <div className="mt-2 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
              <p>Battery {device.battery}%</p>
              <p>Last sync {device.lastSync}</p>
              <p>Firmware 1.0.{device.id.slice(-1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
