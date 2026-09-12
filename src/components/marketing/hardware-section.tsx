import { Icon } from "@/components/icons";

const callouts = [
  { label: "Vibration sensing", desc: "Wide-band mechanical signal capture" },
  { label: "Edge processing", desc: "On-device feature extraction" },
  { label: "Low-power operation", desc: "Optimized for autonomous field life" },
  { label: "Environmental monitoring", desc: "Ambient telemetry channels" },
  { label: "LoRaWAN connectivity", desc: "Long-range, low-power radio" },
  { label: "Remote telemetry", desc: "Health, uplinks, and configuration OTA" },
  { label: "Solar-assisted", desc: "Autonomous power architecture" },
];

export function HardwareSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6">
        <div className="relative aspect-square rounded-2xl bg-ink-950 overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-grid bg-grid-dark opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,154,44,0.20),transparent_60%)]" />

          {/* Sensor illustration */}
          <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
            {/* road slice */}
            <rect x="0" y="330" width="500" height="170" fill="#0B0B0D" />
            <line x1="0" y1="330" x2="500" y2="330" stroke="rgba(255,255,255,0.14)" />
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={40 + i * 82} y={392} width="46" height="6" fill="#C69A2C" opacity="0.7" />
            ))}

            {/* Sensor puck */}
            <g transform="translate(250, 300)">
              <ellipse cx="0" cy="60" rx="110" ry="18" fill="rgba(0,0,0,0.6)" />

              {/* outer housing */}
              <ellipse cx="0" cy="0" rx="95" ry="34" fill="#1A1A1D" stroke="#3A3A3F" />
              <ellipse cx="0" cy="-6" rx="95" ry="34" fill="url(#housing)" />

              {/* top ring */}
              <ellipse cx="0" cy="-14" rx="82" ry="26" fill="#0E0E0F" stroke="#4A4A4F" />
              {/* inner ring / lens */}
              <ellipse cx="0" cy="-16" rx="62" ry="19" fill="#18181C" stroke="#5A5A60" />
              {/* mustard beacon */}
              <ellipse cx="0" cy="-18" rx="34" ry="10" fill="#C69A2C">
                <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="-19" rx="14" ry="4" fill="#F6ECC8" />

              {/* screws */}
              {[-70, -35, 35, 70].map((x) => (
                <circle key={x} cx={x} cy={0} r="2.4" fill="#4A4A4F" />
              ))}
            </g>

            <defs>
              <linearGradient id="housing" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2A2A2E" />
                <stop offset="100%" stopColor="#0E0E0F" />
              </linearGradient>
            </defs>

            {/* Signal rings */}
            {[80, 130, 180].map((r, i) => (
              <circle
                key={r}
                cx="250"
                cy="280"
                r={r}
                stroke="rgba(198,154,44,0.28)"
                strokeWidth="1"
                fill="none"
              >
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* Callout lines */}
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none">
              <path d="M250 260 L 380 130" />
              <circle cx="250" cy="260" r="2" fill="#C69A2C" />
              <text x="386" y="126" fill="#ECECEE" fontSize="11" fontFamily="var(--font-mono)">
                mustard beacon
              </text>
              <path d="M180 300 L 60 200" />
              <circle cx="180" cy="300" r="2" fill="#C69A2C" />
              <text x="14" y="196" fill="#ECECEE" fontSize="11" fontFamily="var(--font-mono)">
                road-flush housing
              </text>
              <path d="M310 320 L 430 400" />
              <circle cx="310" cy="320" r="2" fill="#C69A2C" />
              <text x="330" y="418" fill="#ECECEE" fontSize="11" fontFamily="var(--font-mono)">
                LoRaWAN uplink
              </text>
            </g>
          </svg>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] font-mono text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            MOTSENSE-RR-014 · online
          </div>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {callouts.map((c, i) => (
            <div key={c.label} className="p-4 rounded-lg border border-ink-200 bg-white flex gap-3">
              <div className="h-8 w-8 rounded-md border border-ink-200 flex items-center justify-center bg-ink-50 text-mustard-600 shrink-0">
                {[Icon.Activity, Icon.Cpu, Icon.Battery, Icon.Thermo, Icon.Wifi, Icon.Radio, Icon.Bolt][i]({ size: 15 })}
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-ink-900">{c.label}</div>
                <div className="text-[12.5px] text-ink-500">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-ink-500 leading-relaxed">
          Motsense hardware is engineered for the road — installed flush, sealed against the
          elements, and quietly precise across long deployments. The sensor is one component of a
          managed infrastructure platform.
        </p>
      </div>
    </div>
  );
}
