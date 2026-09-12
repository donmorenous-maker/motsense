import { cn } from "@/lib/utils";

export function Logomark({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M5 22 L10 11 L16 20 L22 11 L27 22"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="20" r="2.2" fill="#C69A2C" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "auto",
  showTag = false,
}: {
  className?: string;
  variant?: "auto" | "light" | "dark";
  showTag?: boolean;
}) {
  const textColor =
    variant === "dark" ? "text-white" : variant === "light" ? "text-ink-900" : "text-current";
  return (
    <span className={cn("inline-flex items-center gap-2.5 leading-none", className)}>
      <Logomark className={textColor} />
      <span className={cn("flex flex-col leading-none", textColor)}>
        <span className="text-[17px] font-semibold tracking-[-0.02em]">Motsense</span>
        {showTag && (
          <span className="text-[10px] tracking-[0.18em] uppercase text-mustard-500 mt-1">
            Roads That Sense.
          </span>
        )}
      </span>
    </span>
  );
}
