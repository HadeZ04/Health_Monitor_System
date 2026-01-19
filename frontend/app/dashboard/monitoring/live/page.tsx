import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgChart } from "@/components/charts/EcgChart";
import { HeartRateChart } from "@/components/charts/HeartRateChart";
import { Spo2Gauge } from "@/components/charts/Spo2Gauge";
import { PpgChart } from "@/components/charts/PpgChart";
import { PcgChart } from "@/components/charts/PcgChart";
import { GpsMap } from "@/components/charts/GpsMap";
import { RealtimeStreamPanel } from "@/components/monitoring/RealtimeStreamPanel";
import { AlertTicker } from "@/components/monitoring/AlertTicker";
import { AiSignalInsight } from "@/components/monitoring/AiSignalInsight";
import { ExportPanel } from "@/components/monitoring/ExportPanel";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

export default function LiveMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Live Monitoring"
        title="Real-time Vital Streaming Lab"
        description="ECG, SpO2, Heart Rate, PPG, PCG, and GPS streaming simultaneously via WebSocket and MQTT with millisecond sync."
        icon="📡"
        accent="cyan"
        badges={["WebSocket", "MQTT", "Low Latency"]}
        stats={[
          { label: "Signals Active", value: "6", helper: "ECG • SpO2 • HR • PPG • PCG • GPS" },
          { label: "Streaming Uptime", value: "99.98%", helper: "Last 30 days" },
          { label: "Message Rate", value: "~50/sec", helper: "Average throughput" }
        ]}
        actions={
          <>
            <Button variant="secondary">Start Recording</Button>
            <Button variant="outline">Export Snapshot</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Electrocardiogram (ECG)</CardTitle>
            <CardDescription>Real-time heart electrical activity</CardDescription>
          </CardHeader>
          <CardContent>
            <EcgChart live height={300} showGrid />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Trend</CardTitle>
            <CardDescription>Beats per minute over time</CardDescription>
          </CardHeader>
          <CardContent>
            <HeartRateChart live height={260} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Blood Oxygen (SpO2)</CardTitle>
            <CardDescription>Current saturation level</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Spo2Gauge live height={220} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>GPS Location Tracking</CardTitle>
            <CardDescription>Real-time device location with path history</CardDescription>
          </CardHeader>
          <CardContent>
            <GpsMap live height={300} showPath />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Photoplethysmogram (PPG)</CardTitle>
            <CardDescription>Blood volume pulse waveform</CardDescription>
          </CardHeader>
          <CardContent>
            <PpgChart live height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phonocardiogram (PCG)</CardTitle>
            <CardDescription>Heart sound recording (S1 & S2)</CardDescription>
          </CardHeader>
          <CardContent>
            <PcgChart live height={260} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RealtimeStreamPanel />
        <ExportPanel />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AlertTicker />
        <AiSignalInsight />
      </div>
    </div>
  );
}
