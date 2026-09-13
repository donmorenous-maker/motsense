"use client";

import { useMemo, useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { alerts } from "@/data/mock";
import { Icon } from "@/components/icons";
import { cn, formatDateTime } from "@/lib/utils";

const severities = ["all", "critical", "warning", "info"] as const;
const statuses = ["all", "open", "acknowledged", "resolved"] as const;

const sevColor = {
  critical: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-sky-500",
};
const sevBadge = {
  critical: "bg-rose-50 text-rose-700 border-rose-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};
const statusBadge = {
  open: "bg-ink-950 text-white",
  acknowledged: "bg-mustard-100 text-mustard-800 border border-mustard-200",
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function AlertsPage() {
  const [sev, setSev] = useState<string>("all");
  const [st, setSt] = useState<string>("all");
  const filtered = useMemo(
    () => alerts.filter((a) => (sev === "all" || a.severity === sev) && (st === "all" || a.status === st)),
    [sev, st]
  );

  const counts = {
    critical: alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length,
    warning: alerts.filter((a) => a.severity === "warning" && a.status !== "resolved").length,
    info: alerts.filter((a) => a.severity === "info" && a.status !== "resolved").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <>
      <DashboardTopbar title="Alerts" description={`${filtered.length} matching`} />
      <div className="p-5 md:p-6 lg:p-8 space-y-5">
        {/* Severity summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SumCard label="Critical" value={counts.critical} tone="bg-rose-500" />
          <SumCard label="Warning" value={counts.warning} tone="bg-amber-500" />
          <SumCard label="Info" value={counts.info} tone="bg-sky-500" />
          <SumCard label="Resolved · 7d" value={counts.resolved} tone="bg-emerald-500" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <TabRow value={sev} setValue={setSev} options={severities as any} />
          <TabRow value={st} setValue={setSt} options={statuses as any} />
          <div className="ml-auto text-[12.5px] text-ink-500">
            Showing <span className="text-ink-900 font-mono">{filtered.length}</span> alerts
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl border border-ink-200/70 bg-white shadow-card divide-y divide-ink-200/60">
          {filtered.map((a) => (
            <div key={a.id} className="p-5 grid grid-cols-12 items-start gap-4">
              <div className="col-span-12 md:col-span-7 flex items-start gap-3">
                <span className={cn("mt-1.5 h-2.5 w-2.5 rounded-full", sevColor[a.severity])} />
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-ink-900">{a.title}</div>
                  <div className="text-[12.5px] text-ink-500 mt-0.5">{a.message}</div>
                  <div className="mt-1 text-[11.5px] font-mono text-ink-500">{a.target}</div>
                </div>
              </div>
              <div className="col-span-6 md:col-span-3 flex items-center gap-2 text-[11.5px]">
                <span className={cn("uppercase tracking-widest font-mono px-2 h-6 flex items-center rounded-full border", sevBadge[a.severity])}>
                  {a.severity}
                </span>
                <span className={cn("uppercase tracking-widest font-mono px-2 h-6 flex items-center rounded-full", statusBadge[a.status])}>
                  {a.status}
                </span>
              </div>
              <div className="col-span-6 md:col-span-2 text-right">
                <div className="text-[11.5px] font-mono text-ink-500">
                  {formatDateTime(a.createdAt)}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-mustard-600 hover:text-mustard-500 cursor-pointer">
                  Investigate <Icon.ArrowUpRight size={11} />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-16 text-center text-ink-500">
              <div className="mx-auto h-10 w-10 rounded-full border border-ink-200 flex items-center justify-center mb-3 text-ink-400">
                <Icon.Check size={16} />
              </div>
              No alerts match your filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SumCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", tone)} />
        <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      </div>
      <div className="mt-3 text-[28px] font-semibold font-mono tabular-nums text-ink-900">{value}</div>
    </div>
  );
}

function TabRow({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-ink-200 bg-white p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => setValue(o)}
          className={cn(
            "px-3 h-7 rounded text-[12px] capitalize transition-colors",
            value === o ? "bg-ink-950 text-white" : "text-ink-600 hover:text-ink-900"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
