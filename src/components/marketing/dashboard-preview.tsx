import { networkKpis, trafficActivity24h, events, devices } from "@/data/mock";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { NetworkMap } from "@/components/dashboard/network-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/badge";
import { formatDecimal, formatNumber } from "@/lib/utils";
import { Icon } from "@/components/icons";

export function DashboardPreview() {
  const recent = events.slice(0, 5);
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white shadow-card overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 h-11 border-b border-ink-200/70 bg-ink-50/60">
        <div className="flex items-center gap-2 text-[12.5px] text-ink-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400/60" />
            <span className="h-2 w-2 rounded-full bg-amber-400/60" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
          </div>
          <span className="ml-2 font-mono text-[11.5px] text-ink-500">app.motsense.com / overview</span>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-ink-500">
          <StatusDot tone="success" />
          Live · Columbus, OH
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Vehicles Today" value={formatNumber(networkKpis.vehiclesToday)} delta="+4.2%" />
          <KpiCard label="Vehicles / Min" value={formatDecimal(networkKpis.vehiclesPerMinute)} delta="+1.1" />
          <KpiCard label="Avg Speed" value={`${formatDecimal(networkKpis.averageSpeedMph)} mph`} />
          <KpiCard
            label="Active Sensors"
            value={`${networkKpis.activeSensors} / ${networkKpis.totalSensors}`}
            tone="success"
          />
          <KpiCard label="Gateways" value={`${networkKpis.gatewaysOnline} / ${networkKpis.totalGateways}`} tone="success" />
          <KpiCard label="Active Alerts" value={String(networkKpis.activeAlerts)} tone="warning" />
        </div>

        {/* Chart + Map */}
        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Traffic activity · last 24h</CardTitle>
              <div className="text-[11px] font-mono text-ink-400 uppercase tracking-widest">
                vehicles / min
              </div>
            </CardHeader>
            <div className="p-4 pt-2">
              <ActivityChart data={trafficActivity24h} height={180} />
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Road network</CardTitle>
              <div className="flex items-center gap-3 text-[11px] text-ink-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />online</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />warning</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />offline</span>
              </div>
            </CardHeader>
            <div className="p-4 pt-2">
              <NetworkMap devices={devices} gateways={[]} height={180} />
            </div>
          </Card>
        </div>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent traffic events</CardTitle>
            <div className="text-[11px] font-mono text-ink-400 uppercase tracking-widest">
              live stream
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 border-b border-ink-200/70">
                <tr className="text-left">
                  <th className="px-5 py-2 font-medium">Time</th>
                  <th className="px-5 py-2 font-medium">Device</th>
                  <th className="px-5 py-2 font-medium">Direction</th>
                  <th className="px-5 py-2 font-medium text-right">Speed</th>
                  <th className="px-5 py-2 font-medium">Class</th>
                  <th className="px-5 py-2 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                {recent.map((e) => (
                  <tr key={e.id} className="hover:bg-ink-50/60">
                    <td className="px-5 py-2.5 text-ink-500">{new Date(e.timestamp).toISOString().slice(11, 19)}Z</td>
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
    </div>
  );
}
