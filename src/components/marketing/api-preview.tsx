"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

const requestExample = `GET /v1/traffic/events?road=US-33
Authorization: ******
Accept: application/json`;

const responseExample = `{
  "device_id": "RR-014",
  "timestamp": "2026-09-12T18:32:04Z",
  "vehicle_detected": true,
  "direction": "eastbound",
  "speed_kmh": 56.7,
  "vehicle_class": "SUV",
  "confidence": 0.93,
  "vibration_energy": 1842
}`;

const streamExample = `mqtt://stream.motsense.com/traffic/#

{
  "device_id": "RR-014",
  "event": "traffic.event",
  "speed_kmh": 56.7,
  "confidence": 0.93
}`;

const tabs = [
  { id: "rest", label: "REST", code: responseExample, header: requestExample },
  { id: "stream", label: "Streaming", code: streamExample, header: "subscribe to live events" },
];

export function ApiPreview() {
  const [active, setActive] = useState("rest");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-ink-900 shadow-cardDark">
      {/* Titlebar */}
      <div className="flex items-center justify-between px-4 h-10 bg-ink-950 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[11px] font-mono text-ink-400">motsense-api</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "px-2.5 h-7 rounded text-[11.5px] font-mono transition-colors",
                active === t.id
                  ? "bg-white/[0.08] text-white"
                  : "text-ink-400 hover:text-ink-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Request header */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="p-5">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-400">
            request
          </div>
          <pre className="mt-3 text-[12.5px] leading-[1.7] font-mono text-ink-100 overflow-auto">
            <code>{current.header}</code>
          </pre>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-400">
              response
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              200 OK · 41 ms
            </div>
          </div>
          <pre className="mt-3 text-[12.5px] leading-[1.7] font-mono text-ink-100 overflow-auto">
            <SyntaxJson code={current.code} />
          </pre>
        </div>
      </div>

      {/* Footer stat strip */}
      <div className="grid grid-cols-3 border-t border-white/10 bg-ink-950/60">
        {[
          { label: "avg latency", value: "42 ms" },
          { label: "endpoints", value: "18" },
          { label: "regions", value: "US · EU" },
        ].map((s) => (
          <div key={s.label} className="p-4 text-center border-r border-white/10 last:border-r-0">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-400">
              {s.label}
            </div>
            <div className="mt-1 text-[15px] font-mono text-white tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimalist syntax highlight for JSON / lines
function SyntaxJson({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <>
      {lines.map((raw, i) => {
        const line = raw
          .replace(/(&|<|>)/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" } as any)[c]);
        const parts = highlight(line);
        return (
          <div key={i} className="whitespace-pre">
            <span className="select-none text-ink-500 pr-4">{String(i + 1).padStart(2, " ")}</span>
            <span dangerouslySetInnerHTML={{ __html: parts }} />
          </div>
        );
      })}
    </>
  );
}

function highlight(line: string) {
  // keys
  line = line.replace(/(&quot;[\w_]+&quot;|"[\w_]+")\s*:/g, (m) => {
    return `<span class="text-mustard-400">${m}</span>`;
  });
  // strings
  line = line.replace(/:\s*(&quot;[^&]*&quot;|"[^"]*")/g, (_, s) => `: <span class="text-emerald-300">${s}</span>`);
  // numbers
  line = line.replace(/(:\s*)(-?\d+\.?\d*)/g, (_, p, n) => `${p}<span class="text-sky-300">${n}</span>`);
  // booleans/null
  line = line.replace(/\b(true|false|null)\b/g, `<span class="text-rose-300">$1</span>`);
  // HTTP verbs / mqtt scheme
  line = line.replace(/^(GET|POST|PUT|DELETE|PATCH)\b/, `<span class="text-mustard-400 font-semibold">$1</span>`);
  line = line.replace(/^(Authorization|Accept|Content-Type):/, `<span class="text-sky-300">$1</span>:`);
  line = line.replace(/^(mqtt:\/\/[^\s]+)/, `<span class="text-emerald-300">$1</span>`);
  return line;
}
