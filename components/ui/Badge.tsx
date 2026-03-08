"use client";

type BadgeVariant = "risk" | "status" | "event" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const BASE = "inline-flex items-center gap-[3px] rounded-[4px] border px-2 py-[2px] font-mono text-[10px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap";

function getClasses(label: string, variant: BadgeVariant): string {
  const l = label.toLowerCase();

  if (variant === "risk") {
    if (l === "critical") return `${BASE} border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] text-[var(--red)]`;
    if (l === "high") return `${BASE} border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] text-[var(--orange)]`;
    if (l === "medium") return `${BASE} border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.1)] text-[var(--amber)]`;
    if (l === "low" || l === "none") return `${BASE} border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.1)] text-[var(--green)]`;
    return `${BASE} border-[var(--border)] bg-[rgba(82,82,91,0.12)] text-[var(--text3)]`;
  }

  if (variant === "status") {
    if (l === "rotated" || l === "confirmed") return `${BASE} border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.1)] text-[var(--green)]`;
    if (l === "pending" || l === "rotating" || l === "detected") return `${BASE} border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)] text-[var(--orange)]`;
    return `${BASE} border-[var(--border)] bg-[rgba(82,82,91,0.12)] text-[var(--text3)]`;
  }

  if (variant === "event") {
    if (l === "incident" || l === "incidentrecorded") return `${BASE} border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.07)] text-[var(--red)]`;
    if (l === "rotation" || l === "secretrotated") return `${BASE} border-[rgba(34,197,94,0.15)] bg-[rgba(34,197,94,0.07)] text-[var(--green)]`;
    return `${BASE} border-[var(--border)] bg-[rgba(82,82,91,0.12)] text-[var(--text3)]`;
  }

  return `${BASE} border-[var(--border)] bg-[rgba(82,82,91,0.12)] text-[var(--text3)]`;
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  return <span className={getClasses(label, variant)}>{label}</span>;
}
