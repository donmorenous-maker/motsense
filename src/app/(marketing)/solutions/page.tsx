import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { SolutionsGrid } from "@/components/marketing/solutions-grid";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = { title: "Solutions" };

const useCases = [
  {
    title: "Traffic volume monitoring",
    body: "Continuous, sensor-level volume data across the corridors you operate.",
  },
  {
    title: "Speed studies",
    body: "Replace intermittent studies with always-on speed telemetry.",
  },
  {
    title: "Road utilization analysis",
    body: "Understand how road segments actually perform across days, weeks, and seasons.",
  },
  {
    title: "Infrastructure planning",
    body: "Ground planning and capital decisions in longitudinal, real-world data.",
  },
  {
    title: "Mobility research",
    body: "Clean, structured, time-series data for research programs and modeling.",
  },
  {
    title: "Real-time roadway awareness",
    body: "Live operational context for traffic management centers and operators.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="max-w-3xl space-y-6">
          <SectionKicker>Solutions</SectionKicker>
          <SectionTitle as="h1" className="text-display-lg">
            Real-world road data for the teams that operate the road.
          </SectionTitle>
          <SectionLede>
            Motsense supports the organizations responsible for how roads move — from cities and
            state agencies to mobility platforms and research groups.
          </SectionLede>
        </div>
      </Section>

      <Section>
        <SolutionsGrid />
      </Section>

      <Section className="bg-ink-50/60">
        <div className="max-w-2xl space-y-3 mb-12">
          <SectionKicker>Use Cases</SectionKicker>
          <SectionTitle>What teams do with Motsense.</SectionTitle>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u, i) => (
            <div
              key={u.title}
              className="rounded-xl border border-ink-200/70 bg-white p-6 shadow-card"
            >
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-[15.5px] font-semibold text-ink-900">{u.title}</h3>
              <p className="mt-2 text-[13.5px] text-ink-500 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
