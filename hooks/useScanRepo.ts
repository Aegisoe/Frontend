"use client";

import { useState, useCallback, useRef } from "react";

const API_BASE = "/api/backend";

export interface ScanResult {
  success: boolean;
  mode: "scan" | "demo";
  message: string;
  repo: string;
}

function extractRepo(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?)\/?/
  );
  if (match) return match[1];
  return trimmed;
}

export function useScanRepo() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"scan" | "demo" | null>(null);
  const checkedRef = useRef(false);
  const hasScanEndpoint = useRef(false);

  const checkScanEndpoint = useCallback(async () => {
    if (checkedRef.current) return hasScanEndpoint.current;
    try {
      const res = await fetch(`${API_BASE}/scan`, { method: "POST", body: "{}" });
      // 404 = endpoint doesn't exist, anything else = it exists
      hasScanEndpoint.current = res.status !== 404;
    } catch {
      hasScanEndpoint.current = false;
    }
    checkedRef.current = true;
    return hasScanEndpoint.current;
  }, []);

  const scan = useCallback(
    async (repoUrl: string) => {
      const repo = extractRepo(repoUrl);
      if (!repo) {
        setError("Invalid GitHub URL");
        return;
      }

      setIsScanning(true);
      setError(null);
      setResult(null);

      try {
        const canScan = await checkScanEndpoint();

        if (canScan) {
          // Real scan endpoint available
          setScanMode("scan");
          const res = await fetch(`${API_BASE}/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repoUrl: repoUrl.trim(), repo }),
          });

          if (!res.ok) throw new Error(`Scan failed: HTTP ${res.status}`);
          const data = await res.json();

          setResult({
            success: true,
            mode: "scan",
            message: data.message ?? "Scan complete",
            repo,
          });
        } else {
          // Fallback to /demo/trigger
          setScanMode("demo");
          const res = await fetch(`${API_BASE}/demo/trigger`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secretType: "generic",
              secretValue: `scan-request-${Date.now()}`,
              repo,
              riskLevel: "HIGH",
            }),
          });

          if (!res.ok) throw new Error(`Demo trigger failed: HTTP ${res.status}`);

          setResult({
            success: true,
            mode: "demo",
            message: "Incident created via demo trigger. Check Dashboard for results.",
            repo,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Scan failed";
        setError(msg);
      } finally {
        setIsScanning(false);
      }
    },
    [checkScanEndpoint]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsScanning(false);
  }, []);

  return { scan, isScanning, result, error, scanMode, reset };
}
