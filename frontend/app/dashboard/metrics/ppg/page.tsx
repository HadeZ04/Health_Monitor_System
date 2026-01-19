import { PpgChart } from "@/components/charts/PpgChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function PpgPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Peripheral"
        title="PPG Waveform"
        description="Plethysmography preview with blood volume pulse data."
        icon="🩸"
        accent="pink"
        stats={[
          { label: "Sampling Rate", value: "200 Hz", helper: "Infrared + Red" },
          { label: "Perfusion Index", value: "6.2", helper: "Stable" },
          { label: "Anomalies", value: "0", helper: "Last 24h" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>PPG waveform</CardTitle>
          <CardDescription>Plethysmography preview</CardDescription>
        </CardHeader>
        <CardContent>
          <PpgChart />
        </CardContent>
      </Card>
    </div>
  );
}
