import { DashboardTopbar } from "@/components/dashboard/topbar";
import { gateways, devices } from "@/data/mock";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart, BarChart } from "@/components/dashboard/activity-chart";
import { StatusDot } from "@/components/ui/badge";
import { Icon } from "@/components/icons";

export const metadata = { title: "Gateways" };

// Generate simple charts data
const packetsPerMinute = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  value: Math.round(240 + Math.sin(i / 3) * 90 + (i > 8 && i < 20 ? 120 : 0)),
}));

const rssiDist = [
  { bucket: "-70", value: 4 },
  { bucket: "-80", value: 11 },
  { bucket: "-90", value: 22 },
  { bucket: "-100", value: 8 },
  { bucket: "-110", value: 2 },
];

const snrDist = [
  { bucket: "-2", value: 3 },
  { bucket: "0", value: 8 },
  { bucket: "3", value: 18 },
  { bucket: "6", value: 12 },
  { bucket: "9", value: 5 },
];

export default function GatewaysPage() {
  const featured = gateways[0];
  const connectedDevices = devices.filter((d) => d.gateway === featured.name).slice(0, 8);

  return (
    <>
      <DashboardTopbar title="Gateways" description={`${gateways.length} WisGate gateways · Columbus, OH`} />
      <div className="p-5 md:p-6 lg:p-8 space-y-6">
        {/* Gateway grid */}
        <div className="grid gap-3 md:grid-cols-3">
          {gateways.map((g) => (
            <Card key={g.id}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                      Gateway
                    </div>
                    <div className="mt-1 font-mono text-[15px] font-semibold text-ink-900">{g.name}</div>
                    <div className="text-[12px] text-ink-500">{g.city}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[12px] text-emerald-600">
                    <StatusDot tone="success" /> Online
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[12.5px]">
                  <MetaCol label="Last heartbeat" value={`${g.lastHeartbeatSec} sec ago`} />
                  <MetaCol label="Connected" value={`${g.connectedDevices} devices`} />
                  <MetaCol label="Packets today" value={g.packetsToday.toLocaleString()} />
                  <MetaCol label="MQTT" value={g.mqtt} />
                  <MetaCol label="Region" value={g.region} />
                  <MetaCol label="Uptime" value="99.9%" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured detail */}
        <div className="grid gap-5 lg:grid-cols-6">
          <div className="lg:col-span-6 flex items-center justify-between">
            <div>
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                Featured
              </div>
              <h2 className="text-[18px] font-semibold text-ink-900 mt-1 font-mono">{featured.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-[12px] text-emerald-600 px-2 h-7 rounded-md border border-emerald-200 bg-emerald-50">
                <Icon.Wifi size={12} /> MQTT connected
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Packets today" value={featured.packetsToday.toLocaleString()} icon={Icon.Activity} />
            <KpiCard label="Connected devices" value={String(featured.connectedDevices)} icon={Icon.Radio} />
            <KpiCard label="Region" value={featured.region} icon={Icon.Globe} />
            <KpiCard label="Uptime · 30d" value="99.9%" icon={Icon.Shield} tone="success" />
          </div>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Packets per minute · last 24h</CardTitle>
            </CardHeader>
            <div className="p-4 pt-2">
              <ActivityChart data={packetsPerMinute} height={220} />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>RSSI distribution</CardTitle>
              <div className="text-[11px] font-mono uppercase tracking-widest text-ink-400">dBm</div>
            </CardHeader>
            <div className="p-4 pt-2">
              <BarChart data={rssiDist} height={220} />
            </div>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>SNR distribution</CardTitle>
              <div className="text-[11px] font-mono uppercase tracking-widest text-ink-400">dB</div>
            </CardHeader>
            <div className="p-4 pt-2">
              <BarChart data={snrDist} height={200} />
            </div>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Connected devices</CardTitle>
              <div className="text-[11.5px] text-ink-500">Top 8 · by uplinks</div>
            </CardHeader>
            <div className="divide-y divide-ink-200/60">
              {connectedDevices.map((d) => (
                <div key={d.id} className="px-5 py-2.5 flex items-center justify-between text-[13px] font-mono">
                  <div className="flex items-center gap-2">
                    <StatusDot tone={d.status === "online" ? "success" : "warning"} pulse={false} />
                    <span className="text-ink-900">{d.id}</span>
                  </div>
                  <div className="text-ink-500 tabular-nums">
                    {d.rssi} dBm · {d.snr.toFixed(1)} dB
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 text-[13px] text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
