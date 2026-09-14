"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import type { VehicleEvent } from "@/lib/api";
import {
  formatBattery,
  formatBoolean,
  formatConfidence,
  formatDataRate,
  formatDateTime,
  formatDeviceName,
  formatDeviceUptime,
  formatDirection,
  formatFrequency,
  formatPlainNumber,
  formatRssi,
  formatSnr,
  formatSpeed,
  formatTemperature,
  formatTime,
  formatVehicleClass,
} from "@/lib/formatters";
import type { ConnectionState } from "@/lib/use-dashboard-data";

function eventKey(event: VehicleEvent, index: number): string {
  return event.id ?? event.event_uid ?? `${event.device_eui}-${event.frame_counter ?? "frame"}-${event.created_at ?? index}`;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-400">
        <Icon.Activity size={14} />
      </div>
      <div className="mt-3 text-[14px] font-medium text-ink-900">{title}</div>
      <div className="mt-1 text-[13px] text-ink-500">{description}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3 px-5 py-5">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-lg bg-ink-100" />
      ))}
    </div>
  );
}

function EventDetailsDrawer({
  event,
  onClose,
}: {
  event: VehicleEvent;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30" />
      <div
        onClick={(clickedEvent) => clickedEvent.stopPropagation()}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-ink-200/70 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-ink-200/70 px-5 py-4">
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">Traffic event</div>
            <div className="mt-1 text-[15px] font-semibold text-ink-900">{formatDeviceName(event)}</div>
            <div className="mt-1 text-[12px] text-ink-500">{formatDateTime(event.created_at)}</div>
          </div>
          <button onClick={onClose} className="text-ink-400 transition-colors hover:text-ink-900" aria-label="Close event details">
            <Icon.X size={16} />
          </button>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 text-[13px]">
          {[
            ["Device Name", event.device_name ?? "--"],
            ["DevEUI", event.device_eui || "--"],
            ["Gateway ID", event.gateway_id ?? "--"],
            ["Frame Counter", formatPlainNumber(event.frame_counter)],
            ["FPort", formatPlainNumber(event.fport)],
            ["ADR", formatBoolean(event.adr)],
            ["Frequency", formatFrequency(event.frequency_hz)],
            ["Data Rate", formatDataRate(event.data_rate)],
            ["RSSI", formatRssi(event.rssi_dbm)],
            ["SNR", formatSnr(event.snr_db)],
            ["Device Uptime", formatDeviceUptime(event.device_uptime_s)],
            ["Vibration Energy", formatPlainNumber(event.vibration_energy)],
            ["Battery", formatBattery(event.battery_v)],
            ["Temperature", formatTemperature(event.temperature_c)],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
              <div className="mt-1 font-mono text-ink-900">{value}</div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <div className="mb-2 text-[10.5px] font-mono uppercase tracking-widest text-ink-500">Payload Hex</div>
          <pre className="overflow-auto rounded-lg bg-ink-950 p-3 text-[12px] leading-[1.7] text-ink-100">
            {event.payload_hex ?? "--"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function LiveEventsTable({
  events,
  status,
  isLoading,
  error,
  limit,
  title = "Traffic events",
  showViewAll = false,
}: {
  events: VehicleEvent[];
  status: ConnectionState;
  isLoading: boolean;
  error: string | null;
  limit?: number;
  title?: string;
  showViewAll?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rows = useMemo(() => (typeof limit === "number" ? events.slice(0, limit) : events), [events, limit]);
  const openEvent = openIndex === null ? null : rows[openIndex] ?? null;

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            <div className="mt-0.5 text-[11.5px] text-ink-500">
              Newest traffic events first. Tap a row for engineering details.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status === "degraded" && <Badge tone="warning">Degraded</Badge>}
            {status === "offline" && <Badge tone="danger">Offline</Badge>}
            {showViewAll && (
              <Link
                href="/app/events"
                className="inline-flex items-center gap-1 text-[12px] text-mustard-600 transition-colors hover:text-mustard-500"
              >
                View all <Icon.ArrowUpRight size={12} />
              </Link>
            )}
          </div>
        </CardHeader>
        {isLoading && rows.length === 0 ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState
            title={status === "offline" ? "API unavailable" : "No events yet"}
            description={
              status === "offline"
                ? "The dashboard could not load initial traffic data from the API."
                : "Traffic events will appear here when the Motsense network starts reporting."
            }
          />
        ) : (
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-[13px]">
                <thead className="border-b border-ink-200/70 text-left text-[10.5px] font-mono uppercase tracking-widest text-ink-500">
                  <tr>
                    {[
                      "Time",
                      "Device",
                      "Speed",
                      "Direction",
                      "Vehicle Class",
                      "Confidence",
                      "Vibration Energy",
                      "Battery",
                      "Temperature",
                      "RSSI",
                      "SNR",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-3 font-medium">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                  {rows.map((event, index) => (
                    <tr
                      key={eventKey(event, index)}
                      onClick={() => setOpenIndex(index)}
                      className="cursor-pointer transition-colors hover:bg-ink-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-ink-500">{formatTime(event.created_at)}</td>
                      <td className="px-5 py-3 text-ink-900">{formatDeviceName(event)}</td>
                      <td className="px-5 py-3 text-ink-900">{formatSpeed(event.speed_kmh)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatDirection(event.direction)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatVehicleClass(event.vehicle_class)}</td>
                      <td className="px-5 py-3 text-ink-900">{formatConfidence(event.confidence_pct)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatPlainNumber(event.vibration_energy)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatBattery(event.battery_v)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatTemperature(event.temperature_c)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatRssi(event.rssi_dbm)}</td>
                      <td className="px-5 py-3 text-ink-700">{formatSnr(event.snr_db)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && status !== "live" && (
              <div className="border-t border-ink-200/70 px-5 py-3 text-[12px] text-amber-700">{error}</div>
            )}
          </CardBody>
        )}
      </Card>
      {openEvent && <EventDetailsDrawer event={openEvent} onClose={() => setOpenIndex(null)} />}
    </>
  );
}
