import { Badge, StatusDot } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/formatters";
import type { ConnectionState } from "@/lib/use-dashboard-data";

const STATUS_COPY: Record<
  ConnectionState,
  {
    label: string;
    tone: "success" | "warning" | "danger" | "muted";
    badgeTone: "gold" | "warning" | "danger" | "neutral";
    summary: string;
  }
> = {
  loading: {
    label: "CONNECTING",
    tone: "muted",
    badgeTone: "neutral",
    summary: "Loading live dashboard data.",
  },
  live: {
    label: "LIVE",
    tone: "success",
    badgeTone: "gold",
    summary: "API polling is healthy.",
  },
  degraded: {
    label: "DEGRADED",
    tone: "warning",
    badgeTone: "warning",
    summary: "Showing the last valid data after a refresh error.",
  },
  offline: {
    label: "OFFLINE",
    tone: "danger",
    badgeTone: "danger",
    summary: "Initial dashboard data is unavailable.",
  },
};

export function ConnectionStatusCard({
  status,
  lastUpdatedAt,
  error,
  isRefreshing,
  service,
}: {
  status: ConnectionState;
  lastUpdatedAt: string | null;
  error: string | null;
  isRefreshing: boolean;
  service?: string | null;
}) {
  const copy = STATUS_COPY[status];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Connection status</CardTitle>
          <div className="mt-0.5 text-[11.5px] text-ink-500">Polling /api/events and /api/summary every 5 seconds.</div>
        </div>
        <Badge tone={copy.badgeTone}>{copy.label}</Badge>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-2 text-[13px] text-ink-800">
          <StatusDot tone={copy.tone} pulse={status === "live"} />
          <span>{copy.summary}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 text-[12.5px]">
          <div className="rounded-lg border border-ink-200/70 bg-ink-50 px-3 py-2">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">Last update</div>
            <div className="mt-1 font-mono text-ink-900">{formatTime(lastUpdatedAt)}</div>
          </div>
          <div className="rounded-lg border border-ink-200/70 bg-ink-50 px-3 py-2">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">Live indicator</div>
            <div className="mt-1 font-mono text-ink-900">
              {isRefreshing ? "Refreshing" : status === "live" ? "Receiving data" : "Waiting for recovery"}
            </div>
          </div>
        </div>
        {(service || error) && (
          <div className="rounded-lg border border-ink-200/70 bg-white px-3 py-2 text-[12px] text-ink-600">
            {service ? <span className="font-mono text-ink-900">{service}</span> : "API"}{" "}
            {error ? `· ${error}` : "· responding"}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
