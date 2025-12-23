"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface PpgDataPoint {
  time: number;
  value: number;
}

interface PpgChartProps {
  live?: boolean;
  data?: PpgDataPoint[];
  height?: number;
}

export function PpgChart({ live = true, data: externalData, height = 256 }: PpgChartProps) {
  const [data, setData] = useState<PpgDataPoint[]>(
    externalData || Array.from({ length: 100 }).map((_, idx) => ({ time: idx, value: 0 }))
  );

  useEffect(() => {
    if (!live || externalData) return;

    // Simulate PPG waveform (photoplethysmography)
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        newData.shift();
        
        const t = Date.now() / 100;
        const phase = t % 10;
        
        // PPG waveform: systolic peak, dicrotic notch, diastolic peak
        let value = 0;
        if (phase < 2) {
          // Systolic upstroke and peak
          value = Math.sin((phase / 2) * Math.PI) * 1;
        } else if (phase < 3) {
          // Dicrotic notch
          value = 0.7 - (phase - 2) * 0.3;
        } else if (phase < 4.5) {
          // Diastolic peak
          value = 0.4 + Math.sin((phase - 3) * Math.PI) * 0.2;
        } else {
          // Baseline
          value = 0.1;
        }
        
        newData.push({ time: newData[newData.length - 1].time + 1, value: value + (Math.random() - 0.5) * 0.03 });
        return newData;
      });
    }, 25);

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
        <span className="text-sm font-semibold text-foreground">Photoplethysmogram (Blood Volume Pulse)</span>
        {live && <span className="flex items-center gap-2 text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>Live</span>}
      </div>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" hide />
            <YAxis domain={[-0.2, 1.2]} hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-lg">
                      <p className="text-sm">Amplitude: {payload[0].value?.toFixed(3)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
