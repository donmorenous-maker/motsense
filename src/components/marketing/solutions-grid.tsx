import { Icon } from "@/components/icons";
import Link from "next/link";

const solutions = [
  {
    id: "smart-cities",
    title: "Smart Cities",
    icon: Icon.Building,
    body:
      "Give planning, mobility, and public-works teams a real-time view of how roads actually behave.",
    outcomes: ["Traffic volume monitoring", "Road utilization analysis", "Infrastructure planning"],
  },
  {
    id: "agencies",
    title: "Transportation Agencies",
    icon: Icon.Router,
    body:
      "Add a ground-truth data layer to state and regional transportation programs — from corridor studies to compliance.",
    outcomes: ["Speed studies", "Corridor analysis", "Program measurement"],
  },
  {
    id: "operators",
    title: "Road Operators",
    icon: Icon.Antenna,
    body:
      "Operate roads with continuous awareness — not periodic surveys and manual counts.",
    outcomes: ["Real-time roadway awareness", "Incident context", "Maintenance planning"],
  },
  {
    id: "mobility",
    title: "Mobility Platforms",
    icon: Icon.Car,
    body:
      "Enrich navigation, fleet, and delivery products with high-fidelity, low-latency road data.",
    outcomes: ["Fleet insights", "Route intelligence", "Live conditions"],
  },
  {
    id: "research",
    title: "Research Institutions",
    icon: Icon.Sparkles,
    body:
      "Access clean, structured, longitudinal road data for transportation research and modeling.",
    outcomes: ["Mobility research", "Long-term studies", "Model validation"],
  },
];

export function SolutionsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {solutions.map((s) => {
        const Ic = s.icon;
        return (
          <div
            key={s.id}
            id={s.id}
            className="group relative rounded-xl border border-ink-200/70 bg-white p-6 shadow-card flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-lg border border-ink-200 bg-ink-50 flex items-center justify-center text-ink-900">
                <Ic size={18} />
              </div>
              <Link
                href={`/solutions#${s.id}`}
                className="text-ink-300 group-hover:text-ink-900 transition-colors"
              >
                <Icon.ArrowUpRight size={16} />
              </Link>
            </div>
            <h3 className="mt-6 text-[16px] font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-[13.5px] text-ink-500 leading-relaxed">{s.body}</p>
            <ul className="mt-5 space-y-1.5">
              {s.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2 text-[12.5px] text-ink-700">
                  <span className="h-1 w-1 rounded-full bg-mustard-500" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
