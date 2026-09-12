import { Icon } from "@/components/icons";

const consumers = [
  { label: "Traffic Management", icon: Icon.Router },
  { label: "Smart City Platforms", icon: Icon.Building },
  { label: "Mobility Applications", icon: Icon.Car },
  { label: "Research", icon: Icon.Sparkles },
  { label: "Digital Twins", icon: Icon.Layers },
  { label: "Data Analytics", icon: Icon.Activity },
];

export function BuildWith() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 items-center">
      <div className="lg:col-span-7 relative">
        <div className="relative rounded-2xl border border-ink-200/80 bg-white p-8 md:p-10 overflow-hidden shadow-card">
          <div className="absolute inset-0 bg-grid bg-grid-light opacity-[0.35] pointer-events-none" />
          <div className="relative grid gap-8 md:grid-cols-3 items-center">
            <div className="space-y-3">
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                sources
              </div>
              <Node label="Road Sensors" sublabel="Motsense hardware" icon={Icon.Radio} />
              <Node label="Gateways" sublabel="WisGate + LoRaWAN" icon={Icon.Antenna} />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <svg width="60" height="120" viewBox="0 0 60 120">
                  <path d="M0 30 C 30 30, 30 60, 60 60" stroke="#C69A2C" fill="none" strokeDasharray="3 4" />
                  <path d="M0 90 C 30 90, 30 60, 60 60" stroke="#C69A2C" fill="none" strokeDasharray="3 4" />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                <svg width="60" height="120" viewBox="0 0 60 120">
                  <path d="M0 60 C 30 60, 30 20, 60 20" stroke="#C69A2C" fill="none" strokeDasharray="3 4" />
                  <path d="M0 60 C 30 60, 30 60, 60 60" stroke="#C69A2C" fill="none" strokeDasharray="3 4" />
                  <path d="M0 60 C 30 60, 30 100, 60 100" stroke="#C69A2C" fill="none" strokeDasharray="3 4" />
                </svg>
              </div>
              <div className="relative z-10 w-full">
                <div className="rounded-xl border border-ink-900 bg-ink-950 text-white p-4 text-center shadow-card">
                  <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-400">
                    motsense api
                  </div>
                  <div className="mt-1 text-[15px] font-semibold">Traffic Intelligence</div>
                  <div className="mt-1 text-[11.5px] text-ink-300 font-mono">
                    REST · Webhooks · MQTT
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                consumers
              </div>
              <Node label="Traffic Management" icon={Icon.Router} />
              <Node label="Smart City" icon={Icon.Building} />
              <Node label="Mobility Apps" icon={Icon.Car} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <p className="text-[15.5px] text-ink-600 leading-relaxed">
          Customers can consume Motsense data without replacing existing infrastructure software. We
          integrate alongside your TMS, GIS, planning tools, and analytics warehouses.
        </p>
        <ul className="space-y-3">
          {[
            "Interoperable with existing traffic and city platforms",
            "Push events via webhooks or subscribe over MQTT",
            "Historical data available for planning and studies",
            "Structured JSON — ready for warehouses and dashboards",
          ].map((t) => (
            <li key={t} className="flex gap-3 text-[14px] text-ink-800">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-mustard-50 border border-mustard-200 flex items-center justify-center text-mustard-700">
                <Icon.Check size={12} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Node({
  label,
  sublabel,
  icon: IconEl,
}: {
  label: string;
  sublabel?: string;
  icon: typeof Icon.Radio;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-ink-200 bg-white/70">
      <div className="h-9 w-9 rounded-md border border-ink-200 bg-white flex items-center justify-center">
        <IconEl size={16} />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-ink-900 leading-tight">{label}</div>
        {sublabel && <div className="text-[11px] text-ink-500 leading-tight">{sublabel}</div>}
      </div>
    </div>
  );
}
