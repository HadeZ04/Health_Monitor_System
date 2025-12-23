import { GpsMap } from "@/components/charts/GpsMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function GpsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Mobility"
        title="GPS Path"
        description="Leaflet map preview with live breadcrumbs and heatmap overlays."
        icon="📍"
        accent="emerald"
        stats={[
          { label: "Active Trackers", value: "4", helper: "Wearables" },
          { label: "Latest Ping", value: "15s ago", helper: "WGS84" },
          { label: "Geo-fences", value: "3", helper: "Hospital zones" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>GPS path</CardTitle>
          <CardDescription>Leaflet map preview</CardDescription>
        </CardHeader>
        <CardContent>
          <GpsMap />
        </CardContent>
      </Card>
    </div>
  );
}
