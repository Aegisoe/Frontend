"use client";

import { motion } from "framer-motion";
import { RotationRow } from "./RotationRow";
import { EmptyState } from "@/components/ui/EmptyState";
import type { RotationRecord } from "@/types";

interface RotationTableProps {
  rotations: RotationRecord[];
}

export function RotationTable({ rotations }: RotationTableProps) {
  if (rotations.length === 0) {
    return <EmptyState title="No rotations found" description="No rotation records for this secretId" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">#</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Operator</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Old Commitment</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">New Commitment</th>
            <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rotations.map((rotation, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              className="hover:bg-[var(--card-hover)] transition-colors"
            >
              <RotationRow rotation={rotation} index={index} />
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
