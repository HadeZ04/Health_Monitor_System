import { PatientListTable } from "@/components/patients/PatientListTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/layout/PageHero";
import { patientList } from "@/lib/data";

export default function PatientsPage() {
  const totalPatients = patientList.length;
  const femalePatients = patientList.filter((patient) => patient.gender === "F").length;
  const malePatients = patientList.filter((patient) => patient.gender === "M").length;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="EHR Control"
        title="Patient Management"
        description="Manage Electronic Health Records, monitor vitals, AI insights and secure messaging."
        icon="🩺"
        accent="blue"
        badges={["EHR", "Vitals", "Secure Chat"]}
        stats={[
          { label: "Active Patients", value: `${totalPatients}`, helper: "Cardiology cohort" },
          { label: "Female • Male", value: `${femalePatients} • ${malePatients}`, helper: "Gender split" },
          { label: "AI Watchlist", value: "4", helper: "High priority" }
        ]}
        actions={<Button variant="secondary">+ Add Patient</Button>}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Input placeholder="Search patients by name, ID, or condition..." className="max-w-md" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export List</Button>
          <Button>+ Add Patient</Button>
        </div>
      </div>

      <PatientListTable />

      <Card>
        <CardHeader>
          <CardTitle>Patient Management Features</CardTitle>
          <CardDescription>Comprehensive EHR and monitoring capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-semibold">Vital Sign Trends</p>
              <p className="mt-1 text-xs text-muted-foreground">Real-time monitoring and historical data</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm font-semibold">Secure Messaging</p>
              <p className="mt-1 text-xs text-muted-foreground">HIPAA-compliant patient chat</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-sm font-semibold">AI Insights</p>
              <p className="mt-1 text-xs text-muted-foreground">Automated risk assessment and alerts</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-semibold">Report Generation</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF/Excel export for EHR</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
