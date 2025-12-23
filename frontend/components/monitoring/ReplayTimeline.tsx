"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Segment {
  id: string;
  label: string;
  duration: string;
  hrAvg: number;
  spo2Avg: number;
}

export function ReplayTimeline({ segments }: { segments: Segment[] }) {
  const [position, setPosition] = useState(25);

  return (
    <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Replay mode</p>
        <p>{position}%</p>
      </div>
      <Slider value={[position]} onValueChange={(value) => setPosition(value[0])} />
      <div className="grid gap-4 md:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.id} className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-semibold">{segment.label}</p>
            <p className="text-xs text-muted-foreground">{segment.duration}</p>
            <p className="mt-2 text-xs">HR avg: {segment.hrAvg} bpm</p>
            <p className="text-xs">SpO2 avg: {segment.spo2Avg}%</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="default">Play last 24h</Button>
        <Button variant="outline">Export selection</Button>
        <Button variant="ghost">Mark event</Button>
      </div>
    </div>
  );
}
