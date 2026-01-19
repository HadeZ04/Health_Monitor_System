import { overviewCards, devices } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgChart } from "@/components/charts/EcgChart";
import { HeartRateChart } from "@/components/charts/HeartRateChart";
import { Spo2Gauge } from "@/components/charts/Spo2Gauge";
import { RealtimeSummary } from "@/components/charts/RealtimeSummary";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const onlineDevices = devices.filter((device) => device.status === "online").length;

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Command Center"
        title="Live Bio-signal Dashboard"
        description="Review vitals, predictive alerts, AI insights, device uptime and patient context in seconds."
        icon="🫀"
        badges={["Realtime ECG", "AI Insights", "HIPAA Ready"]}
        stats={[
          { label: "Signals Live", value: "6", helper: "ECG • SpO2 • HR • GPS" },
          { label: "Devices Online", value: `${onlineDevices}`, helper: `${devices.length} total` },
          { label: "Critical Alerts", value: "23", helper: "This week", trend: "+8%" }
        ]}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/monitoring/live">Live Monitoring</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/ai-chat">AI Chatbot</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/patients">Patients</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/emergency">Emergency Mode</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className="bg-gradient-to-br from-slate-900/70 to-slate-900/30">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-3xl text-white">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">{card.change}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ECG waveform</CardTitle>
            <CardDescription>Live streaming sample</CardDescription>
          </CardHeader>
          <CardContent>
            <EcgChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SpO2 + HR trends</CardTitle>
            <CardDescription>Vitals aligned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Spo2Gauge />
              <HeartRateChart />
            </div>
          </CardContent>
        </Card>
        <RealtimeSummary />
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Live monitoring</CardTitle>
            <CardDescription>WebSocket + MQTT dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Stream ECG, SpO2, HR, PPG, PCG and GPS into the monitoring hub. Replay windows and exports ready.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI chatbot</CardTitle>
            <CardDescription>Medical Q&A + RAG</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Upload ECG PDFs, labs, voice questions. RAG over WHO, PubMed, Vietnam MoH docs.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doctor dashboard</CardTitle>
            <CardDescription>EHR + patient chat</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            RBAC ready for patient, doctor, admin, researcher roles. Track vitals, meds, AI notes.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>IoT & emergency</CardTitle>
            <CardDescription>OTA + alert bridges</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            OTA firmware scheduling, battery, SMS/Email/Telegram/Zalo critical alerts and exports.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
