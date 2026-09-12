"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { devices } from "@/data/mock";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusTones: Record<string, "success" | "warning" | "danger" | "muted"> = {
  online: "success",
  warning: "warning",
  offline: "danger",
  error: "danger",
  idle: "muted",
};

export default function DevicesPage() {
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return devices.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (q && !d.id.toLowerCase().includes(q.toLowerCase()) && !d.road.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [status, q]);

  return (
    <>
      <DashboardTopbar title="Devices" description={`${rows.length} sensors`} />
      <div className="p-5 md:p-6 lg:p-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 h-9 px-2.5 rounded-md border border-ink-200 bg-white flex-1 min-w-[220px]">
            <Icon.Search size={14} className="text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search devices…"
              className="flex-1 bg-transparent outline-none text-[13px] text-ink-900 placeholder:text-ink-400"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-ink-200 bg-white p-1">
            {["all", "online", "warning", "offline"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3 h-7 rounded text-[12px] capitalize transition-colors",
                  status === s ? "bg-ink-950 text-white" : "text-ink-600 hover:text-ink-900"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Icon.Download size={13} /> Export</Button>
          <Button variant="secondary" size="sm"><Icon.Plus size={13} /> Add device</Button>
        </div>

        <div className="rounded-xl border border-ink-200/70 bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 border-b border-ink-200/70">
                <tr className="text-left">
                  {["Device", "Status", "Road", "Battery", "Temp", "Last Seen", "Firmware", "Gateway", "Vehicles Today", ""].map((h) => (
                    <th key={h} className="px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                {rows.map((d) => (
                  <tr key={d.id} className="hover:bg-ink-50/70">
                    <td className="px-5 py-3">
                      <Link href={`/app/devices/${d.id}`} className="text-ink-900 hover:underline">
                        {d.id}
                      </Link>
                      <div className="text-[11px] text-ink-500 font-mono">{d.name}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="inline-flex items-center gap-2 text-ink-700 capitalize">
                        <StatusDot tone={statusTones[d.status]} />
                        {d.status}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{d.road}</td>
                    <td className="px-5 py-3">
                      <BatteryBar percent={d.battery} />
                    </td>
                    <td className="px-5 py-3 text-ink-700">{d.temperature.toFixed(1)}°C</td>
                    <td className="px-5 py-3 text-ink-500">
                      {d.status === "offline"
                        ? `${Math.round(d.lastSeenSec / 60)} min ago`
                        : `${d.lastSeenSec} sec ago`}
                    </td>
                    <td className="px-5 py-3 text-ink-700">{d.firmware}</td>
                    <td className="px-5 py-3 text-ink-700">{d.gateway}</td>
                    <td className="px-5 py-3 text-ink-900">{d.vehiclesToday.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/app/devices/${d.id}`} className="text-ink-400 hover:text-ink-900">
                        <Icon.ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function BatteryBar({ percent }: { percent: number }) {
  const color =
    percent >= 60 ? "bg-emerald-500" : percent >= 25 ? "bg-mustard-500" : percent > 0 ? "bg-rose-500" : "bg-ink-300";
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-14 h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div className={cn("h-full", color)} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-ink-900 tabular-nums w-8">{percent}%</span>
    </div>
  );
}
