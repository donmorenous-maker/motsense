import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: As = "div",
  dark,
}: {
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  dark?: boolean;
}) {
  return (
    <As
      className={cn(
        "rounded-xl border shadow-card",
        dark
          ? "bg-ink-900 border-white/10 text-white"
          : "bg-white border-ink-200/70",
        className
      )}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  className,
  children,
  border = true,
}: {
  className?: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 flex items-center justify-between gap-4",
        border && "border-b border-ink-200/70 dark:border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-[14px] font-semibold tracking-tight text-ink-900 dark:text-white", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-[13px] text-ink-500 dark:text-ink-300", className)}>{children}</p>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
