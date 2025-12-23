import { DoctorChatPanel } from "@/components/patients/DoctorChatPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";

export default function DoctorChatPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Team Messaging"
        title="Doctor ↔ Patient Chat"
        description="Real-time messaging with escalation to SMS, Telegram, and AI triage suggestions."
        icon="💬"
        accent="pink"
        badges={["WebSocket", "Voice notes", "Auto translate"]}
        stats={[
          { label: "Conversations Today", value: "15", helper: "3 unread" },
          { label: "Avg Response", value: "2m", helper: "Doctor SLA" },
          { label: "Escalations", value: "2", helper: "SMS fallback" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Doctor ↔ Patient chat</CardTitle>
          <CardDescription>Real-time messaging, escalate to SMS/Telegram</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Integrate WebSocket + AI suggestions for triage. Uploads and auto-translated Vietnamese ↔ English support planned.
        </CardContent>
      </Card>
      <DoctorChatPanel />
    </div>
  );
}
