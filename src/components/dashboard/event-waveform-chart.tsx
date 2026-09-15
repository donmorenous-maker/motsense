"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import type { SignalWaveform } from "@/lib/api";

interface PlotPoint {
  index: number;
  value: number;
}

interface DecodedWaveform {
  samples: number[];
  min: number;
  max: number;
  peakAbs: number;
  rms: number;
  error: string | null;
}

function decodeBase64(base64: string): Uint8Array {
  const normalized = base64.replace(/\s+/g, "");

  if (typeof atob === "function") {
    const binary = atob(normalized);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(normalized, "base64"));
  }

  throw new Error("Base64 decoding is unavailable in this environment.");
}

function applyScale(value: number, waveform: SignalWaveform): number {
  const scale = waveform.scale ?? 1;
  const offset = waveform.offset_value ?? 0;
  return value * scale + offset;
}

function decodeSamples(waveform: SignalWaveform): DecodedWaveform {
  if (Array.isArray(waveform.samples) && waveform.samples.length > 0) {
    let min = waveform.samples[0];
    let max = waveform.samples[0];
    let peakAbs = Math.abs(waveform.samples[0]);
    let energy = 0;

    for (const sample of waveform.samples) {
      if (sample < min) min = sample;
      if (sample > max) max = sample;
      if (Math.abs(sample) > peakAbs) peakAbs = Math.abs(sample);
      energy += sample * sample;
    }

    const rms = Math.sqrt(energy / waveform.samples.length);

    return {
      samples: waveform.samples,
      min,
      max,
      peakAbs,
      rms,
      error: null,
    };
  }

  if (!waveform.samples_base64) {
    return {
      samples: [],
      min: 0,
      max: 0,
      peakAbs: 0,
      rms: 0,
      error: "No waveform samples were returned by the API.",
    };
  }

  try {
    const bytes = decodeBase64(waveform.samples_base64);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const normalizedEncoding = (waveform.encoding ?? "int16le").toLowerCase().replace(/[\s_-]+/g, "");
    const values: number[] = [];

    const push = (value: number) => {
      values.push(applyScale(value, waveform));
    };

    if (
      normalizedEncoding === "int16le" ||
      normalizedEncoding === "int16" ||
      normalizedEncoding === "pcm16le" ||
      normalizedEncoding === "pcms16le" ||
      normalizedEncoding === "signed16le" ||
      normalizedEncoding === "s16le"
    ) {
      for (let offset = 0; offset + 1 < view.byteLength; offset += 2) {
        push(view.getInt16(offset, true));
      }
    } else if (normalizedEncoding === "uint16le" || normalizedEncoding === "u16le") {
      for (let offset = 0; offset + 1 < view.byteLength; offset += 2) {
        push(view.getUint16(offset, true));
      }
    } else if (normalizedEncoding === "int32le" || normalizedEncoding === "int32" || normalizedEncoding === "i32le") {
      for (let offset = 0; offset + 3 < view.byteLength; offset += 4) {
        push(view.getInt32(offset, true));
      }
    } else if (normalizedEncoding === "float32le" || normalizedEncoding === "float32" || normalizedEncoding === "f32le") {
      for (let offset = 0; offset + 3 < view.byteLength; offset += 4) {
        push(view.getFloat32(offset, true));
      }
    } else if (normalizedEncoding === "int8" || normalizedEncoding === "i8") {
      for (let offset = 0; offset < view.byteLength; offset += 1) {
        push(view.getInt8(offset));
      }
    } else if (normalizedEncoding === "uint8" || normalizedEncoding === "u8") {
      for (let offset = 0; offset < view.byteLength; offset += 1) {
        push(view.getUint8(offset));
      }
    } else {
      return {
        samples: [],
        min: 0,
        max: 0,
        peakAbs: 0,
        rms: 0,
        error: `Unsupported waveform encoding: ${waveform.encoding ?? "unknown"}`,
      };
    }

    if (values.length === 0) {
      return {
        samples: [],
        min: 0,
        max: 0,
        peakAbs: 0,
        rms: 0,
        error: "The waveform payload was empty.",
      };
    }

    let min = values[0];
    let max = values[0];
    let peakAbs = Math.abs(values[0]);
    let energy = 0;

    for (const sample of values) {
      if (sample < min) min = sample;
      if (sample > max) max = sample;
      if (Math.abs(sample) > peakAbs) peakAbs = Math.abs(sample);
      energy += sample * sample;
    }

    const rms = Math.sqrt(energy / values.length);

    return {
      samples: values,
      min,
      max,
      peakAbs,
      rms,
      error: null,
    };
  } catch (error) {
    return {
      samples: [],
      min: 0,
      max: 0,
      peakAbs: 0,
      rms: 0,
      error: error instanceof Error ? error.message : "Unable to decode waveform samples.",
    };
  }
}

