"use client";

import { motion } from "framer-motion";
import { decodeRepoName, riskLevelToLabel, timeAgo } from "@/lib/decode";
import { truncateAddress, truncateHash } from "@/lib/format";
import type { ContractEvent } from "@/types";

interface ActivityFeedProps {
  events: ContractEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
          <div className="flex items-center gap-[7px] text-[13px] font-semibold">
            <span className="text-[var(--green)]">&#9679;</span> On-Chain Activity
          </div>
          <span className="font-mono text-[11px] text-[var(--text3)]">live &middot; Sepolia events</span>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-medium text-[var(--text2)]">No on-chain events found</p>
          <p className="mt-1 text-xs text-[var(--text3)]">Events will appear after CRE submits transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
        <div className="flex items-center gap-[7px] text-[13px] font-semibold">
          <span className="text-[var(--green)]">&#9679;</span> On-Chain Activity
        </div>
        <span className="font-mono text-[11px] text-[var(--text3)]">live &middot; Sepolia events</span>
      </div>
      <div>
        {events.slice(0, 8).map((event, index) => (
          <motion.div
            key={`${event.transactionHash}-${event.type}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: index * 0.04 }}
            className="flex gap-[11px] border-b border-[var(--border)] px-[17px] py-[10px] transition-colors last:border-b-0 hover:bg-white/[0.01]"
          >
            {/* Dot */}
            <div
              className="mt-1.5 h-[7px] w-[7px] flex-shrink-0 rounded-full"
              style={{
                background: event.type === "incident"
                  ? (event.riskLevel === 3 ? "var(--red)" : event.riskLevel === 2 ? "var(--orange)" : "var(--amber)")
                  : "var(--green)"
              }}
            />

            {/* Body */}
            <div className="flex-1">
              <div className="mb-[3px] text-xs font-medium text-[var(--text)]">
                {event.type === "incident"
                  ? `IncidentRecorded \u2014 ${riskLevelToLabel(event.riskLevel ?? 0).toUpperCase()}`
                  : "SecretRotated emitted"
                }
              </div>
              <div className="flex flex-wrap gap-[10px] font-mono text-[11px] text-[var(--text3)]">
                {event.type === "incident" && event.repoName && (
                  <span>{decodeRepoName(event.repoName)}</span>
                )}
                {event.type === "rotation" && (
                  <span>operator: {truncateAddress(event.operator)}</span>
                )}
                <span className="text-[var(--orange)]">
                  secretId: {truncateHash(event.secretId, 6, 4)}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="mt-1 flex-shrink-0 font-mono text-[11px] text-[var(--text3)]">
              {event.timestamp > 0n ? timeAgo(event.timestamp) : ""}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
