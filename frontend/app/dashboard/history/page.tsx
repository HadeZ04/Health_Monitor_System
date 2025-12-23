"use client";

import { useState } from "react";
import { historyRecords } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/layout/PageHero";

export default function HistoryPage() {
  const [query, setQuery] = useState("");

  const filtered = historyRecords.filter((record) => record.signal.toLowerCase().includes(query.toLowerCase()));
  const normalRecords = historyRecords.filter((record) => record.status === "Normal").length;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Audit Trail"
        title="Bio-signal History"
        description="Search historical ECG, SpO2, HR, and PPG events with AI annotations."
        icon="🗂️"
        accent="purple"
        badges={["Immutable logs", "AI labels"]}
        stats={[
          { label: "Records Indexed", value: `${historyRecords.length}`, helper: "Last 30 days" },
          { label: "Normal", value: `${normalRecords}`, helper: "Ready for archive" },
          { label: "Needs Review", value: `${historyRecords.length - normalRecords}`, helper: "Escalations" }
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Bio-signal history</CardTitle>
          <CardDescription>Filter by metric or date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Search signal</label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ECG" />
            </div>
            <div>
              <label className="text-sm font-medium">From date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">To date</label>
              <Input type="date" />
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Signal</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-3 font-medium">{record.signal}</td>
                    <td className="p-3">{record.date}</td>
                    <td className="p-3 text-muted-foreground">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
