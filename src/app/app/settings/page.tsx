"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { orgUsers } from "@/data/mock";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sections = [
  { id: "organization", label: "Organization" },
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "API Security" },
  { id: "billing", label: "Billing" },
  { id: "defaults", label: "Device Defaults" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("organization");

  return (
    <>
      <DashboardTopbar title="Settings" description="Organization, users, security, defaults" />
      <div className="p-5 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 h-9 rounded-md text-[13px] transition-colors text-left",
                  active === s.id
                    ? "bg-ink-950 text-white"
                    : "text-ink-700 hover:bg-ink-100"
                )}
              >
                {s.label}
                <Icon.ChevronRight size={12} className={active === s.id ? "text-mustard-500" : "text-ink-400"} />
              </button>
            ))}
          </nav>

          <div className="space-y-5">
            {active === "organization" && (
              <Card>
                <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                <div className="p-5 grid gap-4 md:grid-cols-2">
                  <Field label="Organization name" defaultValue="City of Columbus" />
                  <Field label="Slug" defaultValue="city-of-columbus" mono />
                  <Field label="Region" defaultValue="US915" mono />
                  <Field label="Timezone" defaultValue="America/New_York" />
                  <div className="md:col-span-2">
                    <Field label="Primary contact" defaultValue="alex@ops.example.com" />
                  </div>
                </div>
                <div className="p-5 border-t border-ink-200/70 flex justify-end">
                  <Button variant="secondary" size="sm">Save changes</Button>
                </div>
              </Card>
            )}

            {active === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <Button variant="secondary" size="sm"><Icon.Plus size={13} /> Invite user</Button>
                </CardHeader>
                <div className="divide-y divide-ink-200/60">
                  {orgUsers.map((u) => (
                    <div key={u.email} className="px-5 py-3 grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-ink-100 border border-ink-200 flex items-center justify-center text-[11px] font-mono text-ink-700">
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-[13.5px] text-ink-900">{u.name}</div>
                          <div className="text-[11.5px] text-ink-500 font-mono">{u.email}</div>
                        </div>
                      </div>
                      <div className="col-span-3 text-[12.5px]">
                        <span className="px-2 h-6 inline-flex items-center rounded-full border border-ink-200 bg-ink-50 text-ink-700 uppercase tracking-widest text-[10.5px] font-mono">
                          {u.role}
                        </span>
                      </div>
                      <div className="col-span-3 text-[11.5px] text-ink-500 font-mono">
                        Active {u.lastActive}
                      </div>
                      <div className="col-span-1 text-right">
                        <button className="text-ink-400 hover:text-ink-900"><Icon.Settings size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {active === "roles" && (
              <Card>
                <CardHeader><CardTitle>Roles & Permissions</CardTitle></CardHeader>
                <div className="divide-y divide-ink-200/60">
                  {[
                    { role: "Owner", perms: "All permissions · billing · destructive actions" },
                    { role: "Admin", perms: "Manage users, devices, integrations" },
                    { role: "Engineer", perms: "Manage devices, view API keys" },
                    { role: "Analyst", perms: "Read events and analytics · export data" },
                    { role: "Viewer", perms: "Read-only access to overview and events" },
                  ].map((r) => (
                    <div key={r.role} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <div className="text-[13.5px] font-semibold text-ink-900">{r.role}</div>
                        <div className="text-[12px] text-ink-500 mt-0.5">{r.perms}</div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {active === "notifications" && (
              <Card>
                <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
                <div className="p-5 space-y-4">
                  {[
                    { k: "Critical alerts", desc: "Sensor offline · gateway disconnected" },
                    { k: "Warning alerts", desc: "Battery low · packet loss high" },
                    { k: "Digest email", desc: "Daily summary of events and alerts" },
                    { k: "Weekly report", desc: "Traffic volume, speed, classification" },
                  ].map((n) => (
                    <div key={n.k} className="flex items-center justify-between border-b border-ink-200/60 pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <div className="text-[13.5px] font-medium text-ink-900">{n.k}</div>
                        <div className="text-[12px] text-ink-500">{n.desc}</div>
                      </div>
                      <Toggle defaultOn={n.k !== "Weekly report"} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {active === "security" && (
              <Card>
                <CardHeader><CardTitle>API Security</CardTitle></CardHeader>
                <div className="p-5 grid gap-4 md:grid-cols-2">
                  <SwitchRow label="Require SSO for all users" on />
                  <SwitchRow label="Enforce API key rotation (90 days)" on />
                  <SwitchRow label="Restrict API keys by IP range" />
                  <SwitchRow label="Signed webhooks only" on />
                  <SwitchRow label="Audit log retention · 12 months" on />
                  <SwitchRow label="Allow MQTT anonymous read" />
                </div>
              </Card>
            )}

            {active === "billing" && (
              <Card>
                <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
                <div className="p-5 space-y-4">
                  <div className="rounded-md border border-mustard-200 bg-mustard-50/70 text-mustard-800 px-4 py-3 text-[12.5px]">
                    Billing is managed by your Motsense account team. This section is a placeholder for future self-serve billing.
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <SumStat label="Plan" value="Infrastructure" />
                    <SumStat label="Devices under management" value="50" />
                    <SumStat label="Billing cycle" value="Annual" />
                  </div>
                </div>
              </Card>
            )}

            {active === "defaults" && (
              <Card>
                <CardHeader><CardTitle>Device Defaults</CardTitle></CardHeader>
                <div className="p-5 grid gap-4 md:grid-cols-2">
                  <Field label="Reporting interval" defaultValue="60 s" mono />
                  <Field label="Firmware channel" defaultValue="stable" mono />
                  <Field label="Timezone" defaultValue="America/New_York" />
                  <Field label="Classification model" defaultValue="motsense-cls-v3" mono />
                  <Field label="ADR" defaultValue="Enabled" />
                  <Field label="Detection threshold" defaultValue="Auto" />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  defaultValue,
  mono,
}: {
  label: string;
  defaultValue: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        className={cn(
          "mt-1 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-[13.5px] focus:border-mustard-500 focus:outline-none",
          mono && "font-mono"
        )}
      />
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-mustard-500" : "bg-ink-200"
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function SwitchRow({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-200/60 pb-4 last:border-b-0 last:pb-0">
      <div className="text-[13.5px] text-ink-800">{label}</div>
      <Toggle defaultOn={on} />
    </div>
  );
}

function SumStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-200/70 p-4">
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 text-[20px] font-semibold text-ink-900">{value}</div>
    </div>
  );
}
