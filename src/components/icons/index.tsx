import { cn } from "@/lib/utils";
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("shrink-0", className),
    ...rest,
  };
}

export const Icon = {
  ArrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowUpRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  ChevronDown: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Radio: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.5M16.2 7.8a6 6 0 0 1 0 8.5M19.1 4.9a10 10 0 0 1 0 14.2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Wifi: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  Cloud: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M17 18H7a5 5 0 0 1-.7-9.95A7 7 0 0 1 20 10.5a4.5 4.5 0 0 1-3 7.5z" />
    </svg>
  ),
  Cpu: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  ),
  Car: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 13l1.5-5a2 2 0 0 1 1.9-1.5h11.2A2 2 0 0 1 19.5 8L21 13" />
      <path d="M3 13v5h3v-2h12v2h3v-5H3z" />
      <circle cx="7.5" cy="16" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="16" r="1.2" fill="currentColor" />
    </svg>
  ),
  Gauge: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 14l5-5" />
      <path d="M4 15a8 8 0 1 1 16 0" />
      <circle cx="12" cy="14" r="1.4" fill="currentColor" />
    </svg>
  ),
  Compass: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 5-5 2 2-5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    </svg>
  ),
  Layers: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
  Bolt: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  Zap: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  Api: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </svg>
  ),
  Code: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </svg>
  ),
  Terminal: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h5" />
    </svg>
  ),
  Map: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v16M15 6v16" />
    </svg>
  ),
  Pin: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Building: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-4h4v4" />
    </svg>
  ),
  Battery: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M21 10v4" />
      <rect x="5" y="9" width="8" height="6" fill="currentColor" stroke="none" />
    </svg>
  ),
  Thermo: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 4a2 2 0 0 0-4 0v10a4 4 0 1 0 4 0V4z" />
    </svg>
  ),
  Antenna: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 3l3 3M21 3l-3 3M6 6a8 8 0 0 1 12 0M9 9a4 4 0 0 1 6 0" />
      <path d="M12 12v9M9 21h6" />
    </svg>
  ),
  Bell: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  Grid: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Activity: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  ),
  Router: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 17h.01M11 17h.01M12 13V9M8 6a5 5 0 0 1 8 0M6 3a8 8 0 0 1 12 0" />
    </svg>
  ),
  Key: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="7" cy="15" r="4" />
      <path d="M10 12l10-10M17 5l3 3M14 8l3 3" />
    </svg>
  ),
  Webhook: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M10 10l3 4M15 14l-6 4M9 6l5-1" />
    </svg>
  ),
  Copy: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  ),
  Download: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" />
    </svg>
  ),
  Filter: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 5h18l-7 8v7l-4-2v-5L3 5z" />
    </svg>
  ),
  Info: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </svg>
  ),
  Alert: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 2L2 20h20L12 2z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Sparkles: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  ),
  Docs: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 3l18 18M10.5 6.3A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a15.9 15.9 0 0 1-3.5 4.3M6.7 6.7A15.4 15.4 0 0 0 2 12s3.5 6 10 6c1.3 0 2.5-.2 3.6-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ),
  Ext: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 3h7v7M10 14L21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
    </svg>
  ),
};
