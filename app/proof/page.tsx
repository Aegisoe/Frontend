"use client";

import { useCallback, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SecretIdInput } from "@/components/proof/SecretIdInput";
import { ProofResult } from "@/components/proof/ProofResult";
import { useIncidents } from "@/hooks/useIncidents";
import { useRotations } from "@/hooks/useRotations";
import { useIncidentCount } from "@/hooks/useIncidentCount";
import { useBackendIncidents } from "@/hooks/useBackendApi";
import { PAGE_SIZE } from "@/config/constants";
import type { IncidentRecord, RotationRecord } from "@/types";
import { DataModeSwitch } from "@/components/ui/DataModeSwitch";
import { useDataMode } from "@/components/providers/DataModeProvider";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { Badge } from "@/components/ui/Badge";

function isValidBytes32(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export default function ProofVerifier() {
  const { mode } = useDataMode();
  const { data: backendData } = useBackendIncidents();

  const [inputValue, setInputValue] = useState("");
  const [activeSecretId, setActiveSecretId] = useState<`0x${string}` | undefined>(undefined);
  const [incidentPage, setIncidentPage] = useState(1);
  const [rotationPage, setRotationPage] = useState(1);

  const isValid = isValidBytes32(inputValue);

  const handleSubmit = useCallback(() => {
    if (isValid) {
      setActiveSecretId(inputValue as `0x${string}`);
      setIncidentPage(1);
      setRotationPage(1);
    }
  }, [inputValue, isValid]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setActiveSecretId(undefined);
    setIncidentPage(1);
    setRotationPage(1);
  }, []);

  const { data: incidentData, isLoading: incidentsLoading } = useIncidents(activeSecretId, incidentPage);
  const { data: rotationData, isLoading: rotationsLoading } = useRotations(activeSecretId, rotationPage);
  const { incidentCount, rotationCount, isLatestRotated, isLoading: countsLoading } = useIncidentCount(activeSecretId);

  const incidents = (incidentData as IncidentRecord[] | undefined) ?? [];
  const rotations = (rotationData as RotationRecord[] | undefined) ?? [];
  const totalIncidents = Number(incidentCount ?? 0n);
  const totalRotations = Number(rotationCount ?? 0n);
  const incidentTotalPages = Math.max(1, Math.ceil(totalIncidents / PAGE_SIZE));
  const rotationTotalPages = Math.max(1, Math.ceil(totalRotations / PAGE_SIZE));

  const simulatedRows = useMemo(() => {
    const rows = backendData?.incidents ?? [];
    if (!inputValue) return rows.slice(0, 10);
    const q = inputValue.toLowerCase();
    return rows.filter((row) => {
      const bag = [row.secretId ?? "", row.id, row.repo, row.commitSha, row.incidentCommitment ?? ""]
        .join(" ")
        .toLowerCase();
      return bag.includes(q);
    });
  }, [backendData?.incidents, inputValue]);

  if (mode === "simulate") {
    return (
      <PageContainer
        title="Proof Verifier"
        description="Simulation mode: verifies records from backend callback data"
        actions={<DataModeSwitch />}
      >
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="mb-1 text-sm font-semibold text-[var(--text)]">Simulation Proof Mode</div>
          <p className="font-mono text-[11px] text-[var(--text3)]">
            On-chain proof is optional for this demo. Switch to <span className="text-[var(--orange)]">On-chain</span> mode when you want to query Sepolia contract state.
          </p>
        </div>

        <SecretIdInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={() => {}}
          onClear={() => setInputValue("")}
          isValid={true}
        />

        <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[17px] py-[13px]">
            <span className="text-[13px] font-semibold">Simulated Proof Records</span>
            <span className="font-mono text-[11px] text-[var(--text3)]">{simulatedRows.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Secret ID", "Incident Commitment", "Repo", "Status", "Time"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-[var(--border)] bg-[var(--surface2)] px-[15px] py-[9px] text-left font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text3)] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {simulatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-[15px] py-8 text-center text-sm text-[var(--text3)]">
                      No simulated proof data found.
                    </td>
                  </tr>
                ) : (
                  simulatedRows.slice(0, 20).map((row, idx) => (
                    <tr key={`${row.id}-${idx}`} className="transition-colors hover:bg-white/[0.01]">
                      <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                        {row.secretId ? <HashDisplay hash={row.secretId} prefixLen={6} suffixLen={4} /> : <span className="font-mono text-[11px] text-[var(--text4)]">n/a</span>}
                      </td>
                      <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                        {row.incidentCommitment ? <HashDisplay hash={row.incidentCommitment} prefixLen={6} suffixLen={4} /> : <span className="font-mono text-[11px] text-[var(--text4)]">n/a</span>}
                      </td>
                      <td className="border-b border-[var(--border)] px-[15px] py-[11px] text-[13px]">{row.repo}</td>
                      <td className="border-b border-[var(--border)] px-[15px] py-[11px]">
                        <Badge label={row.status} variant="status" />
                      </td>
                      <td className="border-b border-[var(--border)] px-[15px] py-[11px] font-mono text-[11px] text-[var(--text3)]">
                        {row.processedAt ? new Date(row.processedAt).toLocaleString() : row.detectedAt ? new Date(row.detectedAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Proof Verifier"
      description="Query on-chain incident + rotation history by secretId (bytes32)"
      actions={<DataModeSwitch />}
    >
      <SecretIdInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onClear={handleClear}
        isValid={isValid || inputValue.length === 0}
      />

      {activeSecretId && (
        <ProofResult
          incidents={incidents}
          rotations={rotations}
          incidentCount={totalIncidents}
          rotationCount={totalRotations}
          isLatestRotated={isLatestRotated}
          incidentPage={incidentPage}
          rotationPage={rotationPage}
          incidentTotalPages={incidentTotalPages}
          rotationTotalPages={rotationTotalPages}
          onIncidentPageChange={setIncidentPage}
          onRotationPageChange={setRotationPage}
          isLoading={incidentsLoading || rotationsLoading || countsLoading}
        />
      )}
    </PageContainer>
  );
}

