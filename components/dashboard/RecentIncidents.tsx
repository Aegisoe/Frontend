"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { RISK_LABELS } from "@/config/constants";
import type { BackendIncident } from "@/types";

function resolveRisk(val: string | number | undefined): string {
  if (val == null) return "UNKNOWN";
  if (typeof val === "number") return RISK_LABELS[val] ?? "UNKNOWN";
  return String(val);
}

function resolveStatus(val: string | undefined): string {
  return val ?? "pending";
}

function resolveDate(val: string | undefined): string {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

interface RecentIncidentsProps {
  incidents: BackendIncident[];
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  if (incidents.length === 0) {
    return (
      <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
          <div className="flex items-center gap-[7px] text-[13px] font-semibold">
            <span className="text-[var(--orange)]">&#9679;</span> Recent Incidents
          </div>
          <span className="font-mono text-[11px] text-[var(--text3)]">from backend API</span>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-medium text-[var(--text2)]">No incidents detected yet</p>
          <p className="mt-1 text-xs text-[var(--text3)]">Waiting for webhook triggers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
        <div className="flex items-center gap-[7px] text-[13px] font-semibold">
          <span className="text-[var(--orange)]">&#9679;</span> Recent Incidents
        </div>
        <span className="font-mono text-[11px] text-[var(--text3)]">from backend API</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Repo</th>
              <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Type</th>
              <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Risk</th>
              <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Status</th>
              <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Time</th>
            </tr>
          </thead>
          <tbody>
            {incidents.slice(0, 5).map((incident, index) => (
              <motion.tr
                key={incident.id ?? `incident-${index}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.04 }}
                className="transition-colors hover:bg-white/[0.01]"
              >
                <td className="border-b border-[var(--border)] px-[15px] py-[11px] text-[13px] font-medium">{incident.repo}</td>
                <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text2)]">{incident.secretType}</td>
                <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                  <Badge label={resolveRisk(incident.riskLevel)} variant="risk" />
                </td>
                <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                  <Badge label={resolveStatus(incident.status)} variant="status" />
                </td>
                <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text3)]">
                  {resolveDate(incident.detectedAt)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
