// Mock data layer for Motsense.
// Designed so it can be replaced by a Supabase / MQTT-backed data provider
// without changing the calling UI components.

export type DeviceStatus = "online" | "warning" | "error" | "offline" | "idle";

export interface Device {
  id: string;
  name: string;
  road: string;
  city: string;
  status: DeviceStatus;
  battery: number; // percent
  voltage: number; // V
  temperature: number; // C
  firmware: string;
  gateway: string;
  lastSeenSec: number;
  vehiclesToday: number;
  avgSpeedMph: number;
  rssi: number;
  snr: number;
  devEUI: string;
  installedAt: string;
  lat: number;
  lng: number;
  frameCounter: number;
}

export interface Gateway {
  id: string;
  name: string;
  status: DeviceStatus;
  connectedDevices: number;
  packetsToday: number;
  region: string;
  mqtt: "Connected" | "Disconnected";
  lastHeartbeatSec: number;
  city: string;
  lat: number;
  lng: number;
}

export interface TrafficEvent {
  id: string;
  timestamp: string;
  deviceId: string;
  road: string;
  direction: "Eastbound" | "Westbound" | "Northbound" | "Southbound";
  speedKmh: number;
  speedMph: number;
  vehicleClass: "Sedan" | "SUV" | "Pickup" | "Truck" | "Motorcycle" | "Bus" | "Van";
  confidence: number;
  vibrationEnergy: number;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  status: "open" | "acknowledged" | "resolved";
  title: string;
  target: string;
  createdAt: string;
  message: string;
}

// ---- Deterministic PRNG so SSR and client match ---------------------------
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260912);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const dec = (min: number, max: number, d = 1) =>
  Number((rand() * (max - min) + min).toFixed(d));

const ROADS = ["US-33", "I-270", "SR-315", "SR-161", "US-23", "I-670"];
const CLASSES: TrafficEvent["vehicleClass"][] = [
  "Sedan",
  "SUV",
  "Pickup",
  "Truck",
  "Motorcycle",
  "Bus",
  "Van",
];
const DIRS: TrafficEvent["direction"][] = ["Eastbound", "Westbound", "Northbound", "Southbound"];

// Devices
export const devices: Device[] = Array.from({ length: 50 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  const status: DeviceStatus =
    i === 16 ? "offline" : i === 8 || i === 20 ? "warning" : "online";
  const battery = status === "offline" ? 0 : status === "warning" ? int(8, 22) : int(60, 99);
  const vehiclesToday = status === "offline" ? 0 : int(240, 2100);
  const lat = 39.98 + (rand() - 0.5) * 0.28;
  const lng = -83.03 + (rand() - 0.5) * 0.45;
  return {
    id: `RR-${num}`,
    name: `MOTSENSE-RR-${num}`,
    road: pick(ROADS),
    city: "Columbus, OH",
    status,
    battery,
    voltage: Number((2.9 + battery / 100).toFixed(2)),
    temperature: dec(18, 32, 1),
    firmware: "v0.8.2",
    gateway: `GW-COLUMBUS-${String(int(1, 3)).padStart(2, "0")}`,
    lastSeenSec: status === "offline" ? 1820 : int(1, 30),
    vehiclesToday,
    avgSpeedMph: dec(28, 62, 1),
    rssi: -int(78, 108),
    snr: dec(-2, 9, 1),
    devEUI: `70B3D57ED005${(0x1000 + i).toString(16).toUpperCase()}`,
    installedAt: "2026-04-14",
    lat,
    lng,
    frameCounter: int(10000, 90000),
  };
});

// Gateways
export const gateways: Gateway[] = [
  {
    id: "GW-COLUMBUS-01",
    name: "GW-COLUMBUS-01",
    status: "online",
    connectedDevices: 18,
    packetsToday: 34821,
    region: "US915",
    mqtt: "Connected",
    lastHeartbeatSec: 4,
    city: "Columbus, OH",
    lat: 39.995,
    lng: -83.02,
  },
  {
    id: "GW-COLUMBUS-02",
    name: "GW-COLUMBUS-02",
    status: "online",
    connectedDevices: 16,
    packetsToday: 29104,
    region: "US915",
    mqtt: "Connected",
    lastHeartbeatSec: 2,
    city: "Columbus, OH",
    lat: 40.02,
    lng: -83.11,
  },
  {
    id: "GW-COLUMBUS-03",
    name: "GW-COLUMBUS-03",
    status: "online",
    connectedDevices: 16,
    packetsToday: 27690,
    region: "US915",
    mqtt: "Connected",
    lastHeartbeatSec: 3,
    city: "Columbus, OH",
    lat: 39.93,
    lng: -82.95,
  },
];

// Traffic events (recent)
const now = new Date("2026-09-12T18:32:04Z").getTime();

export const events: TrafficEvent[] = Array.from({ length: 220 }, (_, i) => {
  const t = new Date(now - i * int(4, 45) * 1000).toISOString();
  const dev = devices[int(0, devices.length - 1)];
  const kmh = dec(18, 118, 1);
  const mph = Number((kmh * 0.621371).toFixed(1));
  return {
    id: `evt-${i.toString().padStart(5, "0")}`,
    timestamp: t,
    deviceId: dev.id,
    road: dev.road,
    direction: pick(DIRS),
    speedKmh: kmh,
    speedMph: mph,
    vehicleClass: pick(CLASSES),
    confidence: dec(0.62, 0.99, 2),
    vibrationEnergy: int(320, 4200),
  };
});

