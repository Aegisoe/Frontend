"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useContractEvents } from "@/hooks/useContractEvents";
import { decodeRepoName, riskLevelToLabel, formatTimestamp } from "@/lib/decode";
import { truncateAddress, etherscanTxUrl } from "@/lib/format";
import { PAGE_SIZE } from "@/config/constants";

type FilterType = "all" | "incident" | "rotation";

export default function IncidentLog() {
  const { events, isLoading } = useContractEvents();
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);

  const filteredEvents = filter === "all"
    ? events
    : events.filter((e) => e.type === filter);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const paginatedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <PageContainer
      title="Incident Log"
      description="All on-chain IncidentRecorded and SecretRotated events"
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        {(["all", "incident", "rotation"] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
            }`}
          >
            {f === "all" ? `All (${events.length})` :
             f === "incident" ? `Incidents (${events.filter(e => e.type === "incident").length})` :
             `Rotations (${events.filter(e => e.type === "rotation").length})`}
          </button>
        ))}
      </div>

      {/* Event list */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : paginatedEvents.length === 0 ? (
        <EmptyState title="No events found" description="No on-chain events match this filter" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Secret ID</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Operator</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Details</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Time</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted-foreground)]">Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedEvents.map((event, index) => (
                <motion.tr
                  key={`${event.transactionHash}-${event.type}-${index}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className="hover:bg-[var(--card-hover)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        event.type === "incident" ? "bg-[var(--critical)]" : "bg-[var(--success)]"
                      }`} />
                      <span className="text-xs font-medium text-[var(--foreground)]">
                        {event.type === "incident" ? "Incident" : "Rotation"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <HashDisplay hash={event.secretId} prefixLen={8} suffixLen={4} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                    {truncateAddress(event.operator)}
                  </td>
                  <td className="px-4 py-3">
                    {event.type === "incident" ? (
                      <div className="flex items-center gap-2">
                        {event.riskLevel !== undefined && (
                          <Badge label={riskLevelToLabel(event.riskLevel)} variant="risk" />
                        )}
                        {event.repoName && (
                          <span className="font-mono text-xs text-[var(--muted)]">
                            {decodeRepoName(event.repoName)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <HashDisplay hash={event.oldCommitment ?? "0x"} prefixLen={6} suffixLen={3} />
                        <span className="text-[var(--muted)]">&rarr;</span>
                        <HashDisplay hash={event.newCommitment ?? "0x"} prefixLen={6} suffixLen={3} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {event.timestamp > 0n ? formatTimestamp(event.timestamp) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <HashDisplay
                      hash={event.transactionHash}
                      href={etherscanTxUrl(event.transactionHash)}
                      prefixLen={6}
                      suffixLen={4}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
