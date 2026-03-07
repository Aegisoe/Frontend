"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { BackendIncident } from "@/types";

interface RecentIncidentsProps {
  incidents: BackendIncident[];
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] py-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">No incidents detected yet</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Waiting for webhook triggers...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-sm font-medium text-[var(--foreground)]">Recent Incidents</h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {incidents.slice(0, 5).map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${
                incident.status === "rotated" ? "bg-[var(--success)]" :
                incident.status === "rotating" ? "bg-[var(--accent)]" :
                incident.status === "skipped" ? "bg-[var(--muted)]" :
                "bg-[var(--critical)]"
              }`} />
              <div>
                <p className="font-mono text-sm text-[var(--foreground)]">{incident.repo}</p>
                <p className="text-xs text-[var(--muted)]">
                  {incident.secretType} &middot; {new Date(incident.detectedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {incident.riskLevel && (
                <Badge label={incident.riskLevel} variant="risk" />
              )}
              <Badge label={incident.status} variant="status" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
