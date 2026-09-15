"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { EventWaveformChart } from "@/components/dashboard/event-waveform-chart";
import { SegmentedBar } from "@/components/dashboard/activity-chart";
import { getWaveform, type JsonValue, type SignalWaveform, type VehicleEvent } from "@/lib/api";
import {
  formatBattery,
  formatConfidence,
  formatDataRate,
  formatDateTime,
  formatDeviceName,
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
  return event.event_id ?? event.id ?? event.event_uid ?? `${event.device_eui}-${event.frame_counter ?? "frame"}-${event.created_at ?? index}`;
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatMetric(value: number | null | undefined, digits = 2, unit = ""): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: digits === 0 ? 0 : value % 1 === 0 ? 0 : Math.min(2, digits),
    maximumFractionDigits: digits,
  })}${unit ? ` ${unit}` : ""}`;
}

function formatSampleRate(value: number | null | undefined): string {
  return formatMetric(value, 0, "Hz");
}

function formatPercent(value: number | null | undefined): string {
  return formatMetric(value, 1, "%");
}

function formatAvailability(value: boolean | null | undefined): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "--";
}

function formatEventIdentifier(event: VehicleEvent): string {
  return event.event_id ?? event.id ?? event.event_uid ?? "--";
}

function computeDurationMs(sampleCount: number | null | undefined, sampleRate: number | null | undefined): number | null {
  if (!isFiniteNumber(sampleCount) || !isFiniteNumber(sampleRate) || sampleRate <= 0) {
    return null;
  }

  return (sampleCount / sampleRate) * 1_000;
}

function resolveEventDurationMs(event: VehicleEvent, waveform: SignalWaveform | null): number | null {
  return (
    computeDurationMs(event.raw_sample_count, event.source_sample_rate_hz) ??
    computeDurationMs(event.tx_sample_count, event.tx_sample_rate_hz) ??
    computeDurationMs(
      waveform?.total_samples ?? null,
      waveform?.source_sample_rate_hz ?? waveform?.tx_sample_rate_hz ?? null
    )
  );
}

function formatDuration(value: number | null): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 1 : 2)} s`;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ms`;
}

function formatJsonValue(value: JsonValue): string {
  if (value === null) {
    return "--";
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatJsonValue(entry)).join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function flattenFeatureEntries(value: JsonValue | null | undefined, prefix = ""): Array<[string, string]> {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return [[prefix || "Values", value.map((entry) => formatJsonValue(entry)).join(", ")]];
  }

  if (typeof value !== "object") {
    return [[prefix || "Value", formatJsonValue(value)]];
  }

  return Object.entries(value).flatMap(([key, entry]) => {
    const nextLabel = prefix ? `${prefix} · ${key}` : key;
    if (entry !== null && typeof entry === "object" && !Array.isArray(entry)) {
      return flattenFeatureEntries(entry, nextLabel);
    }

    return [[nextLabel, formatJsonValue(entry)]];
  });
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

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="items-start">
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">{eyebrow}</div>
          <CardTitle className="mt-1">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function DetailGrid({
  items,
  columns = 2,
}: {
  items: Array<[string, string]>;
  columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-x-5 gap-y-4 text-[13px] ${columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      {items.map(([label, value]) => (
        <div key={label}>
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
          <div className="mt-1 break-words font-mono text-ink-900">{value}</div>
        </div>
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
  const [waveform, setWaveform] = useState<SignalWaveform | null>(null);
  const [waveformStatus, setWaveformStatus] = useState<"idle" | "loading" | "ready" | "error">(
    event.waveform_complete ? "loading" : "idle"
  );
  const [waveformError, setWaveformError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (browserEvent: KeyboardEvent) => {
      if (browserEvent.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!event.waveform_complete) {
      setWaveform(null);
      setWaveformStatus("idle");
      setWaveformError(null);
      return;
    }

    const controller = new AbortController();

    setWaveform(null);
    setWaveformStatus("loading");
    setWaveformError(null);

    void getWaveform(
      {
        deviceEui: event.device_eui,
        eventId: event.event_id ?? event.id ?? event.event_uid,
      },
      controller.signal
    )
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        setWaveform(response);
        setWaveformStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setWaveform(null);
        setWaveformStatus("error");
        setWaveformError(error instanceof Error ? error.message : "Unable to load waveform data.");
      });

    return () => controller.abort();
  }, [event.device_eui, event.event_id, event.event_uid, event.id, event.waveform_complete]);

  const duration = resolveEventDurationMs(event, waveform);
  const bandSegments = [
    { label: "0–20 Hz", value: event.band_energy_0_20_pct ?? 0, color: "#F6ECC8" },
    { label: "20–40 Hz", value: event.band_energy_20_40_pct ?? 0, color: "#E2C458" },
    { label: "40–60 Hz", value: event.band_energy_40_60_pct ?? 0, color: "#D4AF37" },
    { label: "60–100 Hz", value: event.band_energy_60_100_pct ?? 0, color: "#A17A20" },
    { label: "100–200 Hz", value: event.band_energy_100_200_pct ?? 0, color: "#7A5C18" },
  ];
  const hasBandEnergy = bandSegments.some((segment) => segment.value > 0);
  const serverFeatureEntries = flattenFeatureEntries(waveform?.server_features).slice(0, 18);

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30" />
      <div
        onClick={(clickedEvent) => clickedEvent.stopPropagation()}
        className="h-full w-full max-w-[min(96vw,1180px)] overflow-y-auto border-l border-ink-200/70 bg-ink-50 shadow-xl"
      >
        <div className="sticky top-0 z-10 border-b border-ink-200/70 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-600">Traffic event</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="truncate text-[16px] font-semibold text-ink-900">{formatDeviceName(event)}</div>
                <Badge tone={event.waveform_complete ? "gold" : "neutral"} className="shrink-0">
                  <Icon.Activity size={11} />
                  {event.waveform_complete ? "Signal Available" : "No Signal"}
                </Badge>
              </div>
              <div className="mt-1 text-[12px] text-ink-500">{formatDateTime(event.created_at)}</div>
            </div>
            <button
              onClick={onClose}
              className="text-ink-400 transition-colors hover:text-ink-900"
              aria-label="Close event details"
            >
              <Icon.X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {!event.waveform_complete ? (
            <Card dark>
              <CardBody className="flex items-start gap-3">
                <Icon.Info size={16} className="mt-0.5 text-mustard-400" />
                <div>
                  <div className="text-[13px] font-medium text-white">No reconstructed waveform is available for this event.</div>
                  <div className="mt-1 text-[12px] text-white/65">
                    Event metadata and radio telemetry are still available for engineering review.
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : waveformStatus === "loading" ? (
            <Card dark>
              <CardBody className="space-y-3">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-300">Signal analysis</div>
                <div className="h-[280px] animate-pulse rounded-lg bg-white/[0.06]" />
                <div className="text-[12px] text-white/65">Loading reconstructed waveform from /api/waveform…</div>
              </CardBody>
            </Card>
          ) : waveformStatus === "error" || waveform === null ? (
            <Card dark>
              <CardBody className="flex items-start gap-3">
                <Icon.Alert size={16} className="mt-0.5 text-amber-300" />
                <div>
                  <div className="text-[13px] font-medium text-white">Waveform data could not be loaded.</div>
                  <div className="mt-1 text-[12px] text-white/65">{waveformError ?? "Unknown waveform error."}</div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <EventWaveformChart waveform={waveform} />
          )}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <div className="space-y-5">
              <SectionCard eyebrow="Event information" title="Vehicle event metadata">
                <DetailGrid
                  items={[
                    ["Event ID", formatEventIdentifier(event)],
                    ["Device Name", formatDeviceName(event)],
                    ["DevEUI", event.device_eui || "--"],
                    ["Time", formatDateTime(event.created_at)],
                    ["Vehicle Class", formatVehicleClass(event.vehicle_class)],
                    ["Direction", formatDirection(event.direction)],
                    ["Speed", formatSpeed(event.speed_kmh)],
                    ["Confidence", formatConfidence(event.confidence_pct)],
                  ]}
                />
              </SectionCard>

              <SectionCard eyebrow="Signal information" title="Acquisition and transport">
                <DetailGrid
                  items={[
                    ["Source Sample Rate", formatSampleRate(event.source_sample_rate_hz)],
                    ["Transmitted Sample Rate", formatSampleRate(event.tx_sample_rate_hz)],
                    ["Raw Sample Count", formatPlainNumber(event.raw_sample_count)],
                    ["Transmitted Sample Count", formatPlainNumber(event.tx_sample_count)],
                    ["Event Duration", formatDuration(duration)],
                    ["Signal Chunk Count", formatPlainNumber(event.signal_chunk_count)],
                    ["Waveform Complete", formatAvailability(event.waveform_complete)],
                    ["Protocol Version", event.protocol_version ?? "--"],
                  ]}
                />
              </SectionCard>

              <SectionCard eyebrow="DSP features" title="Server-derived vibration metrics">
                <div className="space-y-5">
                  <DetailGrid
                    items={[
                      ["Vibration Energy", formatMetric(event.vibration_energy, 2)],
                      ["Peak Abs", formatMetric(event.peak_abs, 3)],
                      ["RMS", formatMetric(event.rms, 3)],
                      ["Peak to Peak", formatMetric(event.peak_to_peak, 3)],
                      ["Crest Factor", formatMetric(event.crest_factor, 3)],
                      ["Kurtosis", formatMetric(event.kurtosis, 3)],
                      ["Zero Crossings", formatPlainNumber(event.zero_crossings)],
                      ["Spectral Entropy", formatMetric(event.spectral_entropy, 3)],
                      ["Dominant Frequency", formatMetric(event.dominant_frequency_hz, 1, "Hz")],
                      ["Spectral Centroid", formatMetric(event.spectral_centroid_hz, 1, "Hz")],
                    ]}
                  />
                  {hasBandEnergy && (
                    <div>
                      <div className="mb-2 text-[10.5px] font-mono uppercase tracking-widest text-ink-500">
                        Band energy distribution
                      </div>
                      <SegmentedBar segments={bandSegments} />
                    </div>
                  )}
                  {!hasBandEnergy && (
                    <DetailGrid
                      columns={1}
                      items={[
                        ["0–20 Hz", formatPercent(event.band_energy_0_20_pct)],
                        ["20–40 Hz", formatPercent(event.band_energy_20_40_pct)],
                        ["40–60 Hz", formatPercent(event.band_energy_40_60_pct)],
                        ["60–100 Hz", formatPercent(event.band_energy_60_100_pct)],
                        ["100–200 Hz", formatPercent(event.band_energy_100_200_pct)],
                      ]}
                    />
                  )}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Payload" title="Raw uplink payload">
                <pre className="overflow-auto rounded-lg bg-ink-950 p-3 text-[12px] leading-[1.7] text-ink-100">
                  {event.payload_hex ?? "--"}
                </pre>
              </SectionCard>
            </div>

            <div className="space-y-5">
              <SectionCard eyebrow="Device information" title="Sensor operating state">
                <DetailGrid
                  columns={1}
                  items={[
                    ["Battery", formatBattery(event.battery_v)],
                    ["Temperature", formatTemperature(event.temperature_c)],
                  ]}
                />
              </SectionCard>

              <SectionCard eyebrow="Radio information" title="Gateway uplink telemetry">
                <DetailGrid
                  columns={1}
                  items={[
                    ["RSSI", formatRssi(event.rssi_dbm)],
                    ["SNR", formatSnr(event.snr_db)],
                    ["Gateway", event.gateway_id ?? "--"],
                    ["Frequency", formatFrequency(event.frequency_hz)],
                    ["Data Rate", formatDataRate(event.data_rate)],
                  ]}
                />
              </SectionCard>

              <SectionCard eyebrow="Waveform record" title="Stored reconstruction metadata">
                <DetailGrid
                  columns={1}
                  items={[
                    ["Sensor Type", waveform?.sensor_type ?? "--"],
                    ["Encoding", waveform?.encoding ?? "--"],
                    ["Stored Samples", formatPlainNumber(waveform?.total_samples)],
                    ["Stored Chunks", formatPlainNumber(waveform?.chunk_count)],
                    ["Scale", formatMetric(waveform?.scale, 6)],
                    ["Offset", formatMetric(waveform?.offset_value, 6)],
                    ["Complete", formatAvailability(waveform?.complete)],
                    ["Assembled At", formatDateTime(waveform?.assembled_at)],
                    ["Created At", formatDateTime(waveform?.created_at)],
                    ["SHA-256", waveform?.waveform_sha256 ?? "--"],
                  ]}
                />
              </SectionCard>

              {serverFeatureEntries.length > 0 && (
                <SectionCard eyebrow="Server features" title="Waveform feature payload">
                  <DetailGrid columns={1} items={serverFeatureEntries} />
                </SectionCard>
              )}
            </div>
          </div>
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
  const [openEventKey, setOpenEventKey] = useState<string | null>(null);

  const rows = useMemo(() => (typeof limit === "number" ? events.slice(0, limit) : events), [events, limit]);
  const openEvent =
    openEventKey === null
      ? null
      : rows.find((event, index) => eventKey(event, index) === openEventKey) ?? null;

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            <div className="mt-0.5 text-[11.5px] text-ink-500">
              Newest traffic events first. Tap a row for engineering details or open a reconstructed signal.
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
              <table className="min-w-[1180px] w-full text-[13px]">
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
                      "Signal",
                      "Action",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-3 font-medium">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/60 font-mono tabular-nums">
                  {rows.map((event, index) => {
                    const key = eventKey(event, index);
                    const hasSignal = event.waveform_complete === true;

                    return (
                      <tr
                        key={key}
                        onClick={() => setOpenEventKey(key)}
                        className="cursor-pointer transition-colors hover:bg-ink-50/70"
                      >
                        <td className="whitespace-nowrap px-5 py-3 text-ink-500">{formatTime(event.created_at)}</td>
                        <td className="px-5 py-3 text-ink-900">{formatDeviceName(event)}</td>
                        <td className="px-5 py-3 text-ink-900">{formatSpeed(event.speed_kmh)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatDirection(event.direction)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatVehicleClass(event.vehicle_class)}</td>
                        <td className="px-5 py-3 text-ink-900">{formatConfidence(event.confidence_pct)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatMetric(event.vibration_energy, 2)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatBattery(event.battery_v)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatTemperature(event.temperature_c)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatRssi(event.rssi_dbm)}</td>
                        <td className="px-5 py-3 text-ink-700">{formatSnr(event.snr_db)}</td>
                        <td className="px-5 py-3">
                          <Badge tone={hasSignal ? "gold" : "neutral"} className="whitespace-nowrap">
                            <Icon.Activity size={11} />
                            {hasSignal ? "Signal Available" : "No Signal"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3" onClick={(clickedEvent) => clickedEvent.stopPropagation()}>
                          <Button
                            variant={hasSignal ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => setOpenEventKey(key)}
                          >
                            {hasSignal ? "View Signal" : "View Details"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {error && status !== "live" && (
              <div className="border-t border-ink-200/70 px-5 py-3 text-[12px] text-amber-700">{error}</div>
            )}
          </CardBody>
        )}
      </Card>
      {openEvent && <EventDetailsDrawer event={openEvent} onClose={() => setOpenEventKey(null)} />}
    </>
  );
}
