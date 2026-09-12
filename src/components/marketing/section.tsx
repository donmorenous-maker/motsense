import { cn } from "@/lib/utils";
import Link from "next/link";

export function SectionKicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-mustard-600 font-medium",
        className
      )}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-mustard-500" />
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className,
  as: As = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <As
      className={cn(
        "text-display-md font-semibold tracking-[-0.02em] text-ink-900 text-balance",
        className
      )}
    >
      {children}
    </As>
  );
}

export function SectionLede({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[16.5px] text-ink-500 max-w-2xl leading-relaxed text-balance", className)}>
      {children}
    </p>
  );
}

export function Section({
  id,
  className,
  children,
  dark = false,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28 border-b",
        dark ? "bg-ink-950 text-ink-100 border-white/5" : "border-ink-200/60",
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

export function InlineLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-mustard-600 hover:text-mustard-500 border-b border-mustard-500/30 hover:border-mustard-500 transition-colors font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
}