// KPI snapshot
export const networkKpis = {
  vehiclesToday: 12483,
  vehiclesPerMinute: 18.4,
  averageSpeedMph: 47.6,
  activeSensors: devices.filter((d) => d.status === "online").length,
  totalSensors: devices.length,
  gatewaysOnline: gateways.filter((g) => g.status === "online").length,
  totalGateways: gateways.length,
  activeAlerts: 2,
};

// Activity chart (24 hours, vehicles/min)
export const trafficActivity24h: { hour: string; value: number }[] = Array.from(
  { length: 24 },
  (_, h) => {
    const hourStr = `${h.toString().padStart(2, "0")}:00`;
    // Rush hour peaks at 8am and 5pm
    const morning = Math.exp(-Math.pow(h - 8, 2) / 6);
    const evening = Math.exp(-Math.pow(h - 17, 2) / 5);
    const base = 4 + 22 * (morning + evening) + rand() * 3;
    return { hour: hourStr, value: Number(base.toFixed(1)) };
  }
);

// Weekly volume
export const weeklyVolume: { day: string; value: number }[] = [
  { day: "Mon", value: 11840 },
  { day: "Tue", value: 12390 },
  { day: "Wed", value: 12102 },
  { day: "Thu", value: 12905 },
  { day: "Fri", value: 13741 },
  { day: "Sat", value: 8920 },
  { day: "Sun", value: 7412 },
];

// Speed distribution
export const speedDistribution: { bucket: string; value: number }[] = [
  { bucket: "0–20", value: 4.2 },
  { bucket: "20–30", value: 8.6 },
  { bucket: "30–40", value: 16.4 },
  { bucket: "40–50", value: 32.1 },
  { bucket: "50–60", value: 24.8 },
  { bucket: "60–70", value: 10.5 },
  { bucket: "70+", value: 3.4 },
];

// Vehicle classification breakdown
export const classificationBreakdown = [
  { label: "Sedan", value: 41.2 },
  { label: "SUV", value: 27.6 },
  { label: "Pickup", value: 13.1 },
  { label: "Van", value: 6.4 },
  { label: "Truck", value: 8.7 },
  { label: "Motorcycle", value: 1.8 },
  { label: "Bus", value: 1.2 },
];

// Direction distribution
export const directionDistribution = [
  { label: "Eastbound", value: 27.8 },
  { label: "Westbound", value: 28.3 },
  { label: "Northbound", value: 22.6 },
  { label: "Southbound", value: 21.3 },
];

// Alerts
export const alerts: Alert[] = [
  {
    id: "al-001",
    severity: "critical",
    status: "open",
    title: "Sensor offline for 30 minutes",
    target: "RR-017 · US-33",
    createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
    message: "RR-017 has not delivered a packet in the last 30 minutes.",
  },
  {
    id: "al-002",
    severity: "warning",
    status: "open",
    title: "Battery below 20%",
    target: "RR-009 · SR-315",
    createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    message: "RR-009 reported 18% battery on last uplink.",
  },
  {
    id: "al-003",
    severity: "warning",
    status: "acknowledged",
    title: "Packet loss above threshold",
    target: "RR-021 · I-270",
    createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    message: "Packet loss rate 4.2% over the last hour (threshold 3%).",
  },
  {
    id: "al-004",
    severity: "info",
    status: "resolved",
    title: "Gateway restored",
    target: "GW-COLUMBUS-02",
    createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    message: "Connection to broker restored automatically.",
  },
  {
    id: "al-005",
    severity: "info",
    status: "resolved",
    title: "Firmware update completed",
    target: "12 devices",
    createdAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
    message: "Updated 12 devices to firmware v0.8.2.",
  },
];

export const roads = ROADS;

// API keys (masked)
export const apiKeys = [
  {
    id: "k1",
    label: "Production",
    prefix: "ms_live_",
    tail: "8f31a2c9",
    createdAt: "2026-06-02",
    lastUsed: "2026-09-12",
    scope: "read+write",
  },
  {
    id: "k2",
    label: "Development",
    prefix: "ms_test_",
    tail: "b71e04d2",
    createdAt: "2026-07-11",
    lastUsed: "2026-09-11",
    scope: "read",
  },
];

export const webhookEndpoints = [
  {
    id: "w1",
    url: "https://ops.example.com/motsense/events",
    status: "healthy" as const,
    events: ["traffic.event", "alert.opened"],
    successRate: 99.6,
  },
  {
    id: "w2",
    url: "https://tms.city.gov/webhooks/motsense",
    status: "healthy" as const,
    events: ["traffic.event"],
    successRate: 100,
  },
];

export const orgUsers = [
  { name: "Alex Rivera", email: "alex@ops.example.com", role: "Owner", lastActive: "1 min ago" },
  { name: "Priya Shah", email: "priya@ops.example.com", role: "Admin", lastActive: "12 min ago" },
  { name: "Jordan Wells", email: "jordan@ops.example.com", role: "Engineer", lastActive: "2 h ago" },
  { name: "Mira Chen", email: "mira@ops.example.com", role: "Viewer", lastActive: "Yesterday" },
];
