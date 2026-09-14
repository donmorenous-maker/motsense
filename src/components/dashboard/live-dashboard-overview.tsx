"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ConnectionStatusCard } from "@/components/dashboard/connection-status";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { LiveEventsTable } from "@/components/dashboard/live-events-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import { formatCount, formatDeviceName, formatSpeed, formatTime, formatVehicleClass } from "@/lib/formatters";
import { useDashboardData } from "@/lib/use-dashboard-data";

export function LiveDashboardOverview() {
  const { events, summary, health, status, error, lastUpdatedAt, isLoading, isRefreshing } = useDashboardData();
  const latestEvent = events[0] ?? null;

  return (
    <>
      <DashboardTopbar
        title="Road Intelligence"
        description="Real-time traffic intelligence received from the Motsense sensor network."
        rightContent={<Badge tone={status === "live" ? "gold" : status === "degraded" ? "warning" : status === "offline" ? "danger" : "neutral"}>{status === "loading" ? "CONNECTING" : status.toUpperCase()}</Badge>}
      />
      <div className="space-y-6 p-5 md:p-6 lg:p-8">
        <Card className="overflow-hidden">
          <CardBody className="relative p-0">
            <div className="absolute inset-0 bg-grid bg-grid-light opacity-40" />
            <div className="relative grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
              <div className="space-y-5">
                <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-mustard-600">MOTSENSE</div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink-950 sm:text-[40px]">
                    Roads That Sense.
                  </h1>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-ink-600">
                    Real-time traffic intelligence received from the Motsense sensor network.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-[12px] text-ink-500">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/70 bg-white px-3 py-1.5">
                    <Icon.Activity size={13} className="text-mustard-600" />
                    Connection {status === "loading" ? "connecting" : status}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/70 bg-white px-3 py-1.5">
                    <Icon.Radio size={13} className="text-mustard-600" />
                    Last update {formatTime(lastUpdatedAt)}
                  </span>
                  {latestEvent && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/70 bg-white px-3 py-1.5">
                      <Icon.Car size={13} className="text-mustard-600" />
                      Latest {formatDeviceName(latestEvent)} · {formatSpeed(latestEvent.speed_kmh)}
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-ink-200/70 bg-white/90 p-5 shadow-card">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">Latest event</div>
                {latestEvent ? (
                  <div className="mt-4 space-y-3">
                    <div className="text-[22px] font-semibold tracking-tight text-ink-950">
                      {formatVehicleClass(latestEvent.vehicle_class)}
                    </div>
                    <div className="space-y-2 text-[13px] text-ink-600">
                      <div className="flex items-center justify-between gap-4">
                        <span>Device</span>
                        <span className="font-mono text-ink-900">{formatDeviceName(latestEvent)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Speed</span>
                        <span className="font-mono text-ink-900">{formatSpeed(latestEvent.speed_kmh)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Received</span>
                        <span className="font-mono text-ink-900">{formatTime(latestEvent.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-[13px] text-ink-500">
                    {isLoading ? "Waiting for live traffic data." : "No traffic events available yet."}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Recent Events" value={formatCount(summary?.total_events)} icon={Icon.Activity} />
          <KpiCard label="Average Speed" value={formatSpeed(summary?.average_speed)} icon={Icon.Gauge} />
          <KpiCard
            label="Last Vehicle"
            value={formatVehicleClass(summary?.last_vehicle)}
            compact
            icon={Icon.Car}
          />
          <KpiCard label="Active Devices" value={formatCount(summary?.active_devices)} icon={Icon.Radio} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <LiveEventsTable
            events={events}
            status={status}
            isLoading={isLoading}
            error={error}
            limit={10}
            title="Recent traffic events"
            showViewAll
          />
          <ConnectionStatusCard
            status={status}
            lastUpdatedAt={lastUpdatedAt}
            error={error}
            isRefreshing={isRefreshing}
            service={health?.service}
          />
        </div>
      </div>
    </>
  );
}
