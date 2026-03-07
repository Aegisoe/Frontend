"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { decodeRepoName, riskLevelToLabel, timeAgo } from "@/lib/decode";
import { etherscanTxUrl, truncateAddress } from "@/lib/format";
import type { ContractEvent } from "@/types";

interface ActivityFeedProps {
  events: ContractEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] py-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">No on-chain events found</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Events will appear after CRE submits transactions</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-sm font-medium text-[var(--foreground)]">On-Chain Activity</h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {events.slice(0, 10).map((event, index) => (
          <motion.div
            key={`${event.transactionHash}-${event.type}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="flex items-start justify-between px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1 h-2 w-2 rounded-full ${
                event.type === "incident" ? "bg-[var(--critical)]" : "bg-[var(--success)]"
              }`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {event.type === "incident" ? "Incident Recorded" : "Secret Rotated"}
                  </span>
                  {event.type === "incident" && event.riskLevel !== undefined && (
                    <Badge label={riskLevelToLabel(event.riskLevel)} variant="risk" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>{truncateAddress(event.operator)}</span>
                  <span>&middot;</span>
                  {event.repoName && <span>{decodeRepoName(event.repoName)}</span>}
                  {event.timestamp > 0n && (
                    <>
                      <span>&middot;</span>
                      <span>{timeAgo(event.timestamp)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <HashDisplay
              hash={event.transactionHash}
              href={etherscanTxUrl(event.transactionHash)}
              prefixLen={8}
              suffixLen={4}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
