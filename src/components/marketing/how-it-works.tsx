import { Icon } from "@/components/icons";

const steps = [
  {
    title: "Vehicle",
    body: "A car, truck, motorcycle, or bus travels over the road.",
    icon: Icon.Car,
    mono: "physical event",
  },
  {
    title: "Road Surface",
    body: "Wheel loads generate a distinct mechanical signature in the pavement.",
    icon: Icon.Activity,
    mono: "vibration signal",
  },
  {
    title: "Motsense Sensor",
    body: "A road-mounted device captures the vibration in real time.",
    icon: Icon.Radio,
    mono: "capture",
  },
  {
    title: "Edge Processing",
    body: "On-device signal processing extracts detection, speed, and class.",
    icon: Icon.Cpu,
    mono: "on-device",
  },
  {
    title: "LoRaWAN",
    body: "Compact packets transmit over long-range low-power radio.",
    icon: Icon.Wifi,
    mono: "wireless uplink",
  },
  {
    title: "Motsense Cloud",
    body: "Events are enriched, normalized, and made queryable.",
    icon: Icon.Cloud,
    mono: "ingest + enrich",
  },
  {
    title: "API / Dashboard",
    body: "Available as REST, streams, or a live operational dashboard.",
    icon: Icon.Grid,
    mono: "consume",
  },
];

export function HowItWorks() {
  return (
    <div className="relative">
      {/* connecting rail */}
      <div className="hidden md:block absolute left-0 right-0 top-[46px] h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
      <div className="hidden md:block absolute left-0 right-0 top-[46px] h-px overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-mustard-500 to-transparent animate-flow" style={{ animationDuration: "4s" }} />
      </div>

      <ol className="grid gap-6 md:grid-cols-7">
        {steps.map((s, i) => {
          const IconEl = s.icon;
          return (
            <li key={s.title} className="group relative">
              <div className="relative z-10 mx-auto mb-4 flex h-[92px] w-[92px] items-center justify-center rounded-2xl border border-ink-200 bg-white shadow-card">
                <div className="absolute inset-0 rounded-2xl bg-grid bg-grid-light opacity-40" />
                <IconEl size={26} className="relative text-ink-900" />
                <span className="absolute -top-2 -right-2 h-6 min-w-6 px-1.5 flex items-center justify-center rounded-full bg-ink-950 text-white text-[10px] font-mono tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="space-y-1.5 text-center md:text-left">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                  {s.mono}
                </div>
                <div className="text-[14px] font-semibold text-ink-900">{s.title}</div>
                <div className="text-[12.5px] text-ink-500 leading-snug">{s.body}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
