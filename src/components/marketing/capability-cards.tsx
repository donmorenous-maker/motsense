import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

const items = [
  {
    label: "Vehicle Detection",
    value: "Detected",
    hint: "Presence + count",
    icon: Icon.Car,
    tag: "detected",
    tone: "gold",
  },
  {
    label: "Speed Estimation",
    value: "56.7 km/h",
    hint: "Per-vehicle instantaneous",
    icon: Icon.Gauge,
    tag: "speed_kmh",
  },
  {
    label: "Direction",
    value: "Eastbound",
    hint: "Directional bin",
    icon: Icon.Compass,
    tag: "direction",
  },
  {
    label: "Vehicle Classification",
    value: "SUV",
    hint: "Sedan · SUV · Truck · Bus · …",
    icon: Icon.Layers,
    tag: "vehicle_class",
  },
  {
    label: "Confidence Score",
    value: "0.93",
    hint: "Per-event confidence",
    icon: Icon.Sparkles,
    tag: "confidence",
    tone: "gold",
  },
  {
    label: "Traffic Count",
    value: "1,284 today",
    hint: "Per-sensor rolling window",
    icon: Icon.Activity,
    tag: "count",
  },
  {
    label: "Vibration Signature",
    value: "1842 energy",
    hint: "Raw signal feature",
    icon: Icon.Bolt,
    tag: "vibration_energy",
  },
  {
    label: "Sensor Health",
    value: "3.21 V · 26.4°C",
    hint: "Battery + telemetry",
    icon: Icon.Battery,
    tag: "device_health",
  },
  {
    label: "Environmental Data",
    value: "Ambient · Temp",
    hint: "Context signals",
    icon: Icon.Thermo,
    tag: "environment",
  },
];

export function CapabilityCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const Ic = it.icon;
        return (
          <div
            key={it.label}
            className={cn(
              "group relative rounded-xl border border-ink-200/70 bg-white p-5 shadow-card overflow-hidden",
              "transition-colors hover:border-ink-900/20"
            )}
          >
            <div className="absolute inset-0 bg-grid bg-grid-light opacity-[0.35] pointer-events-none" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                  {it.tag}
                </div>
                <div className="mt-1.5 text-[15px] font-semibold text-ink-900">{it.label}</div>
              </div>
              <div className="h-9 w-9 rounded-lg border border-ink-200 flex items-center justify-center text-ink-900 bg-white">
                <Ic size={16} />
              </div>
            </div>
            <div className="relative mt-6 flex items-baseline justify-between">
              <div className="text-[22px] font-semibold tracking-tight text-ink-900 font-mono tabular-nums">
                {it.value}
              </div>
              <div className="text-[12px] text-ink-500">{it.hint}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
