"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { patientVitals } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function VitalsTrendCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals trend</CardTitle>
        <CardDescription>Heart rate + SpO2</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patientVitals}>
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fill: "currentColor", fontSize: 12 }} />
            <YAxis hide domain={[50, 150]} />
            <Line type="monotone" dataKey="hr" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name="HR" />
            <Line type="monotone" dataKey="spo2" stroke="#22d3ee" dot={false} strokeWidth={2} name="SpO2" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
