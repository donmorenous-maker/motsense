"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { Logomark } from "@/components/logo";

type Item = { label: string; href: string; icon: keyof typeof Icon };

const groups: { label?: string; items: Item[] }[] = [
  {
    items: [
      { label: "Road Intelligence", href: "/app", icon: "Grid" },
      { label: "Traffic Events", href: "/app/events", icon: "Activity" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
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

      <div className="border-t border-white/10 p-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-mustard-400">Roads That Sense.</div>
          <div className="mt-2 text-[12.5px] leading-relaxed text-ink-300">
            Production dashboard frontend using relative API paths for Traefik-backed deployment.
          </div>
        </div>
      </div>
    </aside>
  );
}
