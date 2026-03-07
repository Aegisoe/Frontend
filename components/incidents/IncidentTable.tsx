"use client";

import { motion } from "framer-motion";
import { IncidentRow } from "./IncidentRow";
import { EmptyState } from "@/components/ui/EmptyState";
import type { IncidentRecord } from "@/types";

interface IncidentTableProps {
  incidents: IncidentRecord[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  if (incidents.length === 0) {
    return <EmptyState title="No incidents found" description="No incident records for this secretId" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">#</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Operator</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Commitment</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Repository</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Risk</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Status</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {incidents.map((incident, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              className="hover:bg-[var(--card-hover)] transition-colors"
            >
              <IncidentRow incident={incident} index={index} />
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
