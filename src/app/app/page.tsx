import { DashboardTopbar } from "@/components/dashboard/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { NetworkMap } from "@/components/dashboard/network-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/badge";
import {
  networkKpis,
  trafficActivity24h,
  events,
  devices,
  gateways,
  alerts,
} from "@/data/mock";
import { formatDecimal, formatNumber } from "@/lib/utils";
import { Icon } from "@/components/icons";
import Link from "next/link";

export const metadata = { title: "Overview" };

export default function OverviewPage() {
  const recent = events.slice(0, 8);
  const activeAlerts = alerts.filter((a) => a.status !== "resolved");

  return (
    <>
      <DashboardTopbar title="Network Overview" description="Columbus, OH · Live" />
      <div className="p-5 md:p-6 lg:p-8 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Vehicles Today" value={formatNumber(networkKpis.vehiclesToday)} delta="+4.2%" icon={Icon.Car} />
          <KpiCard label="Vehicles / Min" value={formatDecimal(networkKpis.vehiclesPerMinute)} delta="+1.1" icon={Icon.Activity} />
          <KpiCard label="Avg Speed" value={`${formatDecimal(networkKpis.averageSpeedMph)} mph`} icon={Icon.Gauge} />
          <KpiCard label="Active Sensors" value={`${networkKpis.activeSensors} / ${networkKpis.totalSensors}`} tone="success" icon={Icon.Radio} />
          <KpiCard label="Gateways" value={`${networkKpis.gatewaysOnline} / ${networkKpis.totalGateways}`} tone="success" icon={Icon.Antenna} />
          <KpiCard label="Active Alerts" value={String(networkKpis.activeAlerts)} tone="warning" icon={Icon.Bell} />
        </div>

        <div className="grid gap-5 lg:grid-cols-6">
          {/* Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <div>
                <CardTitle>Traffic activity</CardTitle>
                <div className="text-[11.5px] text-ink-500 mt-0.5">Last 24 hours · vehicles / minute</div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-ink-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mustard-500" /> live</span>
                <span>peak 08:00 · 17:00</span>
              </div>
            </CardHeader>
            <div className="p-4 pt-2">
              <ActivityChart data={trafficActivity24h} height={220} />
            </div>
          </Card>

          {/* System health */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System health</CardTitle>
              <div className="text-[11px] font-mono uppercase tracking-widest text-ink-400">live</div>
            </CardHeader>
            <div className="p-5 space-y-4">
              {[
                { label: "Ingest pipeline", value: "42 ms", tone: "success" as const },
                { label: "Event bus", value: "8.4k msg/min", tone: "success" as const },
                { label: "Webhook dispatcher", value: "99.6% success", tone: "success" as const },
                { label: "API gateway", value: "42 ms p50", tone: "success" as const },
                { label: "MQTT broker", value: "connected · 3 gws", tone: "success" as const },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-ink-800">
                    <StatusDot tone={r.tone} />
                    {r.label}
                  </div>
                  <div className="text-[12.5px] font-mono text-ink-500 tabular-nums">{r.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-6">
          {/* Map */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Road network</CardTitle>
              <div className="flex items-center gap-3 text-[11px] text-ink-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />online</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />warning</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />offline</span>
                <Link href="/app/map" className="text-mustard-600 hover:text-mustard-500 ml-2 inline-flex items-center gap-1">
                  Open live map <Icon.ArrowUpRight size={12} />
                </Link>
              </div>
            </CardHeader>
            <div className="p-4">
              <NetworkMap devices={devices} gateways={gateways} height={340} />
            </div>
          </Card>

          {/* Active alerts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active alerts</CardTitle>
              <Link href="/app/alerts" className="text-[12px] text-mustard-600 hover:text-mustard-500 inline-flex items-center gap-1">
                All alerts <Icon.ArrowUpRight size={12} />
              </Link>
            </CardHeader>
            <ul className="divide-y divide-ink-200/60">
              {activeAlerts.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        a.severity === "critical"
                          ? "mt-1 h-2 w-2 rounded-full bg-rose-500"
                          : a.severity === "warning"
                          ? "mt-1 h-2 w-2 rounded-full bg-amber-500"
                          : "mt-1 h-2 w-2 rounded-full bg-sky-500"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-ink-900">{a.title}</div>
                      <div className="text-[11.5px] text-ink-500 font-mono">{a.target}</div>
                    </div>
                    <span
                      className={
                        "text-[10.5px] uppercase tracking-widest font-mono " +
                        (a.status === "open" ? "text-rose-600" : "text-amber-600")
                      }
                    >
                      {a.status}
                    </span>
                  </div>
                </li>
              ))}
              {activeAlerts.length === 0 && (
                <li className="px-5 py-6 text-center text-[13px] text-ink-500">All clear.</li>
              )}
            </ul>
          </Card>
        </div>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent traffic events</CardTitle>
            <Link href="/app/events" className="text-[12px] text-mustard-600 hover:text-mustard-500 inline-flex items-center gap-1">
              All events <Icon.ArrowUpRight size={12} />
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 border-b border-ink-200/70">
                <tr className="text-left">
                  <th className="px-5 py-2 font-medium">Time</th>
                  <th className="px-5 py-2 font-medium">Device</th>
                  <th className="px-5 py-2 font-medium">Direction</th>
                  <th className="px-5 py-2 py-2 font-medium text-right">Speed</th>
                  <th className="px-5 py-2 font-medium">Class</th>
                  <th className="px-5 py-2 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                {recent.map((e) => (
                  <tr key={e.id} className="hover:bg-ink-50/60">
                    <td className="px-5 py-2.5 text-ink-500">
                      {new Date(e.timestamp).toISOString().slice(11, 19)}Z
                    </td>
                    <td className="px-5 py-2.5 text-ink-900">{e.deviceId}</td>
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
      </div>
    </>
  );
}
