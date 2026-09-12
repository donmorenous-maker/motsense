import Link from "next/link";
import { HeroSchematic } from "@/components/marketing/hero-schematic";
import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CapabilityCards } from "@/components/marketing/capability-cards";
import { ApiPreview } from "@/components/marketing/api-preview";
import { BuildWith } from "@/components/marketing/build-with";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { HardwareSection } from "@/components/marketing/hardware-section";
import { WhyMotsense } from "@/components/marketing/why-motsense";
import { SolutionsGrid } from "@/components/marketing/solutions-grid";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-200/60">
        <div className="absolute inset-0 bg-grid bg-grid-light radial-fade opacity-70" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-white to-transparent" />
        <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-8">
            <SectionKicker>Distributed Road Intelligence</SectionKicker>
            <h1 className="text-display-xl font-semibold tracking-[-0.03em] text-ink-950 text-balance">
              Roads That <span className="text-mustard-500">Sense.</span>
            </h1>
            <p className="text-[20px] md:text-[22px] text-ink-700 leading-snug max-w-xl text-balance">
              Real-time traffic intelligence from the road itself.
            </p>
            <p className="text-[15.5px] text-ink-500 max-w-xl leading-relaxed">
              Motsense transforms road infrastructure into a distributed sensing network capable of
              converting physical road activity into actionable traffic data.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink href="#how-it-works" variant="secondary" size="lg">
                See How It Works
                <Icon.ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/api" variant="outline" size="lg">
                Explore the API
              </ButtonLink>
              <Link
                href="/signin"
                className="text-[13.5px] text-ink-500 hover:text-ink-900 inline-flex items-center gap-1 pl-2"
              >
                Sign In to Motsense <Icon.ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 text-[12px] text-ink-500">
              <div className="flex items-center gap-2">
                <Icon.Radio size={14} className="text-mustard-500" />
                Road-mounted sensing
              </div>
              <div className="flex items-center gap-2">
                <Icon.Wifi size={14} className="text-mustard-500" />
                LoRaWAN connectivity
              </div>
              <div className="flex items-center gap-2">
                <Icon.Cloud size={14} className="text-mustard-500" />
                Cloud &amp; API
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroSchematic />
          </div>
        </div>
      </section>

      {/* SECTION 2 — How it works */}
      <Section id="how-it-works">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>How Motsense Works</SectionKicker>
          <SectionTitle>From road activity to actionable intelligence.</SectionTitle>
          <SectionLede>
            Intelligence begins at the road surface. Every stage in the pipeline is engineered for
            latency, resilience, and precision — so a physical event becomes a structured data
            record in seconds.
          </SectionLede>
        </div>
        <HowItWorks />
      </Section>

      {/* SECTION 3 — Capabilities */}
      <Section id="capabilities">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>What Motsense Provides</SectionKicker>
          <SectionTitle>Turn physical traffic into structured data.</SectionTitle>
          <SectionLede>
            Every vehicle passing a Motsense sensor produces a rich, developer-consumable record —
            not a proprietary blob. Detect, estimate, classify, and analyze without cameras at every
            location.
          </SectionLede>
        </div>
        <CapabilityCards />
      </Section>

      {/* SECTION 4 — API */}
      <Section id="api" dark>
        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 space-y-6">
            <SectionKicker className="text-mustard-400">Developer API</SectionKicker>
            <SectionTitle className="text-white">Turn roads into data.</SectionTitle>
            <p className="text-[15.5px] text-ink-300 leading-relaxed max-w-lg">
              Motsense makes road intelligence available through a developer-friendly API,
              allowing transportation platforms, infrastructure operators, cities, researchers, and
              mobility applications to integrate real-world traffic information into their own
              systems.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href="/api" variant="primary" size="md">
                Explore API
                <Icon.ArrowRight size={14} />
              </ButtonLink>
              <ButtonLink href="/api#docs" variant="dark" size="md">
                Read Documentation
              </ButtonLink>
            </div>
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 max-w-md">
              {[
                "Traffic Management",
                "Smart City Platforms",
                "Transportation Analytics",
                "Mobility Applications",
                "Research",
                "Digital Twins",
                "Infrastructure Monitoring",
                "Real-time Dashboards",
              ].map((t) => (
                <div
                  key={t}
                  className="px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-[12.5px] text-ink-200"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <ApiPreview />
          </div>
        </div>
      </Section>

      {/* SECTION 5 — Build with */}
      <Section id="build-with">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>Build With Motsense</SectionKicker>
          <SectionTitle>Build on top of real-world road intelligence.</SectionTitle>
          <SectionLede>
            Motsense fits into your existing stack. Consume road-truth data from the API, subscribe
            to live events via webhooks or MQTT, and enrich the platforms you already run.
          </SectionLede>
        </div>
        <BuildWith />
      </Section>

      {/* SECTION 6 — Dashboard preview */}
      <Section id="platform" className="bg-ink-50/60">
        <div className="max-w-2xl space-y-4 mb-12">
          <SectionKicker>Live Platform Preview</SectionKicker>
          <SectionTitle>See your road network in real time.</SectionTitle>
          <SectionLede>
            A unified operational view for engineers, operators, and analysts — from device health
            to lane-level movement.
          </SectionLede>
        </div>
        <DashboardPreview />
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/company#contact" variant="primary" size="md">
            Request a Demo
            <Icon.ArrowRight size={14} />
          </ButtonLink>
          <ButtonLink href="/signin" variant="outline" size="md">
            Sign In to Motsense
          </ButtonLink>
        </div>
      </Section>

      {/* SECTION 7 — Hardware */}
      <Section id="hardware">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>Road Sensor</SectionKicker>
          <SectionTitle>Intelligence embedded in the road.</SectionTitle>
          <SectionLede>
            An infrastructure-grade sensing device engineered for the road surface — low-power,
            rugged, remotely managed, and quietly precise.
          </SectionLede>
        </div>
        <HardwareSection />
      </Section>

      {/* SECTION 8 — Why Motsense */}
      <Section id="why">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>Why Motsense</SectionKicker>
          <SectionTitle>An infrastructure platform, not a point sensor.</SectionTitle>
          <SectionLede>
            Deploy sensing intelligence across the road network — and connect it directly to the
            systems that make transportation work.
          </SectionLede>
        </div>
        <WhyMotsense />
      </Section>

      {/* SECTION 9 — Solutions */}
      <Section id="solutions">
        <div className="max-w-2xl space-y-4 mb-14">
          <SectionKicker>Solutions</SectionKicker>
          <SectionTitle>Built for the organizations that operate the road.</SectionTitle>
          <SectionLede>
            Motsense supports transportation professionals, city planners, road operators, and
            mobility teams with real, ground-truth data.
          </SectionLede>
        </div>
        <SolutionsGrid />
      </Section>

      {/* SECTION 10 — Final CTA */}
      <FinalCta />
    </>
  );
}
