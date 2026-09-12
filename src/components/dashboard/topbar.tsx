import { Icon } from "@/components/icons";
import { StatusDot } from "@/components/ui/badge";
import Link from "next/link";
import { Logomark } from "@/components/logo";

export function DashboardTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/85 backdrop-blur border-b border-ink-200/70 flex items-center gap-4 px-5">
      <div className="md:hidden flex items-center gap-2">
        <Link href="/app" className="flex items-center gap-2 text-ink-900">
          <Logomark size={18} />
          <span className="text-[14px] font-semibold">Motsense</span>
        </Link>
      </div>
      <div className="hidden md:block min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[15px] font-semibold text-ink-900 truncate">{title}</h1>
          {description && (
            <span className="text-[12px] text-ink-500 truncate hidden lg:inline">· {description}</span>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 text-[11.5px] text-ink-600 px-2 h-8 rounded-md border border-ink-200 bg-white">
          <StatusDot tone="success" />
          <span>Live</span>
          <span className="text-ink-400">·</span>
          <span className="font-mono text-ink-500">latency 42ms</span>
        </div>

        <div className="hidden md:flex items-center gap-2 h-8 w-64 rounded-md border border-ink-200 bg-white px-2.5 text-ink-500">
          <Icon.Search size={13} />
          <input
            placeholder="Search devices, events, roads…"
            className="bg-transparent outline-none text-[13px] text-ink-800 placeholder:text-ink-400 flex-1"
          />
          <span className="text-[10.5px] font-mono text-ink-400 border border-ink-200 rounded px-1">⌘K</span>
        </div>

        <button className="relative h-8 w-8 rounded-md border border-ink-200 flex items-center justify-center text-ink-700 hover:bg-ink-50">
          <Icon.Bell size={14} />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-mustard-500 text-ink-950 text-[10px] font-mono flex items-center justify-center">
            2
          </span>
        </button>
      </div>
    </header>
  );
}
