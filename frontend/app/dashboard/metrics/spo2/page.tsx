import { Spo2Gauge } from "@/components/charts/Spo2Gauge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function Spo2MetricsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Vitals"
        title="SpO2 Saturation"
        description="Continuous blood oxygen saturation gauge."
        icon="🫁"
        accent="blue"
        stats={[
          { label: "Current", value: "97%", helper: "Excellent" },
          { label: "Low Threshold", value: "92%", helper: "Warning" },
          { label: "Sensor", value: "PulseOx v1.3", helper: "CE certified" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>SpO2 saturation</CardTitle>
          <CardDescription>Gauge preview</CardDescription>
        </CardHeader>
        <CardContent>
          <Spo2Gauge />
        </CardContent>
      </Card>
    </div>
  );
}
