import { Section, SectionKicker, SectionTitle } from "@/components/marketing/section";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Section className="pt-16 md:pt-24">
      <div className="max-w-3xl space-y-4">
        <SectionKicker>Legal</SectionKicker>
        <SectionTitle as="h1">Terms of Service</SectionTitle>
        <p className="text-[14px] text-ink-500">Placeholder. Terms of Service will be published here.</p>
      </div>
    </Section>
  );
}
