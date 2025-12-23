import { gpsHeatSpots } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GpsHeatPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GPS heatmap</CardTitle>
        <CardDescription>Deploy actual heatmap later</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {gpsHeatSpots.map((spot) => (
          <div key={spot.id} className="flex items-center justify-between rounded-xl border border-dashed border-white/10 px-3 py-2">
            <p>{spot.label}</p>
            <p className="text-primary">{spot.count} points</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
