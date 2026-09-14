import { Icon } from "@/components/icons";
import Link from "next/link";
import { Logomark } from "@/components/logo";

export function DashboardTopbar({
  title,
  description,
  rightContent,
}: {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
}) {
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
        {rightContent}
        {!rightContent && (
          <div className="hidden md:flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[11.5px] text-ink-500">
            <Icon.Radio size={12} className="text-mustard-600" />
            Motsense Dashboard
          </div>
        )}
      </div>
    </header>
  );
}
