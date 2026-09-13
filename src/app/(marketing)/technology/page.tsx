import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Icon } from "@/components/icons";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = { title: "Technology" };

const layers = [
  {
    title: "Sensing",
    body: "Wide-band mechanical signal capture at the road surface — designed to isolate vehicle events from environmental noise.",
    icon: Icon.Activity,
    tag: "layer 1",
  },
  {
    title: "Edge Processing",
    body: "On-device signal processing extracts vehicle events, speed estimates, and classification features locally.",
    icon: Icon.Cpu,
    tag: "layer 2",
  },
  {
    title: "LoRaWAN",
    body: "Compact packets transmit over long-range, low-power radio to WisGate gateways — resilient across the corridor.",
    icon: Icon.Wifi,
    tag: "layer 3",
  },
  {
    title: "Cloud",
    body: "Ingest, enrich, and normalize events into a queryable stream. Serve REST, webhook, and MQTT surfaces.",
    icon: Icon.Cloud,
    tag: "layer 4",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="max-w-3xl space-y-6">
          <SectionKicker>Technology</SectionKicker>
          <SectionTitle as="h1" className="text-display-lg">
            An infrastructure stack for the road surface.
          </SectionTitle>
          <SectionLede>
            Motsense is built as four coordinated layers — sensing, edge processing, wireless
            connectivity, and cloud — engineered together so a physical event becomes structured
            data in seconds.
          </SectionLede>
        </div>
      </Section>

      <Section>
        <HowItWorks />
      </Section>

      <Section className="bg-ink-50/60">
        <div className="max-w-2xl space-y-3 mb-12">
          <SectionKicker>The Stack</SectionKicker>
          <SectionTitle>Four layers, one platform.</SectionTitle>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {layers.map((l) => {
            const Ic = l.icon;
            return (
              <div key={l.title} className="rounded-xl border border-ink-200/70 bg-white p-6 shadow-card">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                  {l.tag}
                </div>
                <div className="mt-3 h-10 w-10 rounded-lg border border-ink-200 bg-ink-50 flex items-center justify-center">
                  <Ic size={18} />
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold text-ink-900">{l.title}</h3>
                <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">{l.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section dark>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionKicker className="text-mustard-400">Architecture</SectionKicker>
            <SectionTitle className="text-white mt-3">Designed to be integrated.</SectionTitle>
            <p className="mt-4 text-[14.5px] text-ink-300 max-w-lg leading-relaxed">
              Motsense fits into modern data stacks — a Postgres-backed core, streaming buses,
              and API surfaces that behave like any other production service.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/10 bg-ink-900 p-6 font-mono text-[12.5px] leading-[1.9] text-ink-100 overflow-auto">
              <div className="text-mustard-400"># Motsense architecture (public)</div>
              <div>road_sensor <span className="text-ink-400">--LoRaWAN--&gt;</span> wisgate_gateway</div>
              <div>wisgate_gateway <span className="text-ink-400">--MQTT--&gt;</span> ingest_service</div>
              <div>ingest_service <span className="text-ink-400">--&gt;</span> event_bus</div>
              <div>event_bus <span className="text-ink-400">--&gt;</span> analytics_engine</div>
              <div>event_bus <span className="text-ink-400">--&gt;</span> webhook_dispatcher</div>
              <div>event_bus <span className="text-ink-400">--&gt;</span> realtime_gateway (mqtt / websocket)</div>
              <div>storage: postgres · time-series · object</div>
              <div>surfaces: <span className="text-emerald-300">rest · webhook · mqtt · dashboard</span></div>
            </div>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
