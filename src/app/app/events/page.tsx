"use client";

import { useMemo, useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { events, roads } from "@/data/mock";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";
import { StatusDot } from "@/components/ui/badge";

const CLASSES = ["Sedan", "SUV", "Pickup", "Truck", "Motorcycle", "Bus", "Van"];
const DIRS = ["Eastbound", "Westbound", "Northbound", "Southbound"];

export default function EventsPage() {
  const [road, setRoad] = useState("all");
  const [dir, setDir] = useState("all");
  const [vclass, setVclass] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const perPage = 15;

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (road !== "all" && e.road !== road) return false;
      if (dir !== "all" && e.direction !== dir) return false;
      if (vclass !== "all" && e.vehicleClass !== vclass) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !e.deviceId.toLowerCase().includes(q) &&
          !e.road.toLowerCase().includes(q) &&
          !e.vehicleClass.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [road, dir, vclass, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const p = Math.min(page, pages);
  const rows = filtered.slice((p - 1) * perPage, p * perPage);
  const openEvent = filtered.find((e) => e.id === openId) ?? null;

  return (
    <>
      <DashboardTopbar title="Traffic Events" description={`${filtered.length.toLocaleString()} matching events`} />
      <div className="p-5 md:p-6 lg:p-8 space-y-5">
        {/* Filter bar */}
        <div className="rounded-xl border border-ink-200/70 bg-white shadow-card">
          <div className="p-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 h-9 px-2.5 rounded-md border border-ink-200 bg-white flex-1 min-w-[220px]">
              <Icon.Search size={14} className="text-ink-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search device, road, class…"
                className="flex-1 bg-transparent outline-none text-[13px] text-ink-900 placeholder:text-ink-400"
              />
            </div>
            <Select label="Date range" value="Last 24h" />
            <Select
              label="Road"
              value={road === "all" ? "All" : road}
              options={["all", ...roads]}
              onChange={(v) => { setRoad(v); setPage(1); }}
            />
            <Select
              label="Direction"
              value={dir === "all" ? "All" : dir}
              options={["all", ...DIRS]}
              onChange={(v) => { setDir(v); setPage(1); }}
            />
            <Select
              label="Class"
              value={vclass === "all" ? "All" : vclass}
              options={["all", ...CLASSES]}
              onChange={(v) => { setVclass(v); setPage(1); }}
            />
            <Select label="Speed" value="Any" />
            <Select label="Confidence" value="≥ 0.60" />
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon.Filter size={13} /> Save view
              </Button>
              <Button variant="secondary" size="sm">
                <Icon.Download size={13} /> Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-ink-200/70 bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 border-b border-ink-200/70">
                <tr className="text-left">
                  {["Timestamp", "Sensor", "Road", "Direction", "Speed", "Class", "Confidence", "Vibration"].map((h, i) => (
                    <th key={h} className={cn("px-5 py-3 font-medium", i >= 4 && i !== 5 && "text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                {rows.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setOpenId(e.id)}
                    className="hover:bg-ink-50/70 cursor-pointer"
                  >
                    <td className="px-5 py-2.5 text-ink-500 whitespace-nowrap">
                      {new Date(e.timestamp).toISOString().replace("T", " ").slice(0, 19)}Z
                    </td>
                    <td className="px-5 py-2.5 text-ink-900">{e.deviceId}</td>
                    <td className="px-5 py-2.5 text-ink-700">{e.road}</td>
                    <td className="px-5 py-2.5 text-ink-700">{e.direction}</td>
                    <td className="px-5 py-2.5 text-right text-ink-900">
                      {e.speedKmh.toFixed(1)} km/h
                    </td>
                    <td className="px-5 py-2.5 text-ink-700">{e.vehicleClass}</td>
                    <td className="px-5 py-2.5 text-right">
                      <ConfidenceBar value={e.confidence} />
                    </td>
                    <td className="px-5 py-2.5 text-right text-ink-500">{e.vibrationEnergy}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-ink-500 font-sans">
                      <div className="mx-auto h-10 w-10 rounded-full border border-ink-200 flex items-center justify-center mb-3 text-ink-400">
                        <Icon.Filter size={14} />
                      </div>
                      No events match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 h-12 border-t border-ink-200/70 text-[12.5px] text-ink-500">
            <div>
              Showing {rows.length ? (p - 1) * perPage + 1 : 0}–{Math.min(p * perPage, filtered.length)} of{" "}
              <span className="text-ink-900 font-mono">{filtered.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={p === 1}
                onClick={() => setPage(p - 1)}
                className="h-8 w-8 rounded-md border border-ink-200 disabled:opacity-40 hover:bg-ink-50 flex items-center justify-center"
              >
                <Icon.ChevronRight size={13} className="rotate-180" />
              </button>
              <span className="px-2 font-mono">
                {p} / {pages}
              </span>
              <button
                disabled={p === pages}
                onClick={() => setPage(p + 1)}
                className="h-8 w-8 rounded-md border border-ink-200 disabled:opacity-40 hover:bg-ink-50 flex items-center justify-center"
              >
                <Icon.ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event drawer */}
      {openEvent && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setOpenId(null)}>
          <div className="flex-1 bg-black/30" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border-l border-ink-200/70 shadow-xl overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-ink-200/70 flex items-start justify-between">
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                  Traffic event
                </div>
                <div className="mt-1 font-mono text-[15px] text-ink-900">{openEvent.id}</div>
                <div className="text-[12px] text-ink-500 mt-1">{formatDateTime(openEvent.timestamp)}</div>
              </div>
              <button onClick={() => setOpenId(null)} className="text-ink-400 hover:text-ink-900">
                <Icon.X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5 text-[13.5px]">
              {[
                ["Device", openEvent.deviceId],
                ["Road", openEvent.road],
                ["Direction", openEvent.direction],
                ["Vehicle class", openEvent.vehicleClass],
                ["Speed", `${openEvent.speedKmh.toFixed(1)} km/h`],
                ["Speed (mph)", `${openEvent.speedMph.toFixed(1)} mph`],
                ["Confidence", openEvent.confidence.toFixed(2)],
                ["Vibration energy", String(openEvent.vibrationEnergy)],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{k}</div>
                  <div className="mt-1 font-mono tabular-nums text-ink-900">{v}</div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 mb-2">
                Raw payload
              </div>
              <pre className="rounded-md bg-ink-950 text-ink-100 p-3 text-[12px] font-mono overflow-auto leading-[1.7]">
{`{
  "device_id": "${openEvent.deviceId}",
  "timestamp": "${openEvent.timestamp}",
  "vehicle_detected": true,
  "direction": "${openEvent.direction.toLowerCase()}",
  "speed_kmh": ${openEvent.speedKmh},
  "vehicle_class": "${openEvent.vehicleClass}",
  "confidence": ${openEvent.confidence},
  "vibration_energy": ${openEvent.vibrationEnergy}
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options?: string[];
  onChange?: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[10.5px] font-mono uppercase tracking-widest text-ink-400">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!options}
        className="appearance-none h-9 pl-[70px] pr-8 rounded-md border border-ink-200 bg-white text-[12.5px] text-ink-900 focus:outline-none focus:border-mustard-500 disabled:opacity-70"
      >
        {options ? (
          options.map((o) => (
            <option key={o} value={o}>
              {o === "all" ? "All" : o}
            </option>
          ))
        ) : (
          <option>{value}</option>
        )}
      </select>
      <Icon.ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 0.9 ? "bg-emerald-500" : value >= 0.75 ? "bg-mustard-500" : "bg-rose-400";
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <div className="w-16 h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div className={cn("h-full", color)} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="text-ink-900 w-10 text-right">{value.toFixed(2)}</span>
    </div>
  );
}
