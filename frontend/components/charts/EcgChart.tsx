"use client";

import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface EcgDataPoint {
  time: number;
  value: number;
}

interface EcgChartProps {
  live?: boolean;
  data?: EcgDataPoint[];
  showGrid?: boolean;
  height?: number;
}

export function EcgChart({ live = true, data: externalData, showGrid = false, height = 256 }: EcgChartProps) {
  const [data, setData] = useState<EcgDataPoint[]>(
    externalData || Array.from({ length: 100 }).map((_, idx) => ({ time: idx, value: 0 }))
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!live || externalData) return;

    // Simulate real-time ECG data (in production, connect to WebSocket)
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        newData.shift();
        const t = Date.now() / 100;
        // Simulate ECG waveform: P wave, QRS complex, T wave
        let value = 0;
        const phase = t % 10;
        if (phase < 1) value = Math.sin(phase * Math.PI) * 0.3; // P wave
        else if (phase < 2) value = 0;
        else if (phase < 2.3) value = Math.sin((phase - 2) * Math.PI * 10) * 0.5; // Q
        else if (phase < 2.5) value = Math.sin((phase - 2.3) * Math.PI * 5) * 2; // R peak
        else if (phase < 2.7) value = -Math.sin((phase - 2.5) * Math.PI * 5) * 0.8; // S
        else if (phase < 3.5) value = 0;
        else if (phase < 5) value = Math.sin((phase - 3.5) * Math.PI / 1.5) * 0.5; // T wave
        
        newData.push({ time: newData[newData.length - 1].time + 1, value: value + (Math.random() - 0.5) * 0.05 });
        return newData;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [live, externalData]);

  useEffect(() => {
    if (externalData) {
      setData(externalData);
    }
  }, [externalData]);

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
          <XAxis dataKey="time" hide />
          <YAxis domain={[-1.5, 2.5]} hide />
          <Tooltip
            cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
             content={({ active, payload }) => {
               if (active && payload && payload.length) {
                 const rawValue = payload[0].value;
                 const numericValue =
                   typeof rawValue === "number" ? rawValue : Number(rawValue);
                 const displayValue = Number.isFinite(numericValue)
                   ? numericValue.toFixed(3)
                   : "N/A";

                 return (
                   <div className="rounded-lg border bg-background p-2 shadow-lg">
                    <p className="text-sm">Value: {displayValue} mV</p>
                   </div>
                 );
               }
               return null;
             }}
          />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
