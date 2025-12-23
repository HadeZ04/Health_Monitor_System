"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export function RealtimeSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["signals", "heartrate"],
    queryFn: () => apiFetch("/signals/heartrate"),
    retry: false
  });

  let status = "Awaiting data";
  if (isLoading) status = "Loading…";
  else if (isError) status = "Offline";
  else if (data) status = "Streaming";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime feed</CardTitle>
        <CardDescription>React Query wired to REST stub</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{status}</p>
        <p className="text-sm text-muted-foreground">Connect logic later.</p>
      </CardContent>
    </Card>
  );
}
