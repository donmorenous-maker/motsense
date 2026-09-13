import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-grid bg-grid-dark opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,154,44,0.16),transparent_60%)]" />
      <div className="container relative py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-mustard-400 font-medium mb-6">
          <span className="h-[6px] w-[6px] rounded-full bg-mustard-500" />
          Get Started
        </div>
        <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-balance max-w-3xl mx-auto">
          Make the road part of the network.
        </h2>
        <p className="mt-6 text-[17px] text-ink-300 max-w-2xl mx-auto leading-relaxed text-balance">
          Deploy physical sensing infrastructure that transforms road activity into actionable
          traffic intelligence.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/company#contact" variant="primary" size="lg">
            Request Demo
            <Icon.ArrowRight size={16} />
          </ButtonLink>
          <ButtonLink href="/api" variant="dark" size="lg">
            Explore API
          </ButtonLink>
        </div>
        <div className="mt-16 flex items-center justify-center gap-2 text-mustard-400 text-[11px] tracking-[0.22em] uppercase">
          Motsense · Roads That Sense.
        </div>
      </div>
    </section>
  );
}
