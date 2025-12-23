"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface PcgDataPoint {
  time: number;
  amplitude: number;
  frequency: number;
}

interface PcgChartProps {
  live?: boolean;
  data?: PcgDataPoint[];
  height?: number;
}

export function PcgChart({ live = true, data: externalData, height = 256 }: PcgChartProps) {
  const [data, setData] = useState<PcgDataPoint[]>(
    externalData || Array.from({ length: 50 }).map((_, idx) => ({
      time: idx,
      amplitude: Math.random() * 80 + 20,
      frequency: Math.random() * 200 + 100
    }))
  );

  useEffect(() => {
    if (!live || externalData) return;

    // Simulate heart sound (S1 and S2 peaks)
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        if (newData.length >= 50) newData.shift();
        
        const t = Date.now() / 100;
        const phase = t % 10;
        let amplitude = 30;
        
        // S1 (lub) - louder, lower frequency
        if (phase < 0.5) amplitude = 90 + Math.random() * 10;
        // S2 (dub) - softer, higher frequency
        else if (phase > 5 && phase < 5.3) amplitude = 70 + Math.random() * 10;
        else amplitude = 30 + Math.random() * 10;
        
        newData.push({
          time: newData[newData.length - 1].time + 1,
          amplitude,
          frequency: amplitude > 60 ? 150 + Math.random() * 50 : 200 + Math.random() * 100
        });
        return newData;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [live, externalData]);

  useEffect(() => {
    if (externalData) {
      setData(externalData);
    }
  }, [externalData]);

  return (
    <div className="w-full space-y-2" style={{ height: `${height + 40}px` }}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-sm font-semibold text-foreground">Phonocardiogram (Heart Sounds)</span>
        {live && <span className="flex items-center gap-2 text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>Live</span>}
      </div>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 120]} stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'dB', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="text-sm">Amplitude: {payload[0].value?.toFixed(1)} dB</p>
                      <p className="text-sm text-muted-foreground">Freq: {payload[0].payload.frequency.toFixed(0)} Hz</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amplitude" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
