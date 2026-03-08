"use client";

import { useDataMode } from "@/components/providers/DataModeProvider";

interface DataModeSwitchProps {
  compact?: boolean;
}

export function DataModeSwitch({ compact = false }: DataModeSwitchProps) {
  const { mode, setMode } = useDataMode();

  const baseBtn =
    "rounded-[6px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors";
  const active = "border-[var(--orange-mid)] bg-[var(--orange-dim)] text-[var(--orange)]";
  const inactive = "border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text2)]";

  return (
    <div className={`inline-flex items-center gap-1 rounded-[7px] border border-[var(--border)] bg-[var(--surface)] p-1 ${compact ? "" : "px-1.5 py-1.5"}`}>
      {!compact && (
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
          Mode
        </span>
      )}
      <button
        type="button"
        onClick={() => setMode("simulate")}
        className={`${baseBtn} ${mode === "simulate" ? active : inactive}`}
      >
        Simulate
      </button>
      <button
        type="button"
        onClick={() => setMode("onchain")}
        className={`${baseBtn} ${mode === "onchain" ? active : inactive}`}
      >
        On-chain
      </button>
    </div>
  );
}

