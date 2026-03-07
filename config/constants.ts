export const CONTRACT_ADDRESS = "0xf497C0B1D82d6fc1deaFe63a2DB7dBe81d87Da71" as const;

export const BACKEND_URL = "https://aegisoebe-production.up.railway.app";

export const CRE_OPERATOR_ADDRESS = "0x6b75074B52d17A1FD101ED984605e3EF2EAB5e57" as const;

export const CHAIN_ID = 11155111; // Sepolia

export const PAGE_SIZE = 10;

export const ETHERSCAN_BASE = "https://sepolia.etherscan.io";

export const RISK_LABELS = ["NONE", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const RISK_COLORS: Record<string, string> = {
  NONE: "text-[var(--muted)]",
  MEDIUM: "text-[var(--medium)]",
  HIGH: "text-[var(--high)]",
  CRITICAL: "text-[var(--critical)]",
};

export const RISK_BG_COLORS: Record<string, string> = {
  NONE: "bg-[var(--muted)]/10",
  MEDIUM: "bg-[var(--medium)]/10",
  HIGH: "bg-[var(--high)]/10",
  CRITICAL: "bg-[var(--critical)]/10",
};
