"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { NetworkMap } from "@/components/dashboard/network-map";
import { devices, gateways, events } from "@/data/mock";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/badge";

export default function LiveMapPage() {
  const [selectedId, setSelectedId] = useState<string | null>("RR-014");
  const selected = devices.find((d) => d.id === selectedId) ?? null;
  const recent = selected
    ? events.filter((e) => e.deviceId === selected.id).slice(0, 5)
    : [];

  return (
    <>
      <DashboardTopbar title="Live Map" description="Interactive road network view" />
      <div className="p-5 md:p-6 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-ink-200/70 bg-white overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-5 h-12 border-b border-ink-200/70">
              <div className="flex items-center gap-3 text-[12.5px] text-ink-600">
                <StatusDot tone="success" />
                Live · {devices.filter((d) => d.status === "online").length} online · {gateways.length} gateways
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Filter label="All roads" />
                <Filter label="All statuses" />
                <Filter label="24h" />
              </div>
            </div>
            <div className="p-4">
              <NetworkMap
                devices={devices}
                gateways={gateways}
                height={560}
                selectedId={selectedId ?? undefined}
                onSelect={(id) => setSelectedId(id)}
              />
            </div>
          </div>

          <aside className="rounded-xl border border-ink-200/70 bg-white shadow-card overflow-hidden flex flex-col">
            {selected ? (
              <>
                <div className="px-5 py-4 border-b border-ink-200/70 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">
                      Road sensor
                    </div>
                    <div className="mt-1 text-[15px] font-semibold text-ink-900 font-mono">
                      MOTSENSE-{selected.id}
                    </div>
                    <div className="mt-1 text-[12px] text-ink-500 flex items-center gap-1.5">
                      <StatusDot tone={selected.status === "online" ? "success" : selected.status === "warning" ? "warning" : "danger"} />
                      {selected.status === "online" ? "Online" : selected.status === "warning" ? "Warning" : "Offline"} ·{" "}
                      Last packet {formatSecondsAgo(selected.lastSeenSec)}
                    </div>
                  </div>
                  <button className="text-ink-400 hover:text-ink-900" onClick={() => setSelectedId(null)} aria-label="Close">
                    <Icon.X size={16} />
                  </button>
                </div>

                <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
                  <Field label="Battery" value={`${selected.voltage.toFixed(2)} V`} />
                  <Field label="Temperature" value={`${selected.temperature.toFixed(1)} °C`} />
                  <Field label="RSSI" value={`${selected.rssi} dBm`} />
                  <Field label="SNR" value={`${selected.snr > 0 ? "+" : ""}${selected.snr.toFixed(1)} dB`} />
                  <Field label="Vehicles today" value={selected.vehiclesToday.toLocaleString()} />
                  <Field label="Average speed" value={`${selected.avgSpeedMph.toFixed(1)} mph`} />
                  <Field label="Gateway" value={selected.gateway} />
                  <Field label="Firmware" value={selected.firmware} />
                </div>

                <div className="px-5 py-4 border-t border-ink-200/70">
                  <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500 mb-2">
                    Recent events
                  </div>
                  <div className="space-y-1.5 font-mono text-[12px]">
                    {recent.map((e) => (
                      <div key={e.id} className="flex items-center justify-between text-ink-700">
                        <span>{new Date(e.timestamp).toISOString().slice(11, 19)}Z</span>
                        <span>{e.direction.slice(0, 1)} · {e.speedKmh.toFixed(1)} km/h</span>
                        <span className="text-ink-500">{e.vehicleClass}</span>
                      </div>
                    ))}
                    {recent.length === 0 && (
                      <div className="text-ink-500 italic">No recent events.</div>
                    )}
                  </div>
                </div>

                <div className="mt-auto p-5 border-t border-ink-200/70 grid grid-cols-3 gap-2">
                  <ButtonLink href={`/app/devices/${selected.id}`} variant="secondary" size="sm">
                    View Device
                  </ButtonLink>
                  <ButtonLink href={`/app/events?device=${selected.id}`} variant="outline" size="sm">
                    View Events
                  </ButtonLink>
                  <ButtonLink href="/app/analytics" variant="outline" size="sm">
                    Analytics
                  </ButtonLink>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-ink-500 text-[13.5px]">
                <div className="mx-auto h-10 w-10 rounded-full border border-ink-200 flex items-center justify-center mb-3 text-ink-400">
                  <Icon.Pin size={16} />
                </div>
                Select a sensor on the map to inspect it.
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function formatSecondsAgo(seconds: number) {
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

function Filter({ label }: { label: string }) {
  return (
    <button className="h-8 px-2.5 rounded-md border border-ink-200 bg-white text-[12px] text-ink-700 hover:border-ink-900/30 flex items-center gap-1.5">
      {label}
      <Icon.ChevronDown size={12} />
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 font-mono text-[13.5px] text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
