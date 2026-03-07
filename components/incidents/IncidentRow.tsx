"use client";

import { Badge } from "@/components/ui/Badge";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { decodeRepoName, riskLevelToLabel, formatTimestamp } from "@/lib/decode";
import { truncateAddress } from "@/lib/format";
import type { IncidentRecord } from "@/types";

interface IncidentRowProps {
  incident: IncidentRecord;
  index: number;
}

export function IncidentRow({ incident, index }: IncidentRowProps) {
  return (
    <>
      <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{index + 1}</td>
      <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
        {truncateAddress(incident.operator)}
      </td>
      <td className="px-4 py-3">
        <HashDisplay hash={incident.incidentCommitment} prefixLen={8} suffixLen={4} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]">
        {decodeRepoName(incident.repoName)}
      </td>
      <td className="px-4 py-3">
        <Badge label={riskLevelToLabel(incident.riskLevel)} variant="risk" />
      </td>
      <td className="px-4 py-3">
        <Badge label={incident.rotated ? "rotated" : "pending"} variant="status" />
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted)]">
        {formatTimestamp(incident.timestamp)}
      </td>
    </>
  );
}
