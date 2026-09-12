"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { Logomark } from "@/components/logo";
import { StatusDot } from "@/components/ui/badge";
import { useState } from "react";

type Item = { label: string; href: string; icon: keyof typeof Icon };

const groups: { label?: string; items: Item[] }[] = [
  {
    items: [{ label: "Overview", href: "/app", icon: "Grid" }],
  },
  {
    label: "Traffic",
    items: [
      { label: "Live Map", href: "/app/map", icon: "Map" },
      { label: "Traffic Events", href: "/app/events", icon: "Activity" },
      { label: "Analytics", href: "/app/analytics", icon: "Gauge" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Devices", href: "/app/devices", icon: "Radio" },
      { label: "Gateways", href: "/app/gateways", icon: "Antenna" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Alerts", href: "/app/alerts", icon: "Bell" },
      { label: "API & Integrations", href: "/app/api", icon: "Api" },
    ],
  },
  {
    items: [{ label: "Settings", href: "/app/settings", icon: "Settings" }],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(false);
  return (
    <aside className="hidden md:flex md:flex-col w-[248px] shrink-0 border-r border-white/10 bg-ink-950 text-ink-200">
      <div className="h-14 px-4 flex items-center border-b border-white/10">
        <Link href="/app" className="flex items-center gap-2.5 text-white">
          <Logomark size={20} />
          <span className="text-[15.5px] font-semibold tracking-[-0.02em]">Motsense</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.label && (
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-ink-500">
                {g.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const Ic = Icon[it.icon];
                const active =
                  it.href === "/app" ? pathname === "/app" : pathname.startsWith(it.href);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "group relative flex items-center gap-2.5 h-8.5 py-2 px-3 rounded-md text-[13.5px] transition-colors",
                        active
                          ? "bg-white/[0.08] text-white"
                          : "text-ink-300 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      {active && (
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-mustard-500" />
                      )}
                      <Ic size={15} className={active ? "text-mustard-500" : ""} />
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-2">
        <button
          onClick={() => setOrgOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-2.5 h-11 rounded-md hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-md bg-mustard-500/20 border border-mustard-500/40 text-mustard-400 flex items-center justify-center font-mono text-[11px]">
              CO
            </div>
            <div className="min-w-0 text-left">
              <div className="text-[12.5px] text-white truncate">City of Columbus</div>
              <div className="text-[10.5px] text-ink-400 truncate">Ops · US915</div>
            </div>
          </div>
          <Icon.ChevronDown size={13} className="text-ink-400" />
        </button>
        {orgOpen && (
          <div className="rounded-md border border-white/10 bg-ink-900 p-1">
            {["City of Columbus", "OhioDOT Region 6", "Demo Org"].map((o) => (
              <div key={o} className="px-2.5 py-1.5 text-[12.5px] rounded hover:bg-white/[0.06] cursor-pointer">
                {o}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md">
          <div className="h-7 w-7 rounded-full bg-ink-800 border border-white/10 flex items-center justify-center text-[11px] font-mono">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] text-white truncate">Alex Rivera</div>
            <div className="text-[10.5px] text-ink-400 flex items-center gap-1">
              <StatusDot tone="success" pulse={false} className="h-1.5 w-1.5" /> Owner
            </div>
          </div>
          <Link href="/" className="text-ink-400 hover:text-white p-1" title="Sign out">
            <Icon.Logout size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
