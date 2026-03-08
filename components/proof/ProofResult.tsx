"use client";

import { Badge } from "@/components/ui/Badge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { decodeRepoName, riskLevelToLabel, formatTimestamp } from "@/lib/decode";
import { truncateAddress, truncateHash, etherscanTxUrl } from "@/lib/format";
import { PAGE_SIZE } from "@/config/constants";
import type { IncidentRecord, RotationRecord } from "@/types";

interface ProofResultProps {
  incidents: IncidentRecord[];
  rotations: RotationRecord[];
  incidentCount: number;
  rotationCount: number;
  isLatestRotated: boolean | undefined;
  incidentPage: number;
  rotationPage: number;
  incidentTotalPages: number;
  rotationTotalPages: number;
  onIncidentPageChange: (page: number) => void;
  onRotationPageChange: (page: number) => void;
  isLoading: boolean;
}

function ProofRow({ label, children, color }: { label: string; children: React.ReactNode; color?: string }) {
  return (
    <div className="flex flex-col gap-[2px] border-b border-[var(--border)] px-[15px] py-[9px] last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text3)]">{label}</span>
      <span className={`break-all font-mono text-xs ${color ?? "text-[var(--text)]"}`}>{children}</span>
    </div>
  );
}

export function ProofResult({
  incidents,
  rotations,
  incidentCount,
  rotationCount,
  isLatestRotated,
  incidentPage,
  rotationPage,
  incidentTotalPages,
  rotationTotalPages,
  onIncidentPageChange,
  onRotationPageChange,
  isLoading,
}: ProofResultProps) {
  if (isLoading) {
    return <TableSkeleton rows={3} cols={5} />;
  }

  const latestIncident = incidents[0];
  const latestRotation = rotations[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Proof cards — 2 col grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Incident card */}
        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[11px]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.07em]">Incident Record</span>
            {latestIncident && (
              <Badge label={riskLevelToLabel(latestIncident.riskLevel)} variant="risk" />
            )}
          </div>
          {latestIncident ? (
            <>
              <ProofRow label="Repo Name">{decodeRepoName(latestIncident.repoName)}</ProofRow>
              <ProofRow label="Risk Level" color="text-[var(--red)]">
                {riskLevelToLabel(latestIncident.riskLevel).toUpperCase()} ({latestIncident.riskLevel})
              </ProofRow>
              <ProofRow label="Operator" color="text-[var(--text2)]">
                {truncateAddress(latestIncident.operator)}
              </ProofRow>
              <ProofRow label="Timestamp">{formatTimestamp(latestIncident.timestamp)}</ProofRow>
              <ProofRow label="Incident Count">{incidentCount} recorded</ProofRow>
              <ProofRow label="Latest Rotated?" color={isLatestRotated ? "text-[var(--green)]" : "text-[var(--red)]"}>
                {isLatestRotated ? "\u2713 Yes \u2014 confirmed on-chain" : "\u2717 Not yet rotated"}
              </ProofRow>
              <ProofRow label="Commitment">
                <HashDisplay hash={latestIncident.incidentCommitment} prefixLen={8} suffixLen={4} />
              </ProofRow>
            </>
          ) : (
            <div className="flex items-center justify-center py-10 text-sm text-[var(--text3)]">
              No incident records found
            </div>
          )}
        </div>

        {/* Rotation card */}
        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[11px]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.07em]">Rotation Record</span>
            {latestRotation && <Badge label="Rotated" variant="status" />}
          </div>
          {latestRotation ? (
            <>
              <ProofRow label="Old Commitment" color="text-[var(--text2)]">
                {truncateHash(latestRotation.oldCommitment, 8, 4)}
              </ProofRow>
              <ProofRow label="New Commitment" color="text-[var(--text2)]">
                {truncateHash(latestRotation.newCommitment, 8, 4)}
              </ProofRow>
              <ProofRow label="Operator" color="text-[var(--text2)]">
                {truncateAddress(latestRotation.operator)}
              </ProofRow>
              <ProofRow label="Rotation Count">{rotationCount} total</ProofRow>
              <ProofRow label="Last Rotated">{formatTimestamp(latestRotation.timestamp)}</ProofRow>
              <ProofRow label="Verification" color="text-[var(--green)]">
                &#10003; Commitment verified on-chain
              </ProofRow>
            </>
          ) : (
            <div className="flex items-center justify-center py-10 text-sm text-[var(--text3)]">
              No rotation records found
            </div>
          )}
        </div>
      </div>

      {/* Rotation history table */}
      {rotations.length > 0 && (
        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
            <span className="text-[13px] font-semibold">Rotation History</span>
            <span className="font-mono text-[11px] text-[var(--text3)]">
              {rotationCount} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">#</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Old Commitment</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">New Commitment</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {rotations.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-white/[0.01]">
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text2)] last:border-b-0">{rotationCount - i}</td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] last:border-b-0">
                      <HashDisplay hash={r.oldCommitment} prefixLen={8} suffixLen={4} />
                    </td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] last:border-b-0">
                      <HashDisplay hash={r.newCommitment} prefixLen={8} suffixLen={4} />
                    </td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text3)] last:border-b-0">
                      {formatTimestamp(r.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={rotationPage}
            totalPages={rotationTotalPages}
            totalItems={rotationCount}
            pageSize={PAGE_SIZE}
            onPageChange={onRotationPageChange}
          />
        </div>
      )}

      {/* Incident history table */}
      {incidents.length > 0 && (
        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
            <span className="text-[13px] font-semibold">Incident History</span>
            <span className="font-mono text-[11px] text-[var(--text3)]">
              {incidentCount} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">#</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Repo</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Risk</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Status</th>
                  <th className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc, i) => (
                  <tr key={i} className="transition-colors hover:bg-white/[0.01]">
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text2)]">{incidentCount - i}</td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] text-[13px] font-medium">{decodeRepoName(inc.repoName)}</td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      <Badge label={riskLevelToLabel(inc.riskLevel)} variant="risk" />
                    </td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                      <Badge label={inc.rotated ? "Rotated" : "Pending"} variant="status" />
                    </td>
                    <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[13px] text-[var(--text3)]">
                      {formatTimestamp(inc.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={incidentPage}
            totalPages={incidentTotalPages}
            totalItems={incidentCount}
            pageSize={PAGE_SIZE}
            onPageChange={onIncidentPageChange}
          />
        </div>
      )}
    </div>
  );
}
