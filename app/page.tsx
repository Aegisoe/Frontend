"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useBackendIncidents, useBackendHealth } from "@/hooks/useBackendApi";
import { useContractEvents } from "@/hooks/useContractEvents";

export default function Dashboard() {
  const { data: backendData, isLoading: beLoading } = useBackendIncidents();
  const { events, isLoading: eventsLoading } = useContractEvents();
  const isOnline = useBackendHealth();

  const incidents = backendData?.incidents ?? [];

  const totalIncidents = events.filter((e) => e.type === "incident").length;
  const totalRotations = events.filter((e) => e.type === "rotation").length;
  const pendingCount = incidents.filter((i) => i.status === "detected" || i.status === "rotating").length;

  const stats = [
    {
      label: "Total Incidents",
      value: totalIncidents,
      subtitle: "On-chain records",
      color: "text-[var(--critical)]",
    },
    {
      label: "Total Rotations",
      value: totalRotations,
      subtitle: "Keys rotated",
      color: "text-[var(--success)]",
    },
    {
      label: "Pending",
      value: pendingCount,
      subtitle: "Awaiting rotation",
      color: pendingCount > 0 ? "text-[var(--medium)]" : "text-[var(--foreground)]",
    },
    {
      label: "Backend",
      value: isOnline === null ? "..." : isOnline ? "Online" : "Offline",
      subtitle: isOnline ? "Railway" : "Unreachable",
      color: isOnline ? "text-[var(--success)]" : "text-[var(--critical)]",
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="AEGISOE incident monitoring and on-chain proof overview"
    >
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentIncidents incidents={incidents} />
        <ActivityFeed events={events} />
      </div>
    </PageContainer>
  );
}
