import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GpsMap } from "@/components/charts/GpsMap";

export function GpsTrackerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GPS tracking</CardTitle>
        <CardDescription>Wearable path preview</CardDescription>
      </CardHeader>
      <CardContent>
        <GpsMap />
        <div className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
          <p>Device: GPS Patch-3</p>
          <p>Status: Live</p>
          <p>Last sync: 15s ago</p>
        </div>
      </CardContent>
    </Card>
  );
}
