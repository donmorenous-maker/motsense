export interface VehicleEvent {
  id?: string;
  event_uid?: string;
  device_eui: string;
  device_name?: string | null;
  gateway_id?: string | null;
  gateway_timestamp?: number | null;
  device_uptime_s?: number | null;
  fport?: number | null;
  frame_counter?: number | null;
  adr?: boolean | null;
  direction_code?: number | null;
  direction?: string | null;
  speed_kmh?: number | null;
  vehicle_class_code?: number | null;
  vehicle_class?: string | null;
  confidence_pct?: number | null;
  vibration_energy?: number | null;
  battery_mv?: number | null;
  battery_v?: number | null;
  temperature_c?: number | null;
  rssi_dbm?: number | null;
  snr_db?: number | null;
  frequency_hz?: number | null;
  data_rate?: number | null;
  payload_hex?: string | null;
  created_at?: string | null;
}

export interface DashboardSummary {
  total_events: number | null;
  average_speed: number | null;
  last_vehicle: string | null;
  active_devices: number | null;
}

export interface HealthResponse {
  status: string | null;
  service: string | null;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null | undefined {
  if (value === null) return null;
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | null | undefined {
  if (value === null) return null;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | null | undefined {
  if (value === null) return null;
  return typeof value === "boolean" ? value : undefined;
}

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Malformed API response");
  }
}

function normalizeEvent(value: unknown): VehicleEvent | null {
  if (!isRecord(value) || typeof value.device_eui !== "string") {
    return null;
  }

  return {
    id: asString(value.id),
    event_uid: asString(value.event_uid),
    device_eui: value.device_eui,
    device_name: asString(value.device_name),
    gateway_id: asString(value.gateway_id),
    gateway_timestamp: asNumber(value.gateway_timestamp),
    device_uptime_s: asNumber(value.device_uptime_s),
    fport: asNumber(value.fport),
    frame_counter: asNumber(value.frame_counter),
    adr: asBoolean(value.adr),
    direction_code: asNumber(value.direction_code),
    direction: asString(value.direction),
    speed_kmh: asNumber(value.speed_kmh),
    vehicle_class_code: asNumber(value.vehicle_class_code),
    vehicle_class: asString(value.vehicle_class),
    confidence_pct: asNumber(value.confidence_pct),
    vibration_energy: asNumber(value.vibration_energy),
    battery_mv: asNumber(value.battery_mv),
    battery_v: asNumber(value.battery_v),
    temperature_c: asNumber(value.temperature_c),
    rssi_dbm: asNumber(value.rssi_dbm),
    snr_db: asNumber(value.snr_db),
    frequency_hz: asNumber(value.frequency_hz),
    data_rate: asNumber(value.data_rate),
    payload_hex: asString(value.payload_hex),
    created_at: asString(value.created_at),
  };
}

function normalizeSummary(value: unknown): DashboardSummary {
  if (!isRecord(value)) {
    throw new Error("Malformed API response");
  }

  return {
    total_events: asNumber(value.total_events) ?? null,
    average_speed: asNumber(value.average_speed) ?? null,
    last_vehicle: asString(value.last_vehicle) ?? null,
    active_devices: asNumber(value.active_devices) ?? null,
  };
}

function normalizeHealth(value: unknown): HealthResponse {
  if (!isRecord(value)) {
    throw new Error("Malformed API response");
  }

  return {
    status: asString(value.status) ?? null,
    service: asString(value.service) ?? null,
  };
}

export async function getEvents(signal?: AbortSignal): Promise<VehicleEvent[]> {
  const data = await requestJson<unknown>("/api/events", signal);

  if (!Array.isArray(data)) {
    throw new Error("Malformed API response");
  }

  return data
    .map(normalizeEvent)
    .filter((event): event is VehicleEvent => event !== null)
    .sort((left, right) => {
      const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
      const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
      return rightTime - leftTime;
    });
}

export async function getSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  const data = await requestJson<unknown>("/api/summary", signal);
  return normalizeSummary(data);
}

export async function checkHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const data = await requestJson<unknown>("/health", signal);
  return normalizeHealth(data);
}
