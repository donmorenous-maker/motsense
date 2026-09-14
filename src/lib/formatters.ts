import type { VehicleEvent } from "@/lib/api";

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumericUnit(
  value: number | null | undefined,
  unit: string,
  digits = 1
): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return `${value.toFixed(digits)} ${unit}`;
}

export function formatCount(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatSpeed(value: number | null | undefined): string {
  return formatNumericUnit(value, "km/h", 1);
}

export function formatTemperature(value: number | null | undefined): string {
  return formatNumericUnit(value, "°C", 2);
}

export function formatBattery(value: number | null | undefined): string {
  return formatNumericUnit(value, "V", 3);
}

export function formatRssi(value: number | null | undefined): string {
  return formatNumericUnit(value, "dBm", 0);
}

export function formatSnr(value: number | null | undefined): string {
  return formatNumericUnit(value, "dB", 1);
}

export function formatConfidence(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return `${Math.round(value)}%`;
}

export function formatTime(value: string | null | undefined): string {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatVehicleClass(value: string | null | undefined): string {
  if (!value) {
    return "--";
  }

  switch (value.toLowerCase()) {
    case "sedan":
      return "Sedan";
    case "suv":
      return "SUV";
    case "pickup":
      return "Pickup";
    case "truck":
      return "Truck";
    case "unknown":
      return "Unknown";
    default:
      return value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
  }
}

export function formatDirection(value: string | null | undefined): string {
  if (!value) {
    return "--";
  }

  switch (value.toLowerCase()) {
    case "forward":
      return "Forward";
    case "reverse":
      return "Reverse";
    case "unknown":
      return "Unknown";
    default:
      return value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
  }
}

export function formatFrequency(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return `${(value / 1_000_000).toFixed(1)} MHz`;
}

export function formatDataRate(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return `DR${value}`;
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value === true) return "Enabled";
  if (value === false) return "Disabled";
  return "--";
}

export function formatDeviceUptime(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  const parts = [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 || hours > 0 ? `${minutes}m` : null,
    `${seconds}s`,
  ].filter(Boolean);

  return parts.join(" ");
}

export function formatPlainNumber(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return "--";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDeviceName(event: VehicleEvent): string {
  const name = event.device_name?.trim();
  return name || event.device_eui || "--";
}
