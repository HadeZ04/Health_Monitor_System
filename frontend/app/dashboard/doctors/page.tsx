import { doctors, patientList } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PatientListTable } from "@/components/patients/PatientListTable";
import { PageHero } from "@/components/layout/PageHero";

export default function DoctorsPage() {
  const totalDoctors = doctors.length;
  const totalPatients = patientList.length;
  const avgPanel = Math.round(totalPatients / Math.max(totalDoctors, 1));

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Care Team Hub"
        title="Doctor Dashboard"
        description="Patient management, vital sign monitoring, AI diagnostic support, and secure messaging."
        icon="👨‍⚕️"
        accent="emerald"
        badges={["RBAC", "EHR", "AI assist"]}
        stats={[
          { label: "Clinicians", value: `${totalDoctors}`, helper: "Specialists on duty" },
          { label: "Patients Managed", value: `${totalPatients}`, helper: `${avgPanel} avg / doctor` },
          { label: "Response SLA", value: "3m", helper: "Critical alerts" }
        ]}
        actions={
          <>
            <Button variant="secondary">Invite Doctor</Button>
            <Button variant="outline">Assign Patients</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">32</CardTitle>
            <CardDescription>Active Patients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">+4 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">7</CardTitle>
            <CardDescription>Pending Reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-500">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">15</CardTitle>
            <CardDescription>Messages Today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-500">3 unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">98%</CardTitle>
            <CardDescription>Patient Satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Care Team</CardTitle>
            <CardDescription>Medical staff and assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl">👨‍⚕️</div>
                  <div>
                    <h3 className="text-sm font-semibold">{doctor.name}</h3>
                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                  </div>
                </div>
                <Badge variant="outline">{doctor.patients} patients</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Diagnostic Suggestions</CardTitle>
            <CardDescription>AI-generated insights (not replacing doctors)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">⚠️ Patient PAT-02</p>
                <Badge variant="outline" className="text-xs">High Priority</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Detected irregular heart rhythm pattern. AFib probability: 18%
              </p>
              <Button size="sm" variant="link" className="mt-2 h-auto p-0">
                Review ECG →
              </Button>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">ℹ️ Patient PAT-01</p>
                <Badge variant="outline" className="text-xs">Medium</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                SpO2 consistently below 94% during sleep. Consider sleep apnea screening.
              </p>
              <Button size="sm" variant="link" className="mt-2 h-auto p-0">
                View Trend →
              </Button>
            </div>

            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">✓ Patient PAT-03</p>
                <Badge variant="outline" className="text-xs">Good</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Heart rate variability improving. Treatment response positive.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>View EHR, monitor vitals, and chat with patients</CardDescription>
            </div>
            <Button>+ Add Patient</Button>
          </div>
        </CardHeader>
        <CardContent>
          <PatientListTable />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports Exported</CardTitle>
            <CardDescription>Generated patient reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { patient: "Ava Nguyen", type: "ECG Analysis", date: "Nov 15, 2024", format: "PDF" },
              { patient: "Liam Tran", type: "Monthly Vitals", date: "Nov 14, 2024", format: "Excel" },
              { patient: "Mia Pham", type: "Arrhythmia Report", date: "Nov 13, 2024", format: "PDF" },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-semibold">{report.patient}</p>
                  <p className="text-xs text-muted-foreground">{report.type} • {report.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{report.format}</Badge>
                  <Button size="sm" variant="ghost">Download</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Patient Chat</CardTitle>
            <CardDescription>Secure doctor-patient messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { patient: "Ava Nguyen", message: "Feeling better today, thank you!", time: "2 min ago", unread: true },
              { patient: "Liam Tran", message: "Question about my medication", time: "15 min ago", unread: true },
              { patient: "Mia Pham", message: "Thanks for the follow-up!", time: "1 hour ago", unread: false },
            ].map((chat, idx) => (
              <div key={idx} className={`flex items-start justify-between rounded-lg border p-3 ${chat.unread ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm">
                    {chat.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{chat.patient}</p>
                    <p className="text-xs text-muted-foreground">{chat.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{chat.time}</p>
                  </div>
                </div>
                {chat.unread && (
                  <Badge className="bg-primary text-xs">New</Badge>
                )}
              </div>
            ))}
            <Button className="w-full" variant="outline">Open Chat Dashboard</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Decision Support Tools</CardTitle>
          <CardDescription>Evidence-based medical guidelines and protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm font-semibold">Drug Database</p>
              <p className="mt-1 text-xs text-muted-foreground">Interactions, dosages, contraindications</p>
              <Button size="sm" variant="outline" className="mt-3">Search</Button>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">🔬</div>
              <p className="text-sm font-semibold">Lab Reference Ranges</p>
              <p className="mt-1 text-xs text-muted-foreground">Normal values and interpretation</p>
              <Button size="sm" variant="outline" className="mt-3">View</Button>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm font-semibold">Treatment Protocols</p>
              <p className="mt-1 text-xs text-muted-foreground">WHO and evidence-based guidelines</p>
              <Button size="sm" variant="outline" className="mt-3">Browse</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
