"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { apiKeys, webhookEndpoints } from "@/data/mock";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const endpoints = [
  { method: "GET", path: "/api/v1/devices", desc: "List devices" },
  { method: "GET", path: "/api/v1/events", desc: "List traffic events" },
  { method: "GET", path: "/api/v1/traffic", desc: "Aggregated traffic series" },
  { method: "GET", path: "/api/v1/analytics", desc: "Analytics endpoints" },
  { method: "GET", path: "/api/v1/devices/{id}", desc: "Device detail" },
];

export default function ApiIntegrationsPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <>
      <DashboardTopbar title="API & Integrations" description="Keys · Webhooks · MQTT · Endpoints" />
      <div className="p-5 md:p-6 lg:p-8 space-y-6">
        {/* Quick status */}
        <div className="grid gap-3 md:grid-cols-4">
          <IntegrationStat label="API" value="Operational" ok icon={Icon.Api} sub="p50 42 ms" />
          <IntegrationStat label="Webhooks" value="Healthy" ok icon={Icon.Webhook} sub="99.6% delivery" />
          <IntegrationStat label="MQTT broker" value="Connected" ok icon={Icon.Wifi} sub="stream.motsense.com" />
          <IntegrationStat label="Data export" value="Enabled" ok icon={Icon.Download} sub="Nightly · S3" />
        </div>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>API keys</CardTitle>
              <div className="text-[11.5px] text-ink-500 mt-0.5">Secrets are masked. Real values are never displayed after creation.</div>
            </div>
            <Button variant="secondary" size="sm">
              <Icon.Plus size={13} /> Create API key
            </Button>
          </CardHeader>
          <div className="divide-y divide-ink-200/60">
            {apiKeys.map((k) => (
              <div key={k.id} className="px-5 py-4 grid grid-cols-12 items-center gap-4">
                <div className="col-span-3">
                  <div className="text-[13px] font-semibold text-ink-900">{k.label}</div>
                  <div className="text-[11.5px] text-ink-500 font-mono">scope: {k.scope}</div>
                </div>
                <div className="col-span-5 flex items-center gap-2">
                  <code className="font-mono text-[12.5px] px-2 h-8 rounded border border-ink-200 bg-ink-50 flex items-center text-ink-900">
                    {k.prefix}
                    {revealed[k.id] ? k.tail : "************************"}
                  </code>
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}
                    className="h-8 w-8 rounded-md border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-50"
                    aria-label="Toggle reveal"
                  >
                    {revealed[k.id] ? <Icon.EyeOff size={13} /> : <Icon.Eye size={13} />}
                  </button>
                  <button className="h-8 w-8 rounded-md border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-50">
                    <Icon.Copy size={13} />
                  </button>
                </div>
                <div className="col-span-2 text-[12px] text-ink-500 font-mono">
                  Created {k.createdAt}
                </div>
                <div className="col-span-2 text-right">
                  <button className="text-[12px] text-rose-600 hover:text-rose-500">Revoke</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-ink-200/70 flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Icon.Docs size={13} /> View documentation
            </Button>
          </div>
        </Card>

        {/* Webhooks */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Webhooks</CardTitle>
              <div className="text-[11.5px] text-ink-500 mt-0.5">Signed HMAC-SHA256 · retried with exponential backoff.</div>
            </div>
            <Button variant="secondary" size="sm">
              <Icon.Plus size={13} /> Create webhook
            </Button>
          </CardHeader>
          <div className="divide-y divide-ink-200/60">
            {webhookEndpoints.map((w) => (
              <div key={w.id} className="px-5 py-4 grid grid-cols-12 items-center gap-4">
                <div className="col-span-6 flex items-center gap-2">
                  <StatusDot tone="success" pulse={false} />
                  <code className="font-mono text-[12.5px] text-ink-900 truncate">{w.url}</code>
                </div>
                <div className="col-span-3 flex gap-1 flex-wrap">
                  {w.events.map((e) => (
                    <span key={e} className="text-[10.5px] font-mono px-2 h-5 flex items-center rounded-full border border-mustard-200 bg-mustard-50 text-mustard-700">
                      {e}
                    </span>
                  ))}
                </div>
                <div className="col-span-2 font-mono text-[12.5px] text-emerald-600">
                  {w.successRate.toFixed(1)}% success
                </div>
                <div className="col-span-1 text-right">
                  <button className="text-ink-400 hover:text-ink-900"><Icon.Settings size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* MQTT & Endpoints */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>MQTT</CardTitle>
              <div className="text-[11.5px] text-ink-500">Subscribe to the live event bus.</div>
            </CardHeader>
            <div className="p-5">
              <div className="rounded-md bg-ink-950 text-ink-100 p-4 font-mono text-[12.5px] leading-[1.9]">
                <div className="text-mustard-400"># Broker</div>
                <div>mqtt://stream.motsense.com:8883</div>
                <div className="text-mustard-400 mt-2"># Topics</div>
                <div><span className="text-emerald-300">traffic/events/#</span></div>
                <div><span className="text-emerald-300">devices/state/#</span></div>
                <div><span className="text-emerald-300">alerts/#</span></div>
                <div className="text-mustard-400 mt-2"># Auth</div>
                <div>username = <span className="text-sky-300">org_id</span></div>
                <div>password = <span className="text-sky-300">api_key</span></div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
              <div className="text-[11.5px] text-ink-500">Base: <code className="font-mono">https://api.motsense.com</code></div>
            </CardHeader>
            <div className="divide-y divide-ink-200/60">
              {endpoints.map((e) => (
                <div key={e.path} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-[10.5px] font-mono font-semibold px-2 py-1 rounded bg-mustard-50 text-mustard-700 border border-mustard-200">
                    {e.method}
                  </span>
                  <code className="font-mono text-[12.5px] text-ink-900 flex-1">{e.path}</code>
                  <span className="text-[12px] text-ink-500">{e.desc}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-ink-200/70">
              <Button variant="outline" size="sm">
                <Icon.Docs size={13} /> View documentation
              </Button>
            </div>
          </Card>
        </div>

        {/* Data export */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Data export</CardTitle>
              <div className="text-[11.5px] text-ink-500 mt-0.5">Scheduled and on-demand exports to your storage.</div>
            </div>
            <Button variant="outline" size="sm">
              <Icon.Download size={13} /> Export now
            </Button>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3 p-5">
            {[
              { name: "Traffic events · CSV", schedule: "Nightly · 03:00 UTC", target: "s3://your-bucket/motsense/events" },
              { name: "Device health · Parquet", schedule: "Hourly", target: "gs://your-bucket/health" },
              { name: "Analytics · JSON", schedule: "Weekly · Mondays", target: "https://ops.example.com/ingest" },
            ].map((x) => (
              <div key={x.name} className="rounded-lg border border-ink-200/70 p-4">
                <div className="text-[13.5px] font-semibold text-ink-900">{x.name}</div>
                <div className="text-[11.5px] text-ink-500 font-mono mt-1">{x.schedule}</div>
                <div className="text-[11.5px] text-ink-500 font-mono mt-1 truncate">{x.target}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function IntegrationStat({
  label,
  value,
  sub,
  ok,
  icon: IconEl,
}: {
  label: string;
  value: string;
  sub: string;
  ok?: boolean;
  icon: typeof Icon.Api;
}) {
  return (
    <div className={cn("rounded-xl border p-5 bg-white shadow-card", "border-ink-200/70")}>
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
        <div className="h-7 w-7 rounded-md border border-ink-200 bg-ink-50 flex items-center justify-center text-ink-700">
          <IconEl size={13} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-ink-900">
        {ok && <StatusDot tone="success" pulse={false} />}
        <span className="text-[16px] font-semibold">{value}</span>
      </div>
      <div className="mt-1 text-[11.5px] font-mono text-ink-500">{sub}</div>
    </div>
  );
}
