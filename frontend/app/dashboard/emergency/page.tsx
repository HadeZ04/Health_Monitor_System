"use client";

import { useState } from "react";
import { EmergencyRuleBoard } from "@/components/alerts/EmergencyRuleBoard";
import { DeliveryChannelList } from "@/components/alerts/DeliveryChannelList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/layout/PageHero";

export default function EmergencyPage() {
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  const handleTestAlert = async (channel: string) => {
    setTestingChannel(channel);
    setTimeout(() => {
      setTestingChannel(null);
      alert(`Test alert sent via ${channel}!`);
    }, 2000);
  };

  const heroActions = (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary">Trigger Drill</Button>
      <Button variant="outline">Download Runbook</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Emergency Ops"
        title="Emergency Alert System"
        description="Critical vital sign monitoring with multi-channel alert delivery (SMS, Email, Telegram, Zalo)."
        icon="🚨"
        accent="amber"
        badges={["24/7", "Failover", "SLA 3m"]}
        stats={[
          { label: "Alerts This Week", value: "23", helper: "+8% WoW" },
          { label: "Critical Closed", value: "9/9", helper: "100% response" },
          { label: "Active Channels", value: "4", helper: "SMS • Email • Telegram • Zalo" }
        ]}
        actions={heroActions}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">23</CardTitle>
            <CardDescription>Alerts This Week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-500">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-500">9</CardTitle>
            <CardDescription>Critical Alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">All responded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">3m</CardTitle>
            <CardDescription>Avg Response Time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-500">-1m improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">4</CardTitle>
            <CardDescription>Active Channels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">SMS, Email, Telegram, Zalo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EmergencyRuleBoard />
        <DeliveryChannelList />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Rules Configuration</CardTitle>
          <CardDescription>Define threshold-based emergency conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">🔴 Critical: Heart Rate > 150 bpm</p>
                <p className="text-xs text-muted-foreground">Immediate alert via all channels</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Threshold</label>
                <Input type="number" defaultValue="150" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <Input type="number" defaultValue="30" placeholder="seconds" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Channels</label>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-xs">SMS</Badge>
                  <Badge variant="outline" className="text-xs">Email</Badge>
                  <Badge variant="outline" className="text-xs">Tel</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">🔴 Critical: Heart Rate < 40 bpm</p>
                <p className="text-xs text-muted-foreground">Bradycardia detection</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Threshold</label>
                <Input type="number" defaultValue="40" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <Input type="number" defaultValue="30" placeholder="seconds" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Channels</label>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-xs">SMS</Badge>
                  <Badge variant="outline" className="text-xs">Tel</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">🔴 Critical: SpO2 < 88%</p>
                <p className="text-xs text-muted-foreground">Severe hypoxemia alert</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Threshold</label>
                <Input type="number" defaultValue="88" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <Input type="number" defaultValue="20" placeholder="seconds" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Channels</label>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-xs">All</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">⚠️ Warning: AFib Detection</p>
                <p className="text-xs text-muted-foreground">Atrial fibrillation from R-wave pattern</p>
              </div>
              <Badge variant="secondary">Medium</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Confidence</label>
                <Input type="number" defaultValue="85" placeholder="%" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <Input type="number" defaultValue="60" placeholder="seconds" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Channels</label>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-xs">Email</Badge>
                  <Badge variant="outline" className="text-xs">Tel</Badge>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full">+ Add New Alert Rule</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Channel Configuration</CardTitle>
          <CardDescription>Setup and test delivery channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-sm font-semibold">SMS (Twilio)</p>
                    <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={() => handleTestAlert('SMS')}
                disabled={testingChannel === 'SMS'}
              >
                {testingChannel === 'SMS' ? 'Sending...' : 'Test SMS Alert'}
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm font-semibold">Email (SendGrid)</p>
                    <p className="text-xs text-muted-foreground">alerts@healthmonitor.com</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleTestAlert('Email')}
                disabled={testingChannel === 'Email'}
              >
                {testingChannel === 'Email' ? 'Sending...' : 'Test Email Alert'}
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <p className="text-sm font-semibold">Telegram Bot</p>
                    <p className="text-xs text-muted-foreground">@HealthMonitorBot</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleTestAlert('Telegram')}
                disabled={testingChannel === 'Telegram'}
              >
                {testingChannel === 'Telegram' ? 'Sending...' : 'Test Telegram Alert'}
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-sm font-semibold">Zalo Notify</p>
                    <p className="text-xs text-muted-foreground">Zalo OA Integration</p>
                  </div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full">Configure Zalo</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert History & Logs</CardTitle>
          <CardDescription>Recent emergency notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '2 min ago', type: 'Heart Rate High', value: '154 bpm', severity: 'critical', channel: 'SMS + Email', status: 'Acknowledged' },
              { time: '10 min ago', type: 'SpO2 Low', value: '87%', severity: 'critical', channel: 'All Channels', status: 'Resolved' },
              { time: '1 hour ago', type: 'AFib Detected', value: '18% confidence', severity: 'medium', channel: 'Telegram', status: 'Review Needed' },
              { time: '3 hours ago', type: 'Heart Rate Low', value: '38 bpm', severity: 'high', channel: 'SMS', status: 'Resolved' },
            ].map((log, idx) => (
              <div key={idx} className={`flex items-center justify-between rounded-lg border p-3 ${
                log.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : 
                log.severity === 'high' ? 'border-orange-500/20 bg-orange-500/5' : 
                'border-yellow-500/20 bg-yellow-500/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    log.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                    log.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {log.severity === 'critical' ? '🔴' : log.severity === 'high' ? '🟠' : '🟡'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{log.type}</p>
                    <p className="text-xs text-muted-foreground">{log.value} • {log.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{log.channel}</Badge>
                  <p className="text-xs text-muted-foreground">{log.status}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">View All Logs</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Services</CardTitle>
          <CardDescription>Connect external alerting platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'PagerDuty', icon: '📟', status: 'Available', description: 'On-call management' },
              { name: 'OpsGenie', icon: '🔔', status: 'Available', description: 'Incident response' },
              { name: 'Slack', icon: '💬', status: 'Available', description: 'Team notifications' },
            ].map((service, idx) => (
              <div key={idx} className="rounded-lg border p-4">
                <div className="text-3xl mb-2">{service.icon}</div>
                <p className="text-sm font-semibold">{service.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">Connect {service.name}</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
