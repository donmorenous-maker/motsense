import { notFound } from "next/navigation";
import Link from "next/link";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { devices, events, trafficActivity24h } from "@/data/mock";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { StatusDot } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return devices.map((d) => ({ id: d.id }));
}

const tabs = ["Overview", "Traffic", "Health", "Connectivity", "Configuration", "Logs"];

export default function DevicePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const d = devices.find((x) => x.id === params.id);
  if (!d) notFound();
  const active = searchParams.tab ?? "Overview";
  const recentEvents = events.filter((e) => e.deviceId === d.id).slice(0, 10);

  return (
    <>
      <DashboardTopbar title={`Device · ${d.id}`} description={d.name} />
      <div className="p-5 md:p-6 lg:p-8 space-y-5">
        {/* Breadcrumb & summary */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
            <Link href="/app/devices" className="hover:text-ink-900">Devices</Link>
            <Icon.ChevronRight size={12} />
            <span className="text-ink-900 font-mono">{d.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot tone={d.status === "online" ? "success" : d.status === "warning" ? "warning" : "danger"} />
            <span className="text-[13px] capitalize text-ink-700">{d.status}</span>
            <span className="text-[12px] text-ink-500 font-mono">
              · last seen {d.lastSeenSec} sec ago
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-md border border-ink-200 bg-white p-1 w-fit">
          {tabs.map((t) => (
            <Link
              key={t}
              href={`/app/devices/${d.id}?tab=${t}`}
              className={cn(
                "px-3 h-8 rounded text-[12.5px] transition-colors flex items-center",
                active === t ? "bg-ink-950 text-white" : "text-ink-600 hover:text-ink-900"
              )}
            >
              {t}
            </Link>
          ))}
        </div>

        {active === "Overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <KpiCard label="Vehicles Today" value={d.vehiclesToday.toLocaleString()} icon={Icon.Car} />
              <KpiCard label="Avg Speed" value={`${d.avgSpeedMph.toFixed(1)} mph`} icon={Icon.Gauge} />
              <KpiCard label="Battery" value={`${d.voltage.toFixed(2)} V`} icon={Icon.Battery} tone={d.battery > 30 ? "success" : "warning"} />
              <KpiCard label="Temperature" value={`${d.temperature.toFixed(1)} °C`} icon={Icon.Thermo} />
              <KpiCard label="RSSI" value={`${d.rssi} dBm`} icon={Icon.Antenna} />
              <KpiCard label="SNR" value={`${d.snr.toFixed(1)} dB`} icon={Icon.Wifi} />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Traffic activity · last 24h</CardTitle>
                  <div className="text-[11px] font-mono text-ink-400 uppercase tracking-widest">
                    vehicles / min
                  </div>
                </CardHeader>
                <div className="p-4 pt-2">
                  <ActivityChart data={trafficActivity24h} height={220} />
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Device metadata</CardTitle>
                </CardHeader>
                <div className="p-5 grid gap-4">
                  <MetaRow label="Device ID" value={d.id} />
                  <MetaRow label="DevEUI" value={d.devEUI} />
                  <MetaRow label="Firmware" value={d.firmware} />
                  <MetaRow label="Installed" value={d.installedAt} />
                  <MetaRow label="Coordinates" value={`${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`} />
                  <MetaRow label="Gateway" value={d.gateway} />
                  <MetaRow label="Frame counter" value={String(d.frameCounter)} />
                  <MetaRow label="Last uplink" value={`${d.lastSeenSec} sec ago`} />
                </div>
              </Card>
            </div>
          </>
        )}

        {active === "Traffic" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent events</CardTitle>
              <div className="text-[11.5px] text-ink-500">Last {recentEvents.length} vehicle detections</div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 border-b border-ink-200/70">
                  <tr className="text-left">
                    <th className="px-5 py-2">Time</th>
                    <th className="px-5 py-2">Direction</th>
                    <th className="px-5 py-2 text-right">Speed</th>
                    <th className="px-5 py-2">Class</th>
                    <th className="px-5 py-2 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                  {recentEvents.map((e) => (
                    <tr key={e.id}>
                      <td className="px-5 py-2.5 text-ink-500">{new Date(e.timestamp).toISOString().slice(11, 19)}Z</td>
                      <td className="px-5 py-2.5 text-ink-700">{e.direction}</td>
                      <td className="px-5 py-2.5 text-right text-ink-900">{e.speedKmh.toFixed(1)} km/h</td>
                      <td className="px-5 py-2.5 text-ink-700">{e.vehicleClass}</td>
                      <td className="px-5 py-2.5 text-right text-ink-900">{e.confidence.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {active === "Health" && (
          <div className="grid gap-5 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Battery</CardTitle></CardHeader>
              <div className="p-5">
                <div className="text-[28px] font-mono tabular-nums text-ink-900">{d.voltage.toFixed(2)} V</div>
                <div className="text-[12px] text-ink-500 mt-1">{d.battery}% · projected life 8 months</div>
                <div className="mt-4 h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${d.battery}%` }} />
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader><CardTitle>Temperature</CardTitle></CardHeader>
              <div className="p-5">
                <div className="text-[28px] font-mono tabular-nums text-ink-900">{d.temperature.toFixed(1)} °C</div>
                <div className="text-[12px] text-ink-500 mt-1">Nominal · within operating range</div>
              </div>
            </Card>
            <Card>
              <CardHeader><CardTitle>Uptime</CardTitle></CardHeader>
              <div className="p-5">
                <div className="text-[28px] font-mono tabular-nums text-ink-900">99.6%</div>
                <div className="text-[12px] text-ink-500 mt-1">30-day rolling · 2 h downtime</div>
              </div>
            </Card>
          </div>
        )}

        {active === "Connectivity" && (
          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Radio</CardTitle></CardHeader>
              <div className="p-5 space-y-3 font-mono text-[13px]">
                <MetaRow label="RSSI" value={`${d.rssi} dBm`} />
                <MetaRow label="SNR" value={`${d.snr.toFixed(1)} dB`} />
                <MetaRow label="Data rate" value="DR3 · SF9BW125" />
                <MetaRow label="ADR" value="Enabled" />
                <MetaRow label="Frame counter" value={String(d.frameCounter)} />
              </div>
            </Card>
            <Card>
              <CardHeader><CardTitle>Packet statistics</CardTitle></CardHeader>
              <div className="p-5 space-y-3 font-mono text-[13px]">
                <MetaRow label="Uplinks / 24h" value="1,152" />
                <MetaRow label="Downlinks / 24h" value="8" />
                <MetaRow label="Packet loss" value="0.4%" />
                <MetaRow label="Avg confidence" value="0.91" />
                <MetaRow label="Vehicle detections" value={d.vehiclesToday.toLocaleString()} />
              </div>
            </Card>
          </div>
        )}

        {active === "Configuration" && (
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <div className="p-5 space-y-3 font-mono text-[13px]">
              <MetaRow label="Reporting interval" value="60 s" />
              <MetaRow label="Detection threshold" value="Auto" />
              <MetaRow label="Classification model" value="motsense-cls-v3" />
              <MetaRow label="Speed calibration" value="US-33 · lane 2" />
              <MetaRow label="Firmware channel" value="stable" />
              <MetaRow label="Timezone" value="America/New_York" />
            </div>
          </Card>
        )}

        {active === "Logs" && (
          <Card>
            <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
            <div className="p-5 font-mono text-[12px] leading-[1.9] bg-ink-950 text-ink-100 rounded-b-xl">
              <div><span className="text-ink-400">2026-09-12 18:32:04Z</span> <span className="text-emerald-300">INFO</span> uplink fcnt={d.frameCounter} rssi={d.rssi} snr={d.snr}</div>
              <div><span className="text-ink-400">2026-09-12 18:31:58Z</span> <span className="text-emerald-300">INFO</span> detection speed=56.7 class=SUV conf=0.93</div>
              <div><span className="text-ink-400">2026-09-12 18:29:12Z</span> <span className="text-mustard-400">WARN</span> jitter high · dropping stale sample</div>
              <div><span className="text-ink-400">2026-09-12 18:29:11Z</span> <span className="text-emerald-300">INFO</span> detection speed=48.1 class=Sedan conf=0.87</div>
              <div><span className="text-ink-400">2026-09-12 18:24:03Z</span> <span className="text-emerald-300">INFO</span> keepalive · battery={d.voltage.toFixed(2)}V temp={d.temperature.toFixed(1)}C</div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="font-mono tabular-nums text-ink-900">{value}</div>
    </div>
  );
}
