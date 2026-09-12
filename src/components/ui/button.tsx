import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-mustard-500 text-ink-950 hover:bg-mustard-400 border border-mustard-500 hover:border-mustard-400 shadow-sm",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 border border-ink-900",
  outline:
    "bg-transparent text-ink-900 border border-ink-200 hover:border-ink-900 hover:bg-white",
  ghost:
    "bg-transparent text-ink-700 hover:text-ink-900 hover:bg-ink-100 border border-transparent",
  dark:
    "bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-md gap-1.5",
  md: "h-10 px-4 text-[14px] rounded-md gap-2",
  lg: "h-12 px-6 text-[15px] rounded-md gap-2",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonProps extends BaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  target,
  rel,
}: LinkProps) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
