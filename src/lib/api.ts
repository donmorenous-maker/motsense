export interface VehicleEvent {
  id?: string | null;
  event_id?: string | null;
  event_uid?: string | null;
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
  protocol_version?: string | null;
  source_sample_rate_hz?: number | null;
  tx_sample_rate_hz?: number | null;
  raw_sample_count?: number | null;
  tx_sample_count?: number | null;
  peak_abs?: number | null;
  rms?: number | null;
  peak_to_peak?: number | null;
  crest_factor?: number | null;
  kurtosis?: number | null;
  zero_crossings?: number | null;
  dominant_frequency_hz?: number | null;
  spectral_centroid_hz?: number | null;
  band_energy_0_20_pct?: number | null;
  band_energy_20_40_pct?: number | null;
  band_energy_40_60_pct?: number | null;
  band_energy_60_100_pct?: number | null;
  band_energy_100_200_pct?: number | null;
  spectral_entropy?: number | null;
  signal_chunk_count?: number | null;
  waveform_complete?: boolean | null;
  payload_hex?: string | null;
  created_at?: string | null;
}

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface SignalWaveform {
  device_eui: string;
  event_id?: string | null;
  protocol_version?: string | null;
  sensor_type?: string | null;
  encoding?: string | null;
  source_sample_rate_hz?: number | null;
  tx_sample_rate_hz?: number | null;
  total_samples?: number | null;
  chunk_count?: number | null;
  scale?: number | null;
  offset_value?: number | null;
  samples_base64?: string | null;
  samples?: number[] | null;
  waveform_sha256?: string | null;
  server_features?: JsonValue | null;
  complete?: boolean | null;
  assembled_at?: string | null;
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

function asText(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function asNumber(value: unknown): number | null | undefined {
  if (value === null) return null;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | null | undefined {
  if (value === null) return null;
  return typeof value === "boolean" ? value : undefined;
}

function asNumberArray(value: unknown): number[] | null | undefined {
  if (value === null) return null;
  if (!Array.isArray(value)) return undefined;

  const values = value.filter((entry): entry is number => typeof entry === "number" && Number.isFinite(entry));
  return values;
}

function asJsonValue(value: unknown): JsonValue | null | undefined {
  if (value === null) return null;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) => asJsonValue(entry))
      .filter((entry): entry is JsonValue => entry !== undefined);
    return normalized;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const normalized: { [key: string]: JsonValue } = {};

  for (const [key, entry] of Object.entries(value)) {
    const nextValue = asJsonValue(entry);
    if (nextValue !== undefined) {
      normalized[key] = nextValue;
    }
  }

  return normalized;
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
    event_id: asText(value.event_id) ?? asText(value.id) ?? asText(value.event_uid),
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
    protocol_version: asText(value.protocol_version),
    source_sample_rate_hz: asNumber(value.source_sample_rate_hz),
    tx_sample_rate_hz: asNumber(value.tx_sample_rate_hz),
    raw_sample_count: asNumber(value.raw_sample_count),
    tx_sample_count: asNumber(value.tx_sample_count),
    peak_abs: asNumber(value.peak_abs),
    rms: asNumber(value.rms),
    peak_to_peak: asNumber(value.peak_to_peak),
    crest_factor: asNumber(value.crest_factor),
    kurtosis: asNumber(value.kurtosis),
    zero_crossings: asNumber(value.zero_crossings),
    dominant_frequency_hz: asNumber(value.dominant_frequency_hz),
    spectral_centroid_hz: asNumber(value.spectral_centroid_hz),
    band_energy_0_20_pct: asNumber(value.band_energy_0_20_pct),
    band_energy_20_40_pct: asNumber(value.band_energy_20_40_pct),
    band_energy_40_60_pct: asNumber(value.band_energy_40_60_pct),
    band_energy_60_100_pct: asNumber(value.band_energy_60_100_pct),
    band_energy_100_200_pct: asNumber(value.band_energy_100_200_pct),
    spectral_entropy: asNumber(value.spectral_entropy),
    signal_chunk_count: asNumber(value.signal_chunk_count),
    waveform_complete: asBoolean(value.waveform_complete),
    payload_hex: asString(value.payload_hex),
    created_at: asString(value.created_at),
  };
}

function normalizeWaveform(value: unknown): SignalWaveform {
  const record =
    isRecord(value) && isRecord(value.waveform)
      ? value.waveform
      : isRecord(value) && isRecord(value.data)
        ? value.data
        : value;

  if (!isRecord(record) || typeof record.device_eui !== "string") {
    throw new Error("Malformed API response");
  }

  return {
    device_eui: record.device_eui,
    event_id: asText(record.event_id),
    protocol_version: asText(record.protocol_version),
    sensor_type: asText(record.sensor_type),
    encoding: asText(record.encoding),
    source_sample_rate_hz: asNumber(record.source_sample_rate_hz),
    tx_sample_rate_hz: asNumber(record.tx_sample_rate_hz),
    total_samples: asNumber(record.total_samples),
    chunk_count: asNumber(record.chunk_count),
    scale: asNumber(record.scale),
    offset_value: asNumber(record.offset_value),
    samples_base64: asText(record.samples_base64),
    samples: asNumberArray(record.samples) ?? asNumberArray(record.samples_scaled) ?? null,
    waveform_sha256: asText(record.waveform_sha256),
    server_features: asJsonValue(record.server_features) ?? null,
    complete: asBoolean(record.complete),
    assembled_at: asText(record.assembled_at),
    created_at: asText(record.created_at),
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

export async function getWaveform(
  params: { deviceEui: string; eventId?: string | null },
  signal?: AbortSignal
): Promise<SignalWaveform> {
  const search = new URLSearchParams({ device_eui: params.deviceEui });

  if (params.eventId) {
    search.set("event_id", params.eventId);
  }

  const data = await requestJson<unknown>(`/api/waveform?${search.toString()}`, signal);
  return normalizeWaveform(data);
}
