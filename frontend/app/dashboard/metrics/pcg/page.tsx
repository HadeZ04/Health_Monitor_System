import { PcgChart } from "@/components/charts/PcgChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function PcgPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Acoustics"
        title="PCG Waveform"
        description="Heart sound phonocardiogram with S1 / S2 detection."
        icon="🔊"
        stats={[
          { label: "Sample Window", value: "10 s", helper: "Looped" },
          { label: "Noise Floor", value: "-72 dB", helper: "Filtered" },
          { label: "Detected Murmurs", value: "1", helper: "Soft systolic" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>PCG waveform</CardTitle>
          <CardDescription>Acoustic view</CardDescription>
        </CardHeader>
        <CardContent>
          <PcgChart />
        </CardContent>
      </Card>
    </div>
  );
}
