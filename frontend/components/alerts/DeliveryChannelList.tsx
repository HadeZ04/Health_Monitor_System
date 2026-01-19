import { deliveryChannels } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function DeliveryChannelList() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6">
      <p className="text-sm font-semibold">Delivery channels</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {deliveryChannels.map((channel) => (
          <div key={channel.id} className="rounded-xl border border-white/20 bg-background/70 p-4">
            <p className="text-sm font-semibold">{channel.label}</p>
            <Badge variant={channel.status === "connected" ? "success" : "outline"}>{channel.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
