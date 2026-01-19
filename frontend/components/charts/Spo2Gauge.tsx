"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Spo2GaugeProps {
  live?: boolean;
  value?: number;
  height?: number;
  showStatus?: boolean;
}

export function Spo2Gauge({ live = true, value: externalValue, height = 256, showStatus = true }: Spo2GaugeProps) {
  const [value, setValue] = useState(externalValue || 97);

  useEffect(() => {
    if (!live || externalValue !== undefined) return;

    const interval = setInterval(() => {
      setValue((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(85, Math.min(100, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [live, externalValue]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const data = [{ name: "SpO2", value }];
  
  const getStatusColor = (val: number) => {
    if (val >= 95) return "hsl(var(--primary))";
    if (val >= 90) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  const getStatusText = (val: number) => {
    if (val >= 95) return { text: "Normal", color: "text-primary" };
    if (val >= 90) return { text: "Low", color: "text-yellow-500" };
    return { text: "Critical", color: "text-red-500" };
  };

  const status = getStatusText(value);

  return (
    <div className="flex w-full flex-col items-center" style={{ height: `${height + (showStatus ? 40 : 0)}px` }}>
      <div style={{ height: `${height}px`, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={20} data={data} startAngle={180} endAngle={0}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" fill={getStatusColor(value)} cornerRadius={10} />
            <text x="50%" y="50%" textAnchor="middle" fontSize={36} fontWeight="bold" fill="currentColor">
              {value.toFixed(1)}%
            </text>
            <text x="50%" y="60%" textAnchor="middle" fontSize={14} fill="hsl(var(--muted-foreground))">
              SpO2
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {showStatus && (
        <div className="mt-2 flex items-center gap-2">
          {live && <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>}
          <span className={`text-sm font-semibold ${status.color}`}>{status.text}</span>
        </div>
      )}
    </div>
  );
}
