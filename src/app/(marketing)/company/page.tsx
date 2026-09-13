import { Section, SectionKicker, SectionTitle, SectionLede } from "@/components/marketing/section";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = { title: "Company" };

export default function CompanyPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="max-w-3xl space-y-6">
          <SectionKicker>Company</SectionKicker>
          <SectionTitle as="h1" className="text-display-lg">
            We build the sensing layer of the road.
          </SectionTitle>
          <SectionLede>
            Motsense is a road-infrastructure company. We build sensing hardware, a real-time
            cloud platform, and a developer API — so the physical road can be read like any other
            data source.
          </SectionLede>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              t: "Mission",
              b: "Make the physical road part of the digital transportation stack.",
            },
            {
              t: "Approach",
              b: "Build sensing, connectivity, and data infrastructure as one coordinated system.",
            },
            {
              t: "Focus",
              b: "Cities, transportation agencies, road operators, mobility platforms, researchers.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-xl border border-ink-200/70 bg-white p-6 shadow-card">
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                {v.t}
              </div>
              <p className="mt-3 text-[15px] text-ink-800 leading-relaxed">{v.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" className="bg-ink-50/60">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionKicker>Contact</SectionKicker>
            <SectionTitle className="mt-3">Request a demo.</SectionTitle>
            <SectionLede className="mt-4">
              Tell us about your road network and what you&apos;d like to measure. We&apos;ll get
              in touch within one business day.
            </SectionLede>
            <ul className="mt-8 space-y-3 text-[13.5px] text-ink-700">
              <li className="flex items-center gap-3">
                <Icon.Building size={16} className="text-mustard-600" />
                Columbus, OH · United States
              </li>
              <li className="flex items-center gap-3">
                <Icon.Wifi size={16} className="text-mustard-600" />
                sales@motsense.com
              </li>
              <li className="flex items-center gap-3">
                <Icon.Docs size={16} className="text-mustard-600" />
                docs.motsense.com
              </li>
            </ul>
          </div>
          <form className="rounded-xl border border-ink-200/70 bg-white p-6 shadow-card space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" placeholder="Alex" />
              <Field label="Last name" placeholder="Rivera" />
            </div>
            <Field label="Work email" placeholder="alex@agency.gov" type="email" />
            <Field label="Organization" placeholder="Ohio DOT" />
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
                Role
              </label>
              <select className="mt-1 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-[13.5px] focus:border-mustard-500 focus:outline-none">
                <option>Transportation Engineer</option>
                <option>Traffic Operations</option>
                <option>Planning</option>
                <option>Research</option>
                <option>Mobility Product</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
                Tell us about your project
              </label>
              <textarea
                rows={4}
                placeholder="Corridor, timeline, integration needs..."
                className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[13.5px] focus:border-mustard-500 focus:outline-none"
              />
            </div>
            <Button variant="primary" size="md" type="button" className="w-full">
              Request Demo
              <Icon.ArrowRight size={14} />
            </Button>
            <p className="text-[11.5px] text-ink-500">
              By submitting, you agree to the Motsense{" "}
              <a className="underline" href="/legal/privacy">Privacy Notice</a>.
            </p>
          </form>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-mono uppercase tracking-widest text-ink-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-[13.5px] focus:border-mustard-500 focus:outline-none"
      />
    </div>
  );
}
