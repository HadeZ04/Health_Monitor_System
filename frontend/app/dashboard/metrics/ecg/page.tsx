import { EcgChart } from "@/components/charts/EcgChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function EcgMetricsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Signal Lab"
        title="ECG Metrics"
        description="High-fidelity ECG waveform preview with AI-ready annotations."
        icon="❤️"
        stats={[
          { label: "Sampling Rate", value: "500 Hz", helper: "Lead II" },
          { label: "Latency", value: "220 ms", helper: "WebSocket" },
          { label: "AI Labels", value: "Normal sinus", helper: "0 arrhythmia" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>ECG metrics</CardTitle>
          <CardDescription>Line waveform preview</CardDescription>
        </CardHeader>
        <CardContent>
          <EcgChart />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Clinical notes</CardTitle>
          <CardDescription>Placeholder for AI insight</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Normal sinus rhythm detected. Add future annotations here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
