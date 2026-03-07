"use client";

import { HashDisplay } from "@/components/ui/HashDisplay";
import { formatTimestamp } from "@/lib/decode";
import { truncateAddress } from "@/lib/format";
import type { RotationRecord } from "@/types";

interface RotationRowProps {
  rotation: RotationRecord;
  index: number;
}

export function RotationRow({ rotation, index }: RotationRowProps) {
  return (
    <>
      <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{index + 1}</td>
      <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
        {truncateAddress(rotation.operator)}
      </td>
      <td className="px-4 py-3">
        <HashDisplay hash={rotation.oldCommitment} prefixLen={8} suffixLen={4} />
      </td>
      <td className="px-4 py-3">
        <HashDisplay hash={rotation.newCommitment} prefixLen={8} suffixLen={4} />
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted)]">
        {formatTimestamp(rotation.timestamp)}
      </td>
    </>
  );
}
