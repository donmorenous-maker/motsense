"use client";

import type { Device, Gateway } from "@/data/mock";
import { cn } from "@/lib/utils";

/**
 * Stylized abstract network map.
 * Uses device lat/lng but projects into a schematic road grid — deliberately elegant, not literal.
 */
export function NetworkMap({
  devices,
  gateways = [],
  height = 320,
  selectedId,
  onSelect,
  className,
}: {
  devices: Device[];
  gateways?: Gateway[];
  height?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const width = 640;
  const lats = devices.map((d) => d.lat);
  const lngs = devices.map((d) => d.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * (width - 40) + 20;
    const y = (1 - (lat - minLat) / (maxLat - minLat || 1)) * (height - 40) + 20;
    return { x, y };
  };

  const colorFor = (s: Device["status"]) =>
    s === "online" ? "#10B981" : s === "warning" ? "#F59E0B" : s === "offline" ? "#F43F5E" : "#9CA3AF";

  return (
    <div
      className={cn(
        "relative rounded-lg border border-ink-200/70 bg-ink-50 overflow-hidden",
        className
      )}
      style={{ height }}
    >
      {/* Basemap: grid + faux roads */}
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#mapGrid)" />
        {/* schematic roads */}
        <g stroke="#D6D6D8" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M20 100 Q 220 60 620 120" />
          <path d="M60 260 Q 260 300 620 260" />
          <path d="M120 20 Q 200 200 260 480" />
          <path d="M420 20 Q 480 200 540 480" />
        </g>
        <g stroke="#F6F6F6" strokeWidth="1.4" fill="none" strokeDasharray="4 6" strokeLinecap="round">
          <path d="M20 100 Q 220 60 620 120" />
          <path d="M60 260 Q 260 300 620 260" />
          <path d="M120 20 Q 200 200 260 480" />
          <path d="M420 20 Q 480 200 540 480" />
        </g>

        {/* Gateways */}
        {gateways.map((g) => {
          const p = project(g.lat, g.lng);
          return (
            <g key={g.id} transform={`translate(${p.x}, ${p.y})`}>
              <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#0E0E0F" />
              <path d="M-3 3v-6M3 3v-6M0 3v-8" stroke="#C69A2C" strokeWidth="1.4" />
            </g>
          );
        })}

        {/* Devices */}
        {devices.map((d) => {
          const p = project(d.lat, d.lng);
          const c = colorFor(d.status);
          const sel = selectedId === d.id;
          return (
            <g
              key={d.id}
              transform={`translate(${p.x}, ${p.y})`}
              className={cn("cursor-pointer", onSelect && "hover:opacity-100")}
              onClick={() => onSelect?.(d.id)}
            >
              {sel && (
                <circle r="10" fill={c} opacity="0.15" />
              )}
              <circle r={sel ? 5 : 3.5} fill={c} stroke="white" strokeWidth="1.4" />
              {d.status === "online" && (
                <circle r="4" fill={c} opacity="0.4">
                  <animate attributeName="r" values="4;10;4" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-2 left-2 text-[10.5px] font-mono uppercase tracking-widest text-ink-500 bg-white/80 backdrop-blur px-2 py-1 rounded border border-ink-200/70">
        Columbus, OH · {devices.length} devices
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-ink-400 bg-white/80 backdrop-blur px-2 py-1 rounded border border-ink-200/70">
        schematic view
      </div>
    </div>
  );
}
