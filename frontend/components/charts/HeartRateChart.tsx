"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface HrDataPoint {
  time: string;
  bpm: number;
  timestamp?: number;
}

interface HeartRateChartProps {
  live?: boolean;
  data?: HrDataPoint[];
  timeRange?: "1h" | "6h" | "24h" | "7d";
  height?: number;
}

export function HeartRateChart({ live = true, data: externalData, timeRange = "1h", height = 256 }: HeartRateChartProps) {
  const [data, setData] = useState<HrDataPoint[]>(
    externalData || Array.from({ length: 12 }).map((_, idx) => ({
      time: `${idx + 1}m`,
      bpm: 70 + Math.round(Math.sin(idx) * 8),
      timestamp: Date.now() - (12 - idx) * 60000
    }))
  );

  useEffect(() => {
    if (!live || externalData) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        if (newData.length >= 60) newData.shift();
        const lastBpm = newData[newData.length - 1]?.bpm || 75;
        const change = (Math.random() - 0.5) * 10;
        const newBpm = Math.max(50, Math.min(150, lastBpm + change));
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          bpm: Math.round(newBpm),
          timestamp: Date.now()
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [live, externalData]);

  useEffect(() => {
    if (externalData) {
      setData(externalData);
    }
  }, [externalData]);

  const averageBpm = Math.round(data.reduce((sum, d) => sum + d.bpm, 0) / data.length);
  const maxBpm = Math.max(...data.map(d => d.bpm));
  const minBpm = Math.min(...data.map(d => d.bpm));

  return (
    <div className="w-full space-y-2" style={{ height: `${height + 40}px` }}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <span className="text-muted-foreground">Avg: <span className="font-semibold text-foreground">{averageBpm} bpm</span></span>
          <span className="text-muted-foreground">Min: <span className="font-semibold text-green-500">{minBpm}</span></span>
          <span className="text-muted-foreground">Max: <span className="font-semibold text-red-500">{maxBpm}</span></span>
        </div>
        {live && <span className="flex items-center gap-2 text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>Live</span>}
      </div>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[40, 160]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="text-sm font-semibold">{payload[0].payload.time}</p>
                      <p className="text-sm text-primary">{payload[0].value} bpm</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="bpm" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
