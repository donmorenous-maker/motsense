import Link from "next/link";
import { Logo } from "@/components/logo";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Road Sensor", href: "/product#road-sensor" },
      { label: "Platform", href: "/product#platform" },
      { label: "API", href: "/api" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Smart Cities", href: "/solutions#smart-cities" },
      { label: "Transportation Agencies", href: "/solutions#agencies" },
      { label: "Road Operators", href: "/solutions#operators" },
      { label: "Research", href: "/solutions#research" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Documentation", href: "/api#docs" },
      { label: "Authentication", href: "/api#auth" },
      { label: "Webhooks", href: "/api#webhooks" },
      { label: "MQTT", href: "/api#mqtt" },
      { label: "Examples", href: "/api#examples" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Contact", href: "/company#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-950 text-ink-200 border-t border-white/10">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-[13px] text-ink-300 max-w-xs">
              Motsense transforms road infrastructure into a distributed sensing network for
              real-time traffic intelligence.
            </p>
            <p className="text-mustard-400 text-[11px] tracking-[0.22em] uppercase pt-2">
              Roads That Sense.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] uppercase tracking-[0.18em] text-ink-400 mb-4">
                {c.title}
              </h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] text-ink-200 hover:text-mustard-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[12px] text-ink-400">
          <div>© {new Date().getFullYear()} Motsense, Inc. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="hover:text-ink-100">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-ink-100">Terms</Link>
            <span className="text-ink-500">Made for infrastructure.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
