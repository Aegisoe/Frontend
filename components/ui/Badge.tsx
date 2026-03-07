"use client";

import { RISK_COLORS, RISK_BG_COLORS } from "@/config/constants";

interface BadgeProps {
  label: string;
  variant?: "risk" | "status" | "default";
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  let classes = "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-medium";

  if (variant === "risk") {
    const colorClass = RISK_COLORS[label] || "text-[var(--muted-foreground)]";
    const bgClass = RISK_BG_COLORS[label] || "bg-[var(--card)]";
    classes += ` ${colorClass} ${bgClass}`;
  } else if (variant === "status") {
    if (label === "rotated") {
      classes += " text-[var(--success)] bg-[var(--success)]/10";
    } else if (label === "pending") {
      classes += " text-[var(--medium)] bg-[var(--medium)]/10";
    } else if (label === "rotating") {
      classes += " text-[var(--accent)] bg-[var(--accent)]/10";
    } else {
      classes += " text-[var(--muted-foreground)] bg-[var(--card)]";
    }
  } else {
    classes += " text-[var(--muted-foreground)] bg-[var(--card)]";
  }

  return <span className={classes}>{label}</span>;
}
