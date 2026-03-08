"use client";

import { useEffect, useState } from "react";
import type { BackendIncident, BackendResponse } from "@/types";

// Use Next.js API proxy to avoid CORS issues
const API_BASE = "/api/backend";

function normalizeStatus(value: unknown): BackendIncident["status"] {
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "detected" || v === "rotating" || v === "rotated" || v === "skipped") return v;
  }
  return "detected";
}

function normalizeRisk(value: unknown): string {
  if (typeof value === "number") {
    return ["NONE", "MEDIUM", "HIGH", "CRITICAL"][value] ?? "UNKNOWN";
  }
  if (typeof value === "string") return value.toUpperCase();
  return "UNKNOWN";
}

function normalizeIncident(raw: Record<string, unknown>, idx: number): BackendIncident {
  const processedAt = typeof raw.processedAt === "string" ? raw.processedAt : undefined;
  const detectedAt =
    (typeof raw.detectedAt === "string" && raw.detectedAt) ||
    (typeof raw.createdAt === "string" && raw.createdAt) ||
    processedAt ||
    new Date().toISOString();

  return {
    id:
      (typeof raw.id === "string" && raw.id) ||
      (typeof raw.secretId === "string" && raw.secretId) ||
      (typeof raw.commitSha === "string" && raw.commitSha) ||
      `incident-${idx}`,
    repo: (typeof raw.repo === "string" && raw.repo) || (typeof raw.repository === "string" && raw.repository) || "unknown/repo",
    commitSha: (typeof raw.commitSha === "string" && raw.commitSha) || "",
    secretType: (typeof raw.secretType === "string" && raw.secretType) || "generic",
    status: normalizeStatus(raw.status),
    riskLevel: normalizeRisk(raw.riskLevel),
    detectedAt,
    creTriggered: typeof raw.creTriggered === "boolean" ? raw.creTriggered : true,
    secretId: typeof raw.secretId === "string" ? (raw.secretId as `0x${string}`) : undefined,
    incidentCommitment: typeof raw.incidentCommitment === "string" ? (raw.incidentCommitment as `0x${string}`) : undefined,
    newCommitment: typeof raw.newCommitment === "string" ? (raw.newCommitment as `0x${string}`) : undefined,
    processedAt,
  };
}

function normalizeResponse(raw: unknown): BackendResponse {
  const obj = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const incidentsRaw = Array.isArray(obj.incidents) ? obj.incidents : [];
  const incidents = incidentsRaw
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map(normalizeIncident);

  return {
    total: typeof obj.total === "number" ? obj.total : incidents.length,
    incidents,
  };
}

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
        setData(normalizeResponse(json));
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
  creMode: "real" | "mock" | "simulated" | "unknown";
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
          isOnline: data.status === "ok" || data.ok === true,
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
