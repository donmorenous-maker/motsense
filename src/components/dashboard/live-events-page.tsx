"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ConnectionStatusCard } from "@/components/dashboard/connection-status";
import { LiveEventsTable } from "@/components/dashboard/live-events-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { formatCount } from "@/lib/formatters";
import { useDashboardData } from "@/lib/use-dashboard-data";

export function LiveEventsPage() {
  const { events, health, status, error, lastUpdatedAt, isLoading, isRefreshing } = useDashboardData();

  return (
    <>
      <DashboardTopbar
        title="Traffic Events"
        description={`${formatCount(events.length)} loaded from the live API feed.`}
        rightContent={<Badge tone={status === "live" ? "gold" : status === "degraded" ? "warning" : status === "offline" ? "danger" : "neutral"}>{status === "loading" ? "CONNECTING" : status.toUpperCase()}</Badge>}
      />
      <div className="space-y-6 p-5 md:p-6 lg:p-8">
        <Card>
          <CardBody className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-mustard-600">Engineering feed</div>
            <div className="text-[15px] text-ink-700">
              Live traffic events from the Motsense network. Select any row to inspect debug metadata without leaving the page.
            </div>
          </CardBody>
        </Card>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <LiveEventsTable
            events={events}
            status={status}
            isLoading={isLoading}
            error={error}
            title="Latest traffic events"
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
