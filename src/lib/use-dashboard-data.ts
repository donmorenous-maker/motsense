"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkHealth,
  type DashboardSummary,
  getEvents,
  getSummary,
  type HealthResponse,
  type VehicleEvent,
} from "@/lib/api";

export type ConnectionState = "loading" | "live" | "degraded" | "offline";

interface DashboardDataState {
  events: VehicleEvent[];
  summary: DashboardSummary | null;
  health: HealthResponse | null;
  status: ConnectionState;
  error: string | null;
  lastUpdatedAt: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
}

const REFRESH_INTERVAL_MS = 5_000;

export function useDashboardData() {
  const [state, setState] = useState<DashboardDataState>({
    events: [],
    summary: null,
    health: null,
    status: "loading",
    error: null,
    lastUpdatedAt: null,
    isLoading: true,
    isRefreshing: false,
  });
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;

    setState((previous) => ({
      ...previous,
      isLoading: previous.summary === null && previous.events.length === 0,
      isRefreshing: previous.summary !== null || previous.events.length > 0,
    }));

    try {
      const [events, summary, health] = await Promise.all([
        getEvents(),
        getSummary(),
        checkHealth().catch(() => null),
      ]);

      if (!mountedRef.current) {
        return;
      }

      setState({
        events,
        summary,
        health,
        status: "live",
        error: null,
        lastUpdatedAt: new Date().toISOString(),
        isLoading: false,
        isRefreshing: false,
      });
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }

      const message = error instanceof Error ? error.message : "Unable to refresh dashboard data";

      setState((previous) => {
        const hasData = previous.summary !== null || previous.events.length > 0;

        return {
          ...previous,
          status: hasData ? "degraded" : "offline",
          error: message,
          isLoading: false,
          isRefreshing: false,
        };
      });
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const initialTimer = window.setTimeout(() => {
      void refresh();
    }, 0);

    const timer = window.setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}