function formatEngineeringTime(milliseconds: number): string {
  if (milliseconds >= 1_000) {
    return `${(milliseconds / 1_000).toFixed(milliseconds >= 10_000 ? 1 : 2)} s`;
  }

  if (milliseconds >= 1) {
    return `${milliseconds.toFixed(milliseconds >= 100 ? 0 : 1)} ms`;
  }

  return `${(milliseconds * 1_000).toFixed(0)} µs`;
}

function formatNumeric(value: number, digits = 2): string {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 && Math.abs(value) < 10 ? Math.min(digits, 2) : 0,
  });
}

export function EventWaveformChart({
  waveform,
  className = "",
}: {
  waveform: SignalWaveform;
  className?: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 1200;
  const height = 330;
  const pad = { l: 56, r: 18, t: 18, b: 34 };

  const decoded = useMemo(() => decodeSamples(waveform), [waveform]);
  const sampleRate = waveform.source_sample_rate_hz ?? waveform.tx_sample_rate_hz ?? null;
  const durationMs =
    sampleRate && sampleRate > 0 && decoded.samples.length > 0 ? (decoded.samples.length / sampleRate) * 1_000 : null;

  const plotPoints = useMemo(() => {
    const sampleCount = decoded.samples.length;

    if (sampleCount === 0) {
      return [] as PlotPoint[];
    }

    const bucketCount = Math.min(520, sampleCount);
    const bucketSize = Math.max(1, Math.ceil(sampleCount / bucketCount));
    const points: PlotPoint[] = [];

    for (let start = 0; start < sampleCount; start += bucketSize) {
      const end = Math.min(sampleCount, start + bucketSize);
      let minValue = Number.POSITIVE_INFINITY;
      let maxValue = Number.NEGATIVE_INFINITY;
      let minIndex = start;
      let maxIndex = start;

      for (let index = start; index < end; index += 1) {
        const value = decoded.samples[index];

        if (value < minValue) {
          minValue = value;
          minIndex = index;
        }

        if (value > maxValue) {
          maxValue = value;
          maxIndex = index;
        }
      }

      if (minIndex <= maxIndex) {
        points.push({ index: minIndex, value: minValue });
        if (maxIndex !== minIndex) {
          points.push({ index: maxIndex, value: maxValue });
        }
      } else {
        points.push({ index: maxIndex, value: maxValue });
        points.push({ index: minIndex, value: minValue });
      }
    }

    return points;
  }, [decoded.samples]);

  const yMin = decoded.min === decoded.max ? decoded.min - 1 : decoded.min;
  const yMax = decoded.min === decoded.max ? decoded.max + 1 : decoded.max;
  const plotHeight = height - pad.t - pad.b;
  const plotWidth = width - pad.l - pad.r;

  const linePath = useMemo(() => {
    if (plotPoints.length === 0) {
      return "";
    }

    return plotPoints
      .map((point, index) => {
        const x =
          decoded.samples.length <= 1
            ? pad.l
            : pad.l + (point.index / (decoded.samples.length - 1)) * plotWidth;
        const y = pad.t + (1 - (point.value - yMin) / (yMax - yMin)) * plotHeight;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [decoded.samples.length, plotHeight, plotPoints, plotWidth, yMax, yMin]);

  const hoveredSample =
    hoverIndex === null || decoded.samples.length === 0 ? null : decoded.samples[Math.min(hoverIndex, decoded.samples.length - 1)];

  const hoveredTimeMs =
    hoveredSample === null || !sampleRate || sampleRate <= 0 ? null : (Math.min(hoverIndex ?? 0, decoded.samples.length - 1) / sampleRate) * 1_000;

  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-ink-950 text-white shadow-cardDark ${className}`.trim()}>
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-mustard-300">Signal analysis</div>
            <div className="mt-1 text-[15px] font-semibold text-white">Reconstructed vibration waveform</div>
            <div className="mt-1 text-[12px] text-white/65">
              Hover the trace to inspect amplitude over time.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px] font-mono text-white/80 sm:grid-cols-4">
            <div>
              <div className="text-white/45">Samples</div>
              <div>{decoded.samples.length.toLocaleString("en-US")}</div>
            </div>
            <div>
              <div className="text-white/45">Sample Rate</div>
              <div>{sampleRate ? `${sampleRate.toLocaleString("en-US")} Hz` : "--"}</div>
            </div>
            <div>
              <div className="text-white/45">Duration</div>
              <div>{durationMs === null ? "--" : formatEngineeringTime(durationMs)}</div>
            </div>
            <div>
              <div className="text-white/45">Cursor</div>
              <div>
                {hoveredSample === null
                  ? "--"
                  : `${hoveredTimeMs === null ? "--" : formatEngineeringTime(hoveredTimeMs)} · ${formatNumeric(
                      hoveredSample,
                      3
                    )}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {decoded.error ? (
        <div className="flex items-center gap-3 px-5 py-8 text-[13px] text-amber-200">
          <Icon.Alert size={16} className="text-amber-300" />
          <span>{decoded.error}</span>
        </div>
      ) : (
        <>
          <div className="px-3 pb-2 pt-3">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full"
              onMouseLeave={() => setHoverIndex(null)}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const relativeX = Math.min(Math.max(0, event.clientX - bounds.left), bounds.width);
                const normalized = bounds.width === 0 ? 0 : relativeX / bounds.width;
                const hovered = Math.round(normalized * Math.max(0, decoded.samples.length - 1));
                setHoverIndex(hovered);
              }}
            >
              <defs>
                <linearGradient id="waveform-line-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F6ECC8" />
                  <stop offset="40%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#C69A2C" />
                </linearGradient>
              </defs>

              <rect x="0" y="0" width={width} height={height} rx="16" fill="#08080A" />

              {Array.from({ length: 5 }, (_, index) => {
                const y = pad.t + (index / 4) * plotHeight;
                const value = yMax - ((yMax - yMin) * index) / 4;
                return (
                  <g key={`y-${index}`}>
                    <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                    <text
                      x={pad.l - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="rgba(255,255,255,0.52)"
                      fontFamily="var(--font-mono)"
                    >
                      {formatNumeric(value, 2)}
                    </text>
                  </g>
                );
              })}

              {Array.from({ length: 7 }, (_, index) => {
                const x = pad.l + (index / 6) * plotWidth;
                const valueMs = durationMs === null ? null : (index / 6) * durationMs;
                return (
                  <g key={`x-${index}`}>
                    <line x1={x} x2={x} y1={pad.t} y2={height - pad.b} stroke="rgba(255,255,255,0.05)" />
                    {valueMs !== null && (
                      <text
                        x={x}
                        y={height - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fill="rgba(255,255,255,0.52)"
                        fontFamily="var(--font-mono)"
                      >
                        {formatEngineeringTime(valueMs)}
                      </text>
                    )}
                  </g>
                );
              })}

              <line x1={pad.l} x2={width - pad.r} y1={pad.t + plotHeight / 2} y2={pad.t + plotHeight / 2} stroke="rgba(198,154,44,0.28)" />

              <path d={linePath} fill="none" stroke="url(#waveform-line-grad)" strokeWidth="1.45" strokeLinejoin="round" strokeLinecap="round" />

              {hoverIndex !== null && decoded.samples.length > 0 && (
                <>
                  <line
                    x1={pad.l + (hoverIndex / Math.max(1, decoded.samples.length - 1)) * plotWidth}
                    x2={pad.l + (hoverIndex / Math.max(1, decoded.samples.length - 1)) * plotWidth}
                    y1={pad.t}
                    y2={height - pad.b}
                    stroke="rgba(255,255,255,0.34)"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={pad.l + (hoverIndex / Math.max(1, decoded.samples.length - 1)) * plotWidth}
                    cy={
                      pad.t +
                      (1 - ((decoded.samples[hoverIndex] ?? 0) - yMin) / (yMax - yMin)) * plotHeight
                    }
                    r="4"
                    fill="#F6ECC8"
                    stroke="#C69A2C"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </svg>
          </div>

          <div className="grid gap-3 border-t border-white/10 px-5 py-4 text-[12px] font-mono text-white/75 sm:grid-cols-4">
            <div>
              <div className="text-white/45">Amplitude Span</div>
              <div>{formatNumeric(decoded.max - decoded.min, 3)}</div>
            </div>
            <div>
              <div className="text-white/45">Peak Abs</div>
              <div>{formatNumeric(decoded.peakAbs, 3)}</div>
            </div>
            <div>
              <div className="text-white/45">RMS</div>
              <div>{formatNumeric(decoded.rms, 3)}</div>
            </div>
            <div>
              <div className="text-white/45">Encoding</div>
              <div>{waveform.encoding ?? "--"}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
