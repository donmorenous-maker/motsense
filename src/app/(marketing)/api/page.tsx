import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { ApiPreview } from "@/components/marketing/api-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";

export const metadata = { title: "API" };

const endpoints = [
  { method: "GET", path: "/v1/traffic/events", desc: "List traffic events across your network" },
  { method: "GET", path: "/v1/traffic/events/{id}", desc: "Retrieve a single traffic event" },
  { method: "GET", path: "/v1/devices", desc: "List sensing devices and current status" },
  { method: "GET", path: "/v1/devices/{id}", desc: "Device detail — health, telemetry, uplinks" },
  { method: "GET", path: "/v1/gateways", desc: "List LoRaWAN gateways" },
  { method: "GET", path: "/v1/analytics/volume", desc: "Aggregated volume series" },
  { method: "GET", path: "/v1/analytics/speed", desc: "Speed histograms and percentiles" },
  { method: "POST", path: "/v1/webhooks", desc: "Register a webhook endpoint" },
];

const docs = [
  { title: "Getting Started", desc: "Authentication, first request, environment.", href: "#" },
  { title: "Authentication", desc: "API keys, scopes, and rotation.", href: "#auth" },
  { title: "Traffic Events API", desc: "Query and stream vehicle events.", href: "#" },
  { title: "Devices API", desc: "Inspect and manage devices in the field.", href: "#" },
  { title: "Traffic Analytics API", desc: "Aggregated series for volume, speed, class.", href: "#" },
  { title: "Webhooks", desc: "Signed, retried, and idempotent.", href: "#webhooks" },
  { title: "MQTT", desc: "Subscribe to the live event bus.", href: "#mqtt" },
  { title: "Rate Limits", desc: "Fair usage, per-scope buckets.", href: "#" },
  { title: "SDKs", desc: "TypeScript, Python, Go.", href: "#" },
  { title: "Examples", desc: "End-to-end integration recipes.", href: "#examples" },
];

export default function ApiPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24" dark>
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <SectionKicker className="text-mustard-400">Developer API</SectionKicker>
            <SectionTitle as="h1" className="text-display-lg text-white">
              Turn roads into data.
            </SectionTitle>
            <p className="text-[16px] text-ink-300 max-w-lg leading-relaxed">
              Motsense makes road intelligence available through a developer-friendly API — for
              transportation platforms, infrastructure operators, cities, researchers, and
              mobility applications to integrate real-world traffic information into their own
              systems.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href="#endpoints" variant="primary" size="md">
                Explore API
                <Icon.ArrowRight size={14} />
              </ButtonLink>
              <ButtonLink href="#docs" variant="dark" size="md">
                Read Documentation
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ApiPreview />
          </div>
        </div>
      </Section>

      <Section id="endpoints">
        <div className="max-w-2xl space-y-3 mb-10">
          <SectionKicker>Endpoints</SectionKicker>
          <SectionTitle>Core resources.</SectionTitle>
          <SectionLede>
            A focused surface designed around traffic events, devices, and analytics — with
            streaming counterparts for every core resource.
          </SectionLede>
        </div>
        <div className="rounded-xl border border-ink-200/70 bg-white shadow-card overflow-hidden">
          <div className="divide-y divide-ink-200/70">
            {endpoints.map((e) => (
              <div key={e.path} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                <div className="col-span-2">
                  <span className="text-[10.5px] font-mono font-semibold px-2 py-1 rounded bg-mustard-50 text-mustard-700 border border-mustard-200">
                    {e.method}
                  </span>
                </div>
                <div className="col-span-5 font-mono text-[13px] text-ink-900">{e.path}</div>
                <div className="col-span-5 text-[13px] text-ink-500">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="auth" className="bg-ink-50/60">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionKicker>Authentication</SectionKicker>
            <SectionTitle className="mt-3">API keys, scoped and rotated.</SectionTitle>
            <p className="mt-4 text-[14px] text-ink-500 max-w-lg leading-relaxed">
              Motsense uses signed API keys with scoped permissions. Rotate keys, restrict scope,
              and monitor usage per key from the platform.
            </p>
          </div>
          <div className="rounded-xl bg-ink-950 text-ink-100 p-5 border border-ink-800 font-mono text-[12.5px] leading-[1.8] overflow-auto">
            <div className="text-ink-400">
              <span className="text-mustard-400">curl</span> https://api.motsense.com/v1/traffic/events \
            </div>
            <div className="text-ink-400">
              &nbsp;&nbsp;-H <span className="text-emerald-300">&quot;Authorization: ******;</span> \
            </div>
            <div className="text-ink-400">
              &nbsp;&nbsp;-H <span className="text-emerald-300">&quot;Accept: application/json&quot;</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="webhooks">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionKicker>Webhooks &amp; MQTT</SectionKicker>
            <SectionTitle className="mt-3">Push, don&apos;t poll.</SectionTitle>
            <p className="mt-4 text-[14px] text-ink-500 max-w-lg leading-relaxed">
              Subscribe to traffic events, device state changes, and alerts. Every payload is
              signed, retried, and idempotent — with MQTT streaming for lower-latency consumers.
            </p>
          </div>
          <div id="mqtt" className="rounded-xl bg-ink-950 text-ink-100 p-5 border border-ink-800 font-mono text-[12.5px] leading-[1.8] overflow-auto">
            <div><span className="text-mustard-400">POST</span> https://ops.example.com/webhooks/motsense</div>
            <div className="text-ink-400">{"{"}</div>
            <div>&nbsp;&nbsp;<span className="text-mustard-400">&quot;event&quot;</span>: <span className="text-emerald-300">&quot;traffic.event&quot;</span>,</div>
            <div>&nbsp;&nbsp;<span className="text-mustard-400">&quot;device_id&quot;</span>: <span className="text-emerald-300">&quot;RR-014&quot;</span>,</div>
            <div>&nbsp;&nbsp;<span className="text-mustard-400">&quot;speed_kmh&quot;</span>: <span className="text-sky-300">56.7</span>,</div>
            <div>&nbsp;&nbsp;<span className="text-mustard-400">&quot;confidence&quot;</span>: <span className="text-sky-300">0.93</span></div>
            <div className="text-ink-400">{"}"}</div>
          </div>
        </div>
      </Section>

      <Section id="docs" className="bg-ink-50/60">
        <div className="max-w-2xl space-y-3 mb-10">
          <SectionKicker>Documentation</SectionKicker>
          <SectionTitle>Everything a developer needs.</SectionTitle>
          <SectionLede>
            Full documentation is available on the developer portal at{" "}
            <span className="font-mono text-ink-900">docs.motsense.com</span>. A summary of what
            you&apos;ll find:
          </SectionLede>
        </div>
        <div id="examples" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <a
              key={d.title}
              href={d.href}
              className="rounded-lg border border-ink-200/70 bg-white p-5 hover:border-ink-900/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold text-ink-900">{d.title}</div>
                <Icon.ArrowUpRight size={14} className="text-ink-400 group-hover:text-ink-900 transition-colors" />
              </div>
              <div className="mt-1.5 text-[12.5px] text-ink-500">{d.desc}</div>
            </a>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
