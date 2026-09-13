"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityChart, BarChart, SegmentedBar } from "@/components/dashboard/activity-chart";
import {
  trafficActivity24h,
  weeklyVolume,
  speedDistribution,
  classificationBreakdown,
  directionDistribution,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

const tabs = [
  "Traffic Volume",
  "Speed",
  "Vehicle Classification",
  "Direction",
  "Time of Day",
  "Road Usage",
] as const;

type Tab = typeof tabs[number];

const ranges = ["Today", "Yesterday", "7 days", "30 days", "Custom"] as const;
const comparisons = ["Today vs Yesterday", "This Week vs Last Week", "Custom"] as const;

export default function AnalyticsPage() {
  const [active, setActive] = useState<Tab>("Traffic Volume");
  const [range, setRange] = useState<typeof ranges[number]>("7 days");
  const [comparison, setComparison] = useState<typeof comparisons[number]>("This Week vs Last Week");

  return (
    <>
      <DashboardTopbar title="Analytics" description="Traffic intelligence across your network" />
      <div className="p-5 md:p-6 lg:p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-ink-200 bg-white p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={cn(
                  "px-3 h-8 rounded text-[12.5px] transition-colors",
                  active === t
                    ? "bg-ink-950 text-white"
                    : "text-ink-600 hover:text-ink-900 hover:bg-ink-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RangeSelect value={range} options={ranges as unknown as string[]} onChange={(v) => setRange(v as any)} label="Range" />
            <RangeSelect
              value={comparison}
              options={comparisons as unknown as string[]}
              onChange={(v) => setComparison(v as any)}
              label="Compare"
            />
          </div>
        </div>

        {/* Content */}
        {active === "Traffic Volume" && (
          <div className="grid gap-5 lg:grid-cols-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <div>
                  <CardTitle>Vehicles per hour · today</CardTitle>
                  <div className="text-[11.5px] text-ink-500 mt-0.5">{comparison}</div>
                </div>
                <Legend />
              </CardHeader>
              <div className="p-4 pt-2">
                <ActivityChart data={trafficActivity24h} height={240} />
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily volume</CardTitle>
                <div className="text-[11px] font-mono uppercase tracking-widest text-ink-400">last 7d</div>
              </CardHeader>
              <div className="p-4 pt-2">
                <BarChart data={weeklyVolume} height={240} />
              </div>
            </Card>
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <div className="p-5 grid gap-4 md:grid-cols-4">
                <Stat label="This week" value="79,310" delta="+3.8%" />
                <Stat label="Peak hour" value="17:00 · Fri" delta="1,120 veh" />
                <Stat label="Slowest hour" value="03:00 · Sun" delta="41 veh" />
                <Stat label="Busiest sensor" value="RR-014" delta="1,284 today" />
              </div>
            </Card>
          </div>
        )}

        {active === "Speed" && (
          <div className="grid gap-5 lg:grid-cols-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Speed distribution</CardTitle>
                <div className="text-[11.5px] text-ink-500">mph · all sensors · {range}</div>
              </CardHeader>
              <div className="p-4 pt-2">
                <BarChart data={speedDistribution} height={260} valueSuffix="%" />
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Percentiles</CardTitle>
              </CardHeader>
              <div className="p-5 space-y-4 font-mono">
                {[
                  ["p10", "28 mph"],
                  ["p50 (median)", "47 mph"],
                  ["p85", "58 mph"],
                  ["p95", "63 mph"],
                  ["max", "84 mph"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-500 uppercase tracking-widest text-[10.5px]">{k}</span>
                    <span className="text-ink-900 tabular-nums">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {active === "Vehicle Classification" && (
          <div className="grid gap-5 lg:grid-cols-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Vehicle classification</CardTitle>
                <div className="text-[11.5px] text-ink-500">share · {range}</div>
              </CardHeader>
              <div className="p-5">
                <SegmentedBar segments={classificationBreakdown} />
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fleet mix</CardTitle>
              </CardHeader>
              <div className="p-5 grid gap-3">
                {classificationBreakdown.slice(0, 4).map((c) => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-[13px] text-ink-700">{c.label}</span>
                    <span className="text-[13px] font-mono text-ink-900 tabular-nums">{c.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {active === "Direction" && (
          <Card>
            <CardHeader>
              <CardTitle>Direction distribution</CardTitle>
              <div className="text-[11.5px] text-ink-500">share · {range}</div>
            </CardHeader>
            <div className="p-5">
              <SegmentedBar segments={directionDistribution} />
            </div>
          </Card>
        )}

        {active === "Time of Day" && (
          <Card>
            <CardHeader>
              <CardTitle>Peak traffic times</CardTitle>
              <div className="text-[11.5px] text-ink-500">last 24h · vehicles/min</div>
            </CardHeader>
            <div className="p-4 pt-2">
              <ActivityChart data={trafficActivity24h} height={280} />
            </div>
          </Card>
        )}

        {active === "Road Usage" && (
          <Card>
            <CardHeader>
              <CardTitle>Road usage</CardTitle>
              <div className="text-[11.5px] text-ink-500">rolling · {range}</div>
            </CardHeader>
            <div className="p-5 divide-y divide-ink-200/60">
              {[
                { road: "US-33", value: 32410, share: 41 },
                { road: "I-270", value: 21830, share: 27 },
                { road: "SR-315", value: 12290, share: 15 },
                { road: "SR-161", value: 7420, share: 9 },
                { road: "US-23", value: 4210, share: 5 },
                { road: "I-670", value: 3150, share: 3 },
              ].map((r) => (
                <div key={r.road} className="py-2.5 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-2 font-mono text-[13px] text-ink-900">{r.road}</div>
                  <div className="col-span-7">
                    <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                      <div className="h-full bg-mustard-500" style={{ width: `${r.share * 2}%` }} />
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-mono text-[13px] text-ink-900 tabular-nums">
                    {r.value.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right font-mono text-[12px] text-ink-500">{r.share}%</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-ink-200/70 p-4">
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 text-[22px] font-semibold font-mono tabular-nums text-ink-900">{value}</div>
      {delta && <div className="text-[11.5px] font-mono text-emerald-600 mt-0.5">{delta}</div>}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[11px]">
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mustard-500" /> current</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-400" /> comparison</span>
    </div>
  );
}

function RangeSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
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
        className="appearance-none h-9 pl-[70px] pr-8 rounded-md border border-ink-200 bg-white text-[12.5px] text-ink-900 focus:outline-none focus:border-mustard-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon.ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
    </div>
  );
}
