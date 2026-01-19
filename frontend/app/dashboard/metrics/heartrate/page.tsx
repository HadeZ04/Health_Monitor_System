import { HeartRateChart } from "@/components/charts/HeartRateChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function HeartRatePage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Vitals"
        title="Heart Rate Trends"
        description="Resting and active BPM timeline powered by wearable ECG patches."
        icon="💓"
        stats={[
          { label: "Resting HR", value: "62 bpm", helper: "Excellent" },
          { label: "Active HR", value: "128 bpm", helper: "Threshold 150" },
          { label: "HRV", value: "72 ms", helper: "Balanced" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Heart rate trends</CardTitle>
          <CardDescription>BPM timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <HeartRateChart />
        </CardContent>
      </Card>
    </div>
  );
}
