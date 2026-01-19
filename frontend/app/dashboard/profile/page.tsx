import { ProfileForm } from "@/components/forms/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { medications, ehrEvents } from "@/lib/data";
import { PageHero } from "@/components/layout/PageHero";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="EHR"
        title="Electronic Health Record"
        description="Personalized profile, medical history, medications, and privacy controls."
        icon="🧬"
        accent="blue"
        badges={["HIPAA", "ISO27001", "Patient Portal"]}
        stats={[
          { label: "Age", value: "42", helper: "Female • A+" },
          { label: "Active Medications", value: `${medications.length}`, helper: "Updated weekly" },
          { label: "Allergies", value: "2", helper: "Penicillin, Peanuts" }
        ]}
        actions={<Button variant="secondary">Download My Data</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile and health details</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Quick overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-2xl font-bold">42 years</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-2xl font-bold">Female</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <p className="text-2xl font-bold">A+</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Height / Weight</p>
              <p className="text-xl font-bold">165 cm / 58 kg</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>Active prescriptions</CardDescription>
              </div>
              <Button size="sm">+ Add</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-semibold">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {med.dosage} • {med.schedule}
                  </p>
                </div>
                <Badge variant={med.status === 'active' ? 'default' : 'secondary'}>
                  {med.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>Past conditions & treatments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <p className="text-sm font-semibold">⚠️ Allergies</p>
              <p className="text-xs text-muted-foreground">Penicillin, Peanuts</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm font-semibold">Past Conditions</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• Hypertension (controlled)</li>
                <li>• Mild arrhythmia (monitored)</li>
                <li>• Vitamin D deficiency (resolved)</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm font-semibold">Surgeries</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• Appendectomy (2018)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>EHR Timeline</CardTitle>
              <CardDescription>Medical events and consultations</CardDescription>
            </div>
            <Button size="sm" variant="outline">Export PDF</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ehrEvents.map((event, idx) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    event.type === 'event' ? 'bg-blue-500/20 text-blue-500' :
                    event.type === 'medication' ? 'bg-green-500/20 text-green-500' :
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    {event.type === 'event' ? '🏥' : event.type === 'medication' ? '💊' : '📝'}
                  </div>
                  {idx < ehrEvents.length - 1 && (
                    <div className="h-full w-0.5 bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vital Signs Trends</CardTitle>
          <CardDescription>30-day averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
              <p className="mt-2 text-3xl font-bold">74 bpm</p>
              <p className="mt-1 text-xs text-green-500">↓ 3 from last month</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Avg SpO2</p>
              <p className="mt-2 text-3xl font-bold">96%</p>
              <p className="mt-1 text-xs text-green-500">Normal range</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Resting HR</p>
              <p className="mt-2 text-3xl font-bold">62 bpm</p>
              <p className="mt-1 text-xs text-green-500">Excellent</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">Active Days</p>
              <p className="mt-2 text-3xl font-bold">23/30</p>
              <p className="mt-1 text-xs text-blue-500">Good activity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>File Storage</CardTitle>
            <CardDescription>Medical documents & reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: "ECG_Report_2024-11.pdf", size: "2.3 MB", date: "Nov 15" },
              { name: "Blood_Test_Results.pdf", size: "1.1 MB", date: "Nov 10" },
              { name: "Chest_Xray.jpg", size: "3.8 MB", date: "Oct 28" },
            ].map((file, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Download</Button>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">+ Upload New File</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>HIPAA/ISO27001 compliant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Data Encryption</p>
                <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Two-Factor Auth</p>
                <p className="text-xs text-muted-foreground">SMS + Authenticator app</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Access Logs</p>
                <p className="text-xs text-muted-foreground">Last accessed: 2 min ago</p>
              </div>
              <Button size="sm" variant="ghost">View</Button>
            </div>
            <Button className="w-full mt-4" variant="outline">Download My Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
