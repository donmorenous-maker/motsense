"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "API", href: "/api" },
  { label: "Technology", href: "/technology" },
  { label: "Company", href: "/company" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 backdrop-blur-md bg-white/70 border-b border-ink-200/60" />
      <div className="container relative flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center" aria-label="Motsense home">
            <Logo variant="light" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 h-9 flex items-center text-[13.5px] text-ink-600 hover:text-ink-900 transition-colors rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <ButtonLink href="/signin" variant="ghost" size="sm">
            Sign In
          </ButtonLink>
          <ButtonLink href="/company#contact" variant="primary" size="sm">
            Request Demo
            <Icon.ArrowRight size={14} />
          </ButtonLink>
        </div>
        <button
          className="md:hidden p-2 -mr-2 text-ink-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <Icon.X size={20} /> : <Icon.Menu size={20} />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-ink-200/60 bg-white/95 backdrop-blur transition-[max-height] duration-300",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container py-3 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[14px] text-ink-700 hover:text-ink-900 rounded-md"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex gap-2 border-t border-ink-200/60 mt-2">
            <ButtonLink href="/signin" variant="outline" size="sm" className="flex-1">
              Sign In
            </ButtonLink>
            <ButtonLink href="/company#contact" variant="primary" size="sm" className="flex-1">
              Request Demo
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
