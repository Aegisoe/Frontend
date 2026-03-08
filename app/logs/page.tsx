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
import { decodeRepoName, riskLevelToLabel, timeAgo } from "@/lib/decode";
import { etherscanTxUrl } from "@/lib/format";
import { PAGE_SIZE } from "@/config/constants";

type EventFilter = "all" | "incident" | "rotation";
type RiskFilter = "all" | "critical" | "high" | "medium" | "low";

export default function IncidentLog() {
  const { events, isLoading } = useContractEvents();
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredEvents = events.filter((e) => {
    if (eventFilter !== "all" && e.type !== eventFilter) return false;
    if (riskFilter !== "all" && e.type === "incident" && e.riskLevel !== undefined) {
      const label = riskLevelToLabel(e.riskLevel).toLowerCase();
      if (label !== riskFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchesSecret = e.secretId.toLowerCase().includes(q);
      const matchesRepo = e.type === "incident" && e.repoName
        ? decodeRepoName(e.repoName).toLowerCase().includes(q)
        : false;
      if (!matchesSecret && !matchesRepo) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const paginatedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setEventFilter("all");
    setRiskFilter("all");
    setSearch("");
    setPage(1);
  };

  return (
    <PageContainer
      title="Incident Log"
      description="All on-chain IncidentRecorded + SecretRotated events"
    >
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search secretId or repo..."
          className="max-w-[280px] flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[7px] font-mono text-[11px] text-[var(--text)] outline-none transition-[border-color] duration-150 placeholder:text-[var(--text4)] focus:border-[var(--orange)]"
        />
        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value as EventFilter); setPage(1); }}
          className="cursor-pointer rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[7px] font-mono text-[11px] text-[var(--text2)] outline-none transition-[border-color] duration-150 focus:border-[var(--orange)]"
        >
          <option value="all">All Events</option>
          <option value="incident">IncidentRecorded</option>
          <option value="rotation">SecretRotated</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => { setRiskFilter(e.target.value as RiskFilter); setPage(1); }}
          className="cursor-pointer rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[7px] font-mono text-[11px] text-[var(--text2)] outline-none transition-[border-color] duration-150 focus:border-[var(--orange)]"
        >
          <option value="all">All Risk Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-transparent px-[11px] py-[5px] text-xs font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
        >
          Reset
        </button>
      </div>

      {/* Event table */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : paginatedEvents.length === 0 ? (
        <EmptyState title="No events found" description="No on-chain events match this filter" />
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
            <span className="text-[13px] font-semibold">All Events</span>
            <span className="font-mono text-[11px] text-[var(--text3)]">
              {filteredEvents.length} total &middot; page {page} of {totalPages}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Event", "Secret ID", "Repo / Details", "Risk", "Status", "Block", "Time", "TX"].map((h) => (
                    <th key={h} className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((event, index) => (
                  <motion.tr
                    key={`${event.transactionHash}-${event.type}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, delay: index * 0.03 }}
                    className="transition-colors hover:bg-white/[0.01]"
                  >
                    {/* Event type badge */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      <Badge
                        label={event.type === "incident" ? "IncidentRecorded" : "SecretRotated"}
                        variant="event"
                      />
                    </td>
                    {/* Secret ID */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      <HashDisplay hash={event.secretId} prefixLen={6} suffixLen={4} />
                    </td>
                    {/* Repo / Details */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      {event.type === "incident" && event.repoName ? (
                        <div>
                          <div className="text-[13px] font-medium">{decodeRepoName(event.repoName)}</div>
                        </div>
                      ) : event.type === "rotation" ? (
                        <div className="font-mono text-[11px] text-[var(--text3)]">Rotation</div>
                      ) : (
                        <span className="text-[var(--text3)]">&mdash;</span>
                      )}
                    </td>
                    {/* Risk */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      {event.type === "incident" && event.riskLevel !== undefined ? (
                        <Badge label={riskLevelToLabel(event.riskLevel)} variant="risk" />
                      ) : (
                        <Badge label="\u2014" variant="default" />
                      )}
                    </td>
                    {/* Status */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      {event.type === "rotation" ? (
                        <Badge label="Confirmed" variant="status" />
                      ) : (
                        <Badge label="Recorded" variant="default" />
                      )}
                    </td>
                    {/* Block */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text2)]">
                      {event.blockNumber.toLocaleString()}
                    </td>
                    {/* Time */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text3)]">
                      {event.timestamp > 0n ? timeAgo(event.timestamp) : "\u2014"}
                    </td>
                    {/* TX */}
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      <HashDisplay
                        hash={event.transactionHash}
                        href={etherscanTxUrl(event.transactionHash)}
                        prefixLen={4}
                        suffixLen={4}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={filteredEvents.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </PageContainer>
  );
}
