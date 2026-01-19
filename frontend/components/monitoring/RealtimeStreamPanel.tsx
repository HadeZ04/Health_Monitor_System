"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket, useMqttStatus } from "@/lib/websocket";

type Stream = {
  id: string;
  label: string;
  protocol: string;
  status: string;
  uptime: string;
  throughput: string;
};

export function RealtimeStreamPanel({ streams: externalStreams }: { streams?: Stream[] }) {
  const { isConnected: wsConnected } = useWebSocket();
  const { isConnected: mqttConnected, uptime: mqttUptime, throughput: mqttThroughput } = useMqttStatus();
  const [wsUptime, setWsUptime] = useState("0h 0m");
  const [wsThroughput, setWsThroughput] = useState("0 kbps");

  useEffect(() => {
    if (!wsConnected) return;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      setWsUptime(`${hours}h ${minutes}m`);
      setWsThroughput(`${(Math.random() * 500 + 200).toFixed(0)} kbps`);
    }, 5000);

    return () => clearInterval(interval);
  }, [wsConnected]);

  const streams = externalStreams || [
    {
      id: "ws",
      label: "WebSocket",
      protocol: "wss://",
      status: wsConnected ? "connected" : "disconnected",
      uptime: wsUptime,
      throughput: wsThroughput
    },
    {
      id: "mqtt",
      label: "MQTT",
      protocol: "mqtt://",
      status: mqttConnected ? "connected" : "disconnected",
      uptime: mqttUptime,
      throughput: mqttThroughput
    },
    {
      id: "backup",
      label: "Backup Stream",
      protocol: "https://",
      status: "standby",
      uptime: "-",
      throughput: "-"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime streaming</CardTitle>
        <CardDescription>WebSocket + MQTT dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {streams.map((stream) => (
          <div key={stream.id} className="flex items-center justify-between rounded-xl border border-dashed border-primary/30 p-4">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${stream.status === 'connected' ? 'bg-green-500 animate-pulse' : stream.status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-semibold">{stream.label}</p>
                <p className="text-xs text-muted-foreground">{stream.protocol}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={stream.status === 'connected' ? 'default' : stream.status === 'standby' ? 'secondary' : 'destructive'}>
                {stream.status}
              </Badge>
              <p className="mt-1 text-xs text-muted-foreground">Uptime: {stream.uptime}</p>
              <p className="text-xs text-muted-foreground">Throughput: {stream.throughput}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
