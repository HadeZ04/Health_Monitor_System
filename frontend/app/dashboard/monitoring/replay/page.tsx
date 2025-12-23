import { replaySegments } from "@/lib/data";
import { ReplayTimeline } from "@/components/monitoring/ReplayTimeline";
import { ExportPanel } from "@/components/monitoring/ExportPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgChart } from "@/components/charts/EcgChart";
import { HeartRateChart } from "@/components/charts/HeartRateChart";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/PageHero";

export default function ReplayCenterPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Historical Intelligence"
        title="Replay & Annotate ECG History"
        description="Review past 24h ECG recordings, analyze arrhythmia patterns, and export annotated data with AI insights."
        icon="⏱️"
        accent="purple"
        badges={["24h buffer", "AI annotations", "Timeseries DB"]}
        stats={[
          { label: "Segments Ready", value: `${replaySegments.length}`, helper: "Last 24 hours" },
          { label: "AFib Episodes", value: "3", helper: "AI-detected" },
          { label: "Pending Exports", value: "4", helper: "PDF · CSV · JSON" }
        ]}
        actions={<Button variant="secondary">Download Latest Replay</Button>}
      />

      <ReplayTimeline segments={replaySegments} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Historical ECG Playback</CardTitle>
            <CardDescription>24-hour continuous recording</CardDescription>
          </CardHeader>
          <CardContent>
            <EcgChart live={false} height={300} showGrid />
            <div className="mt-4 flex gap-2">
              <Button size="sm">⏮ Prev Event</Button>
              <Button size="sm">▶ Play</Button>
              <Button size="sm">⏸ Pause</Button>
              <Button size="sm">⏭ Next Event</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate History</CardTitle>
            <CardDescription>24-hour trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <HeartRateChart live={false} height={260} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg border p-2">
                <p className="text-muted-foreground">Min HR</p>
                <p className="text-lg font-semibold text-green-500">52 bpm</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-muted-foreground">Avg HR</p>
                <p className="text-lg font-semibold">74 bpm</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-muted-foreground">Max HR</p>
                <p className="text-lg font-semibold text-red-500">142 bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ExportPanel />
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis & Annotations</CardTitle>
            <CardDescription>Automated arrhythmia detection results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <p className="text-sm font-semibold">⚠️ AFib Detection</p>
              <p className="text-xs text-muted-foreground">3 episodes detected at 02:15, 08:42, 14:30</p>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-sm font-semibold">ℹ️ PVC Events</p>
              <p className="text-xs text-muted-foreground">12 premature ventricular contractions</p>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
              <p className="text-sm font-semibold">✓ Overall Status</p>
              <p className="text-xs text-muted-foreground">Normal sinus rhythm 89% of the time</p>
            </div>
            <Button className="w-full mt-2">Export Analysis Report (PDF)</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Integration</CardTitle>
          <CardDescription>Time-series storage and query</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">InfluxDB Integration</p>
              <p className="text-xs text-muted-foreground mt-2">Store high-frequency ECG, PPG, and sensor data</p>
              <Button size="sm" variant="outline" className="mt-3">Configure Bucket</Button>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">TimescaleDB Queries</p>
              <p className="text-xs text-muted-foreground mt-2">SQL-based time-series analytics for vitals</p>
              <Button size="sm" variant="outline" className="mt-3">Query Builder</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
