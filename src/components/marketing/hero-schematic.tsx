"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { useEffect, useState } from "react";

/**
 * Elegant technical schematic showing the flow:
 *   Vehicle → Road → Sensor → LoRaWAN → Cloud → Data
 * Animated line pulses convey data flowing to the cloud.
 */
export function HeroSchematic({ className }: { className?: string }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[7/5] rounded-2xl border border-white/10 overflow-hidden",
        "bg-ink-950 bg-grid-dark bg-grid",
        className
      )}
    >
      {/* Radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(198,154,44,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(255,255,255,0.06),transparent_60%)]" />

      <svg viewBox="0 0 700 500" className="absolute inset-0 h-full w-full">
        {/* Cloud */}
        <g transform="translate(500, 60)">
          <rect
            x="0"
            y="0"
            width="150"
            height="70"
            rx="10"
            fill="#18181C"
            stroke="rgba(255,255,255,0.14)"
          />
          <text x="16" y="26" fill="#ECECEE" fontSize="12" fontFamily="var(--font-mono)">
            motsense.cloud
          </text>
          <circle cx="20" cy="46" r="3" fill="#C69A2C" />
          <text x="30" y="50" fill="#B0B0B4" fontSize="11">
            traffic_events · api · analytics
          </text>
        </g>

        {/* Antenna / Gateway */}
        <g transform="translate(340, 130)">
          <rect
            x="0"
            y="0"
            width="120"
            height="46"
            rx="6"
            fill="#18181C"
            stroke="rgba(255,255,255,0.14)"
          />
          <text x="12" y="20" fill="#ECECEE" fontSize="11" fontFamily="var(--font-mono)">
            WISGATE
          </text>
          <text x="12" y="34" fill="#7C7C82" fontSize="10">
            LoRaWAN · US915
          </text>
          <path
            d="M100 8 L100 -14 M92 -10 A14 14 0 0 1 108 -10 M96 -6 A8 8 0 0 1 104 -6"
            stroke="#C69A2C"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Road surface with sensor */}
        <g>
          {/* Perspective road */}
          <path d="M40 430 L300 250 L400 250 L660 430 Z" fill="#0B0B0D" stroke="rgba(255,255,255,0.06)" />
          {/* Lane markings */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={150 + i * 90}
              y={340 - i * 22}
              width={40 - i * 6}
              height={6 - i * 0.6}
              fill="#C69A2C"
              opacity={0.75}
              transform={`skewX(-6)`}
            />
          ))}
          {/* Sensor puck in the road */}
          <g transform="translate(348, 350)">
            <ellipse cx="0" cy="6" rx="26" ry="6" fill="rgba(0,0,0,0.5)" />
            <circle cx="0" cy="0" r="14" fill="#18181C" stroke="#C69A2C" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#C69A2C">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="-24" textAnchor="middle" fill="#ECECEE" fontSize="10" fontFamily="var(--font-mono)">
              RR-014
            </text>
          </g>

          {/* Vehicle */}
          <g transform={`translate(${180 + ((tick * 60) % 260)}, 300)`}>
            <rect x="-18" y="-10" width="36" height="14" rx="3" fill="#ECECEE" />
            <rect x="-12" y="-18" width="20" height="10" rx="2" fill="#ECECEE" />
            <circle cx="-11" cy="6" r="3" fill="#0E0E0F" />
            <circle cx="11" cy="6" r="3" fill="#0E0E0F" />
          </g>
        </g>

        {/* Data path lines */}
        {/* Sensor -> Gateway */}
        <path
          d="M348 340 C 360 260, 380 200, 400 176"
          stroke="rgba(198,154,44,0.35)"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="3 4"
        />
        {/* Gateway -> Cloud */}
        <path
          d="M460 150 C 500 130, 520 110, 560 100"
          stroke="rgba(198,154,44,0.35)"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="3 4"
        />

        {/* Animated pulse dots along paths */}
        <circle r="3" fill="#C69A2C">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M348 340 C 360 260, 380 200, 400 176" />
        </circle>
        <circle r="3" fill="#C69A2C">
          <animateMotion dur="2.6s" begin="0.8s" repeatCount="indefinite" path="M460 150 C 500 130, 520 110, 560 100" />
        </circle>

        {/* Right-side data readout card */}
        <g transform="translate(40, 40)">
          <rect
            x="0"
            y="0"
            width="240"
            height="88"
            rx="8"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)"
          />
          <text x="14" y="22" fill="#B0B0B4" fontSize="10" fontFamily="var(--font-mono)">
            traffic_event
          </text>
          <text x="14" y="42" fill="#ECECEE" fontSize="14" fontFamily="var(--font-mono)">
            56.7 km/h
          </text>
          <text x="14" y="58" fill="#7C7C82" fontSize="10" fontFamily="var(--font-mono)">
            eastbound · SUV · 0.93
          </text>
          <circle cx="220" cy="20" r="4" fill="#22C55E">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Corner labels */}
        <text x="510" y="180" fill="#7C7C82" fontSize="10" fontFamily="var(--font-mono)">
          cloud ingest
        </text>
        <text x="310" y="220" fill="#7C7C82" fontSize="10" fontFamily="var(--font-mono)">
          gateway
        </text>
        <text x="300" y="400" fill="#7C7C82" fontSize="10" fontFamily="var(--font-mono)">
          road sensor
        </text>
      </svg>
    </div>
  );
}
