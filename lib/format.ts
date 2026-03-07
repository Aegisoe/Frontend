import { ETHERSCAN_BASE } from "@/config/constants";

/**
 * Truncate address: 0x6b75...5e57
 */
export function truncateAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Truncate hash: 0xabcd...ef12
 */
export function truncateHash(hash: string, prefixLen = 10, suffixLen = 6): string {
  if (hash.length <= prefixLen + suffixLen) return hash;
  return `${hash.slice(0, prefixLen)}...${hash.slice(-suffixLen)}`;
}

/**
 * Etherscan link for transaction hash.
 */
export function etherscanTxUrl(txHash: string): string {
  return `${ETHERSCAN_BASE}/tx/${txHash}`;
}

/**
 * Etherscan link for address.
 */
export function etherscanAddressUrl(address: string): string {
  return `${ETHERSCAN_BASE}/address/${address}`;
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
