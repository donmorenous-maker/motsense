import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { HardwareSection } from "@/components/marketing/hardware-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { ApiPreview } from "@/components/marketing/api-preview";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="max-w-3xl space-y-6">
          <SectionKicker>Product</SectionKicker>
          <SectionTitle as="h1" className="text-display-lg">
            One platform. Three surfaces. From the road to your systems.
          </SectionTitle>
          <SectionLede>
            Motsense combines road-mounted sensing hardware, a real-time cloud platform, and a
            developer API — designed to be deployed as infrastructure and consumed as data.
          </SectionLede>
        </div>
      </Section>

      <Section id="road-sensor">
        <div className="max-w-2xl space-y-3 mb-12">
          <SectionKicker>Road Sensor</SectionKicker>
          <SectionTitle>Sensing built into the pavement.</SectionTitle>
          <SectionLede>
            A rugged, road-flush sensing device engineered for autonomous operation over long
            deployments.
          </SectionLede>
        </div>
        <HardwareSection />
      </Section>

      <Section id="platform" className="bg-ink-50/60">
        <div className="max-w-2xl space-y-3 mb-12">
          <SectionKicker>Platform</SectionKicker>
          <SectionTitle>An operational cockpit for your road network.</SectionTitle>
          <SectionLede>
            A production dashboard for engineers and operators — device health, live traffic
            events, alerts, and analytics in one place.
          </SectionLede>
        </div>
        <DashboardPreview />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/signin" variant="secondary" size="md">
            Sign In to Motsense
            <Icon.ArrowRight size={14} />
          </ButtonLink>
          <ButtonLink href="/company#contact" variant="outline" size="md">
            Request Demo
          </ButtonLink>
        </div>
      </Section>

      <Section id="api" dark>
        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 space-y-6">
            <SectionKicker className="text-mustard-400">API</SectionKicker>
            <SectionTitle className="text-white">Motsense is data infrastructure.</SectionTitle>
            <p className="text-[15.5px] text-ink-300 max-w-lg leading-relaxed">
              Every event captured on the road is available as structured JSON — via REST, MQTT,
              or webhooks. Integrate directly into the systems you already run.
            </p>
            <ButtonLink href="/api" variant="primary" size="md">
              Explore API
              <Icon.ArrowRight size={14} />
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <ApiPreview />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
