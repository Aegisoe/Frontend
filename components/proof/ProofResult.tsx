"use client";

import { Badge } from "@/components/ui/Badge";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { RotationTable } from "@/components/rotations/RotationTable";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
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
    return (
      <div className="flex flex-col gap-4">
        <TableSkeleton rows={3} cols={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary bar */}
      <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">Incidents:</span>
          <span className="font-mono text-sm font-medium text-[var(--foreground)]">{incidentCount}</span>
        </div>
        <div className="h-4 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">Rotations:</span>
          <span className="font-mono text-sm font-medium text-[var(--foreground)]">{rotationCount}</span>
        </div>
        <div className="h-4 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">Latest:</span>
          <Badge
            label={isLatestRotated ? "rotated" : "pending"}
            variant="status"
          />
        </div>
      </div>

      {/* Incident History */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-[var(--foreground)]">Incident History</h3>
        <IncidentTable incidents={incidents} />
        <div className="mt-3">
          <Pagination
            currentPage={incidentPage}
            totalPages={incidentTotalPages}
            onPageChange={onIncidentPageChange}
          />
        </div>
      </div>

      {/* Rotation History */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-[var(--foreground)]">Rotation History</h3>
        <RotationTable rotations={rotations} />
        <div className="mt-3">
          <Pagination
            currentPage={rotationPage}
            totalPages={rotationTotalPages}
            onPageChange={onRotationPageChange}
          />
        </div>
      </div>
    </div>
  );
}
