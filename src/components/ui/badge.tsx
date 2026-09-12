import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "gold" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700 border-ink-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  gold: "bg-mustard-50 text-mustard-700 border-mustard-200",
  dark: "bg-white/[0.06] text-white/80 border-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 h-6 text-[11px] font-medium tracking-wide uppercase border rounded-full",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  tone = "success",
  className,
  pulse = true,
}: {
  tone?: "success" | "warning" | "danger" | "muted";
  className?: string;
  pulse?: boolean;
}) {
  const color = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    muted: "bg-ink-400",
  }[tone];
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      {pulse && (
        <span className={cn("absolute inset-0 rounded-full opacity-60 animate-ping-slow", color)} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}
