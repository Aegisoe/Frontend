"use client";

import { useEffect, useState } from "react";
import type { BackendResponse } from "@/types";

// Use Next.js API proxy to avoid CORS issues
const API_BASE = "/api/backend";

export function useBackendIncidents() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/incidents`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to fetch";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 15000);
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error };
}

export interface HealthStatus {
  isOnline: boolean | null;
  service: string;
  onChain: boolean;
  creMode: "real" | "mock" | "unknown";
}

export function useBackendHealth(): HealthStatus {
  const [status, setStatus] = useState<HealthStatus>({
    isOnline: null,
    service: "",
    onChain: false,
    creMode: "unknown",
  });

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (!res.ok) {
          setStatus({ isOnline: false, service: "", onChain: false, creMode: "unknown" });
          return;
        }
        const data = await res.json();
        setStatus({
          isOnline: data.status === "ok",
          service: data.service ?? "AEGISOE Backend",
          onChain: data.onChain ?? false,
          creMode: data.creMode ?? "unknown",
        });
      } catch {
        setStatus({ isOnline: false, service: "", onChain: false, creMode: "unknown" });
      }
    }

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
