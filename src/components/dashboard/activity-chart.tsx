import { cn } from "@/lib/utils";

interface Point {
  hour?: string;
  day?: string;
  bucket?: string;
  label?: string;
  value: number;
}

/**
 * Simple area chart (no dependency) rendered as SVG.
 * Deterministic — safe for SSR.
 */
export function ActivityChart({
  data,
  height = 200,
  color = "#C69A2C",
  className,
}: {
  data: Point[];
  height?: number;
  color?: string;
  className?: string;
}) {
  const width = 700;
  const pad = { l: 28, r: 8, t: 10, b: 22 };
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const step = (width - pad.l - pad.r) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = pad.l + i * step;
    const y = pad.t + (1 - d.value / max) * (height - pad.t - pad.b);
    return { x, y, label: d.hour ?? d.day ?? d.bucket ?? d.label ?? "", value: d.value };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${pad.l + (data.length - 1) * step} ${height - pad.b} L ${pad.l} ${height - pad.b} Z`;

  const yTicks = 4;

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = pad.t + (i / yTicks) * (height - pad.t - pad.b);
          const v = (max * (yTicks - i)) / yTicks;
          return (
            <g key={i}>
              <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" />
              <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#7C7C82" fontFamily="var(--font-mono)">
                {Math.round(v)}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#area-grad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.75" />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 3 : 1.6} fill={color}>
            {i === points.length - 1 && (
              <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
            )}
          </circle>
        ))}

        {/* X labels — sparse */}
        {points.map((p, i) => {
          if (i % Math.ceil(points.length / 8) !== 0 && i !== points.length - 1) return null;
          return (
            <text
              key={`xl-${i}`}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              fontSize="9.5"
              fill="#7C7C82"
              fontFamily="var(--font-mono)"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Bar chart used for histograms and distributions.
 */
export function BarChart({
  data,
  height = 200,
  color = "#0E0E0F",
  highlight = "#C69A2C",
  className,
  valueSuffix = "",
}: {
  data: Point[];
  height?: number;
  color?: string;
  highlight?: string;
  className?: string;
  valueSuffix?: string;
}) {
  const width = 700;
  const pad = { l: 30, r: 10, t: 16, b: 26 };
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const bandW = (width - pad.l - pad.r) / data.length;
  const maxIdx = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0);

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {[0.25, 0.5, 0.75, 1].map((f) => {
          const y = pad.t + (1 - f) * (height - pad.t - pad.b);
          return <line key={f} x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" />;
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * (height - pad.t - pad.b);
          const x = pad.l + i * bandW + 4;
          const y = height - pad.b - h;
          const w = bandW - 8;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={2}
                fill={i === maxIdx ? highlight : color}
                opacity={i === maxIdx ? 1 : 0.85}
              />
              <text
                x={x + w / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="9.5"
                fill="#54545A"
                fontFamily="var(--font-mono)"
              >
                {d.hour ?? d.day ?? d.bucket ?? d.label}
              </text>
              <text
                x={x + w / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="9.5"
                fill="#25252A"
                fontFamily="var(--font-mono)"
              >
                {d.value}
                {valueSuffix}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Horizontal segmented bar for distributions.
 */
export function SegmentedBar({
  segments,
}: {
  segments: { label: string; value: number; color?: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const palette = ["#0E0E0F", "#C69A2C", "#54545A", "#B0B0B4", "#A17A20", "#7C7C82", "#D4AF37"];
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden border border-ink-200/70">
        {segments.map((s, i) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color ?? palette[i % palette.length],
            }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-[12.5px]">
        {segments.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: s.color ?? palette[i % palette.length] }}
            />
            <span className="text-ink-700">{s.label}</span>
            <span className="ml-auto text-ink-500 font-mono tabular-nums">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
