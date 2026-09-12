import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col p-8 md:p-12">
        <Link href="/" className="inline-flex">
          <Logo variant="light" />
        </Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-ink-900">
              Sign in to Motsense
            </h1>
            <p className="mt-2 text-[14px] text-ink-500">
              Access your road network, live events, and API.
            </p>

            <form action="/app" className="mt-8 space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="alex@ops.example.com"
                  autoComplete="email"
                  className="mt-1 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-[14px] focus:border-mustard-500 focus:outline-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
                    Password
                  </label>
                  <Link href="#" className="text-[11.5px] text-ink-500 hover:text-ink-900">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="mt-1 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-[14px] focus:border-mustard-500 focus:outline-none"
                />
              </div>
              <Button variant="primary" size="lg" type="submit" className="w-full">
                Sign In
                <Icon.ArrowRight size={14} />
              </Button>
              <div className="relative py-2">
                <div className="border-t border-ink-200/70" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-[11px] uppercase tracking-widest text-ink-400">
                    or
                  </span>
                </span>
              </div>
              <Button variant="outline" size="md" type="button" className="w-full">
                <Icon.Key size={14} /> Continue with SSO
              </Button>
            </form>

            <p className="mt-8 text-[13px] text-ink-500 text-center">
              New to Motsense?{" "}
              <Link href="/company#contact" className="text-mustard-600 hover:text-mustard-500">
                Request a demo →
              </Link>
            </p>
          </div>
        </div>
        <div className="text-[12px] text-ink-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Motsense, Inc.</span>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-ink-700">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-ink-700">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:block relative bg-ink-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-dark opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,154,44,0.18),transparent_60%)]" />
        <div className="relative h-full flex flex-col p-12">
          <div className="text-[11px] uppercase tracking-[0.22em] text-mustard-400">
            Motsense · Roads That Sense.
          </div>
          <div className="flex-1 flex items-center">
            <div className="max-w-md">
              <h2 className="text-[34px] font-semibold tracking-[-0.02em] leading-[1.05]">
                Your road network,
                <br />
                <span className="text-mustard-400">in real time.</span>
              </h2>
              <p className="mt-4 text-[14.5px] text-ink-300 leading-relaxed">
                Live events, device health, alerts, and analytics — from every corridor you operate.
              </p>
              <div className="mt-8 space-y-3 font-mono text-[12px] text-ink-300">
                {[
                  { k: "vehicles/min", v: "18.4" },
                  { k: "active sensors", v: "48 / 50" },
                  { k: "gateways online", v: "3 / 3" },
                  { k: "avg latency", v: "42 ms" },
                ].map((r) => (
                  <div key={r.k} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-ink-400 uppercase tracking-widest text-[10.5px]">{r.k}</span>
                    <span className="text-white text-[14px]">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <ButtonLink href="/" variant="dark" size="sm">
              ← Back to motsense.com
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
