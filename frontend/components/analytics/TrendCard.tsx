"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendCardProps {
  title: string;
  description: string;
  data: { label: string; value: number }[];
  stroke?: string;
}

export function TrendCard({ title, description, data, stroke = "hsl(var(--primary))" }: TrendCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tick={{ fill: "currentColor", fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke={stroke} fill={`${stroke}30`} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
