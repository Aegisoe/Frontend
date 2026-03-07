import { RISK_LABELS } from "@/config/constants";

/**
 * Decode bytes32 (zero-padded UTF-8) to readable string.
 * Strips trailing null bytes.
 */
export function decodeRepoName(bytes32: `0x${string}`): string {
  try {
    const hex = bytes32.slice(2);
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.slice(i, i + 2), 16);
      if (code === 0) break;
      str += String.fromCharCode(code);
    }
    return str || bytes32.slice(0, 10) + "...";
  } catch {
    return bytes32.slice(0, 10) + "...";
  }
}

/**
 * Convert uint8 risk level enum to label string.
 */
export function riskLevelToLabel(level: number): string {
  return RISK_LABELS[level] ?? "UNKNOWN";
}

/**
 * Convert uint48 on-chain timestamp (seconds) to JS Date.
 */
export function formatTimestamp(ts: bigint): string {
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Relative time string (e.g. "2 min ago").
 */
export function timeAgo(ts: bigint): string {
  const now = Date.now();
  const then = Number(ts) * 1000;
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
