"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { BackendIncident } from "@/types";

interface SimulationActivityFeedProps {
  incidents: BackendIncident[];
}

function formatWhen(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

export function SimulationActivityFeed({ incidents }: SimulationActivityFeedProps) {
  if (incidents.length === 0) {
    return (
      <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
          <div className="flex items-center gap-[7px] text-[13px] font-semibold">
            <span className="text-[var(--green)]">&#9679;</span> Simulated Activity
          </div>
          <span className="font-mono text-[11px] text-[var(--text3)]">backend events</span>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-medium text-[var(--text2)]">No simulation events yet</p>
          <p className="mt-1 text-xs text-[var(--text3)]">Trigger /demo/trigger and run CRE simulate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
        <div className="flex items-center gap-[7px] text-[13px] font-semibold">
          <span className="text-[var(--green)]">&#9679;</span> Simulated Activity
        </div>
        <span className="font-mono text-[11px] text-[var(--text3)]">backend events</span>
      </div>
      <div>
        {incidents.slice(0, 8).map((incident, index) => (
          <motion.div
            key={`${incident.id}-${index}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: index * 0.04 }}
            className="flex items-start justify-between gap-[11px] border-b border-[var(--border)] px-[17px] py-[10px] last:border-b-0"
          >
            <div>
              <div className="mb-1 text-xs font-medium text-[var(--text)]">
                {incident.secretType} in {incident.repo}
              </div>
              <div className="flex items-center gap-2">
                <Badge label={incident.status} variant="status" />
                <Badge label={incident.riskLevel ?? "UNKNOWN"} variant="risk" />
              </div>
            </div>
            <div className="font-mono text-[11px] text-[var(--text3)]">{formatWhen(incident.detectedAt)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

