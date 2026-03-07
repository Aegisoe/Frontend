"use client";

import { useState, useCallback } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SecretIdInput } from "@/components/proof/SecretIdInput";
import { ProofResult } from "@/components/proof/ProofResult";
import { useIncidents } from "@/hooks/useIncidents";
import { useRotations } from "@/hooks/useRotations";
import { useIncidentCount } from "@/hooks/useIncidentCount";
import { PAGE_SIZE } from "@/config/constants";
import type { IncidentRecord, RotationRecord } from "@/types";

function isValidBytes32(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export default function ProofVerifier() {
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

  // All hooks — only fire when activeSecretId is set
  const { data: incidentData, isLoading: incidentsLoading } = useIncidents(activeSecretId, incidentPage);
  const { data: rotationData, isLoading: rotationsLoading } = useRotations(activeSecretId, rotationPage);
  const { incidentCount, rotationCount, isLatestRotated, isLoading: countsLoading } = useIncidentCount(activeSecretId);

  const incidents = (incidentData as IncidentRecord[] | undefined) ?? [];
  const rotations = (rotationData as RotationRecord[] | undefined) ?? [];
  const totalIncidents = Number(incidentCount ?? 0n);
  const totalRotations = Number(rotationCount ?? 0n);
  const incidentTotalPages = Math.max(1, Math.ceil(totalIncidents / PAGE_SIZE));
  const rotationTotalPages = Math.max(1, Math.ceil(totalRotations / PAGE_SIZE));

  return (
    <PageContainer
      title="Proof Verifier"
      description="Query on-chain incident and rotation history by secretId"
    >
      <SecretIdInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
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
