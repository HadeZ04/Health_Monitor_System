import { DeviceControlPanel } from "@/components/iot/DeviceControlPanel";
import { FirmwareQueueCard } from "@/components/iot/FirmwareQueueCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/PageHero";
import { firmwareQueue } from "@/lib/data";

export default function IotControlPage() {
  const deploying = firmwareQueue.filter((job) => job.status === "deploying").length;
  const queued = firmwareQueue.filter((job) => job.status === "queued").length;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Fleet Ops"
        title="IoT Control Center"
        description="OTA firmware updates, device provisioning, and fleet-wide configuration management."
        icon="🛰️"
        accent="cyan"
        badges={["OTA", "Provisioning", "Security"]}
        stats={[
          { label: "Deploying", value: `${deploying}`, helper: "In-flight packages" },
          { label: "Queued", value: `${queued}`, helper: "Scheduled windows" },
          { label: "TLS Status", value: "Enabled", helper: "MQTT + HTTPS" }
        ]}
        actions={<Button variant="secondary">+ Schedule OTA</Button>}
      />

      <DeviceControlPanel />
      
      <FirmwareQueueCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>OTA Update Schedule</CardTitle>
            <CardDescription>Firmware deployment timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: "Tonight 02:00 AM", version: "v1.0.6", devices: 3, status: "scheduled" },
              { time: "Tomorrow 03:00 AM", version: "v1.0.5", devices: 2, status: "pending" },
              { time: "Nov 18, 02:00 AM", version: "v1.1.0", devices: 5, status: "planned" },
            ].map((update, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-semibold">{update.version}</p>
                  <p className="text-xs text-muted-foreground">{update.time} • {update.devices} devices</p>
                </div>
                <Badge variant={update.status === 'scheduled' ? 'default' : 'secondary'}>
                  {update.status}
                </Badge>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">+ Schedule New Update</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Provisioning</CardTitle>
            <CardDescription>Onboard new sensors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-sm font-semibold">Add New Device</p>
              <p className="text-xs text-muted-foreground mt-1">Scan QR code or enter device ID</p>
              <Button className="mt-4">Start Provisioning</Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold">Provisioning Steps:</p>
              <ol className="space-y-1 text-xs text-muted-foreground pl-4">
                <li>1. Power on the device</li>
                <li>2. Connect to WiFi/Bluetooth</li>
                <li>3. Register device ID in system</li>
                <li>4. Configure MQTT topics</li>
                <li>5. Test connectivity</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet-wide Configuration</CardTitle>
          <CardDescription>Apply settings to multiple devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Sampling Rate</p>
              <p className="mt-2 text-xs text-muted-foreground">Set data collection frequency</p>
              <div className="mt-3 flex items-center gap-2">
                <input type="number" className="w-20 rounded border bg-background px-2 py-1 text-sm" defaultValue="100" />
                <span className="text-xs">Hz</span>
              </div>
              <Button size="sm" className="mt-3 w-full" variant="outline">Apply to All</Button>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Power Mode</p>
              <p className="mt-2 text-xs text-muted-foreground">Balance performance and battery</p>
              <select className="mt-3 w-full rounded border bg-background px-2 py-1 text-sm">
                <option>High Performance</option>
                <option>Balanced</option>
                <option>Power Saver</option>
              </select>
              <Button size="sm" className="mt-3 w-full" variant="outline">Apply to All</Button>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-semibold">Auto-sync Interval</p>
              <p className="mt-2 text-xs text-muted-foreground">Cloud data synchronization</p>
              <div className="mt-3 flex items-center gap-2">
                <input type="number" className="w-20 rounded border bg-background px-2 py-1 text-sm" defaultValue="15" />
                <span className="text-xs">min</span>
              </div>
              <Button size="sm" className="mt-3 w-full" variant="outline">Apply to All</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Security</CardTitle>
          <CardDescription>Authentication and encryption settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">TLS Encryption</p>
                <p className="text-xs text-muted-foreground">Secure MQTT connections</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Device Certificates</p>
                <p className="text-xs text-muted-foreground">X.509 authentication</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Firmware Signature</p>
                <p className="text-xs text-muted-foreground">Signed OTA updates</p>
              </div>
              <Badge className="bg-green-500">Verified</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold">Access Control</p>
                <p className="text-xs text-muted-foreground">Role-based permissions</p>
              </div>
              <Badge className="bg-green-500">Enforced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
