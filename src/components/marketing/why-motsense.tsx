import { Icon } from "@/components/icons";

const items = [
  {
    title: "Distributed",
    body: "Deploy sensing intelligence across the road network.",
    icon: Icon.Layers,
  },
  {
    title: "Real-Time",
    body: "Move traffic events from the road to digital systems in seconds.",
    icon: Icon.Bolt,
  },
  {
    title: "API-First",
    body: "Integrate road intelligence directly into existing applications.",
    icon: Icon.Api,
  },
  {
    title: "Low-Power",
    body: "Designed for autonomous field operation.",
    icon: Icon.Battery,
  },
  {
    title: "Scalable",
    body: "Expand from individual road segments to large sensing networks.",
    icon: Icon.Grid,
  },
  {
    title: "Privacy-Oriented",
    body: "Extract physical traffic intelligence without requiring a camera at every sensing location.",
    icon: Icon.Shield,
  },
];

export function WhyMotsense() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const Ic = it.icon;
        return (
          <div
            key={it.title}
            className="group relative rounded-xl border border-ink-200/70 bg-white p-6 shadow-card overflow-hidden"
          >
            <div className="absolute top-0 right-0 text-[68px] font-mono text-ink-100 leading-none pr-3 pt-1 select-none pointer-events-none">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="relative">
              <div className="h-10 w-10 rounded-lg border border-ink-200 bg-ink-50 flex items-center justify-center text-ink-900 mb-5">
                <Ic size={18} />
              </div>
              <h3 className="text-[16px] font-semibold text-ink-900">{it.title}</h3>
              <p className="mt-2 text-[13.5px] text-ink-500 leading-relaxed max-w-xs">{it.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
