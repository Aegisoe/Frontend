"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/constants";
import type { BackendResponse } from "@/types";

export function useBackendIncidents() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/incidents`);
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

export function useBackendHealth() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${BACKEND_URL}/health`);
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return isOnline;
}
