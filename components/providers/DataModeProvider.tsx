"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DataMode = "simulate" | "onchain";

interface DataModeContextValue {
  mode: DataMode;
  setMode: (next: DataMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = "aegisoe_data_mode";

const DataModeContext = createContext<DataModeContextValue | null>(null);

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DataMode>(() => {
    if (typeof window === "undefined") return "simulate";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "simulate" || stored === "onchain" ? stored : "simulate";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((prev) => (prev === "simulate" ? "onchain" : "simulate")),
    }),
    [mode]
  );

  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

export function useDataMode() {
  const ctx = useContext(DataModeContext);
  if (!ctx) {
    throw new Error("useDataMode must be used within DataModeProvider");
  }
  return ctx;
}
