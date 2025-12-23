import { ExportPanel } from "@/components/monitoring/ExportPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

const templates = [
  { id: "pdf", name: "PDF diagnostic", frequency: "Weekly" },
  { id: "excel", name: "Excel vitals", frequency: "Daily" },
  { id: "ehr", name: "EHR sync", frequency: "Realtime" }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Compliance Suite"
        title="Reports & Exports"
        description="Generate PDF diagnostics, Excel vitals, and real-time EHR sync packages with embedded AI commentary."
        icon="📑"
        badges={["PDF", "Excel", "FHIR"]}
        stats={[
          { label: "Templates", value: `${templates.length}`, helper: "Reusable layouts" },
          { label: "Exports Today", value: "12", helper: "Multi-format" },
          { label: "Data Retention", value: "180d", helper: "Encrypted archive" }
        ]}
        actions={<Button variant="secondary">Schedule Weekly Digest</Button>}
      />
      <ExportPanel />
      <Card>
        <CardHeader>
          <CardTitle>Report templates</CardTitle>
          <CardDescription>Attach AI summaries + doctor signatures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {templates.map((template) => (
            <div key={template.id} className="rounded-xl border border-dashed border-white/10 p-3">
              <p className="font-semibold">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.frequency}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
