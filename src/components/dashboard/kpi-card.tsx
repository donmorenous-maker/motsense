import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

type Tone = "neutral" | "success" | "warning" | "danger" | "gold";
const toneStyle: Record<Tone, string> = {
  neutral: "text-ink-900",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-rose-600",
  gold: "text-mustard-600",
};

export function KpiCard({
  label,
  value,
  delta,
  hint,
  tone = "neutral",
  className,
  compact = false,
  icon: IconEl,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  tone?: Tone;
  className?: string;
  compact?: boolean;
  icon?: typeof Icon.Radio;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div
      className={cn(
        "relative rounded-lg border border-ink-200/70 bg-white p-4",
        "hover:border-ink-900/20 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
        {IconEl && (
          <div className="h-6 w-6 rounded-md border border-ink-200 flex items-center justify-center text-ink-500">
            <IconEl size={12} />
          </div>
        )}
      </div>
      <div
        className={cn(
          "mt-2 font-mono tabular-nums font-semibold tracking-tight animate-count-up",
          toneStyle[tone],
          compact ? "text-[20px]" : "text-[26px]"
        )}
      >
        {value}
      </div>
      <div className="mt-1 flex items-center justify-between text-[11.5px]">
        <span className="text-ink-500">{hint}</span>
        {delta && (
          <span className={cn(positive ? "text-emerald-600" : "text-rose-600", "font-mono")}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
