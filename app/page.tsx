"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SimulationActivityFeed } from "@/components/dashboard/SimulationActivityFeed";
import { useBackendIncidents, useBackendHealth } from "@/hooks/useBackendApi";
import { useContractEvents } from "@/hooks/useContractEvents";
import { useDataMode } from "@/components/providers/DataModeProvider";
import { DataModeSwitch } from "@/components/ui/DataModeSwitch";

export default function Dashboard() {
  const { data: backendData } = useBackendIncidents();
  const { events } = useContractEvents();
  const health = useBackendHealth();
  const { mode } = useDataMode();

  const incidents = backendData?.incidents ?? [];

  const onchainIncidentCount = events.filter((e) => e.type === "incident").length;
  const onchainRotationCount = events.filter((e) => e.type === "rotation").length;
  const simulatedIncidentCount = incidents.length;
  const simulatedRotationCount = incidents.filter((i) => i.status === "rotated").length;

  const totalIncidents = mode === "simulate" ? simulatedIncidentCount : onchainIncidentCount;
  const totalRotations = mode === "simulate" ? simulatedRotationCount : onchainRotationCount;
  const pendingCount = incidents.filter((i) => i.status === "detected" || i.status === "rotating").length;

  // Build backend status note
  const backendNote = health.isOnline
    ? health.creMode !== "unknown"
      ? `CRE: ${health.creMode} \u00B7 Chain: ${health.onChain ? "active" : "off"}`
      : health.service || "Connected"
    : "Unreachable";

  const stats = [
    {
      label: "Total Incidents",
      value: totalIncidents,
      note: totalIncidents > 0
        ? mode === "simulate" ? `${totalIncidents} simulated` : `${totalIncidents} on-chain`
        : "No incidents yet",
      noteType: totalIncidents > 0 ? "warn" as const : "normal" as const,
      icon: "\u26A0",
      iconBg: "bg-[var(--orange-dim)]",
    },
    {
      label: "Rotations Done",
      value: totalRotations,
      note: totalRotations > 0 ? `${totalRotations} confirmed` : "No rotations yet",
      noteType: totalRotations > 0 ? "up" as const : "normal" as const,
      icon: "\u2713",
      iconBg: "bg-[rgba(34,197,94,0.1)]",
    },
    {
      label: "Pending Rotation",
      value: pendingCount,
      note: pendingCount > 0 ? "Awaiting rotation" : "All clear",
      noteType: pendingCount > 0 ? "warn" as const : "up" as const,
      icon: "!",
      iconBg: "bg-[rgba(239,68,68,0.1)]",
      valueStyle: pendingCount > 0 ? "text-[var(--red)]" : undefined,
    },
    {
      label: "Backend Status",
      value: health.isOnline === null ? "..." : health.isOnline ? "ONLINE" : "OFFLINE",
      note: backendNote,
      noteType: health.isOnline ? "up" as const : "warn" as const,
      icon: "\u2B21",
      iconBg: "bg-[rgba(59,130,246,0.1)]",
      valueStyle: health.isOnline
        ? "text-[var(--green)] !text-lg mt-1"
        : "text-[var(--red)] !text-lg mt-1",
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description={`Real-time overview · ${mode === "simulate" ? "CRE Simulation" : "On-chain (Sepolia)"}`}
      actions={
        <>
          <DataModeSwitch />
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
          >
            &#8634; Refresh
          </button>
        </>
      }
    >
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentIncidents incidents={incidents} />
        {mode === "simulate" ? (
          <SimulationActivityFeed incidents={incidents} />
        ) : (
          <ActivityFeed events={events} />
        )}
      </div>
    </PageContainer>
  );
}
