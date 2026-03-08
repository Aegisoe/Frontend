"use client";

import { useState, useCallback } from "react";

const API_BASE = "/api/backend";

export type ScanMode = "simulate" | "onchain";

export interface RepoScanFinding {
  file: string;
  line: number;
  secretType: string;
  maskedValue: string;
  entropy: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | string;
  llmVerified: boolean;
  llmReasoning: string;
}

export interface RepoScanSummary {
  critical: number;
  high: number;
  medium: number;
  total: number;
  sensitiveFilesCount: number;
}

export interface RepoScanAutoFix {
  success: boolean;
  prUrl?: string;
  prNumber?: number;
  branch?: string;
  filesFixed?: number;
  gitignoreUpdated?: boolean;
}

export interface ScanResult {
  status: "completed" | "error";
  repo: string;
  branch: string;
  mode: ScanMode;
  scanDuration: number;
  totalFilesScanned: number;
  totalFilesInRepo: number;
  findings: RepoScanFinding[];
  sensitiveFiles: string[];
  summary: RepoScanSummary;
  autoFix?: RepoScanAutoFix;
  error?: string;
}

interface ScanRequest {
  repoUrl: string;
  branch?: string;
  mode: ScanMode;
  autoFix: boolean;
  maxFiles: number;
}

function extractRepo(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?)\/?/
  );
  if (match) return match[1];
  return trimmed;
}

async function fetchDefaultBranch(repo: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.default_branch === "string") return data.default_branch;
    }
  } catch {
    // Ignore and use fallback branch.
  }
  return "main";
}

export function useScanRepo() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (request: ScanRequest) => {
    const repo = extractRepo(request.repoUrl);
    if (!repo) {
      setError("Invalid GitHub URL");
      return;
    }

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const branch = request.branch?.trim() || (await fetchDefaultBranch(repo));
      const res = await fetch(`${API_BASE}/scan/repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: request.repoUrl.trim(),
          branch,
          mode: request.mode,
          autoFix: request.autoFix,
          maxFiles: request.maxFiles,
        }),
      });
      const data = await res.json();

      if (!res.ok || data?.status === "error") {
        const message = String(data?.error || data?.message || `Scan failed: HTTP ${res.status}`);
        setResult({
          status: "error",
          repo,
          branch,
          mode: request.mode,
          scanDuration: 0,
          totalFilesScanned: 0,
          totalFilesInRepo: 0,
          findings: [],
          sensitiveFiles: [],
          summary: {
            critical: 0,
            high: 0,
            medium: 0,
            total: 0,
            sensitiveFilesCount: 0,
          },
          error: message,
        });
        return;
      }

      const findings = Array.isArray(data?.findings) ? data.findings : [];
      const sensitiveFiles = Array.isArray(data?.sensitiveFiles) ? data.sensitiveFiles : [];
      const summary = data?.summary ?? {};

      setResult({
        status: "completed",
        repo: String(data?.repo || repo),
        branch: String(data?.branch || branch),
        mode: request.mode,
        scanDuration: Number(data?.scanDuration || 0),
        totalFilesScanned: Number(data?.totalFilesScanned || 0),
        totalFilesInRepo: Number(data?.totalFilesInRepo || 0),
        findings: findings as RepoScanFinding[],
        sensitiveFiles,
        summary: {
          critical: Number(summary.critical || 0),
          high: Number(summary.high || 0),
          medium: Number(summary.medium || 0),
          total: Number(summary.total || findings.length),
          sensitiveFilesCount: Number(summary.sensitiveFilesCount || sensitiveFiles.length),
        },
        autoFix: data?.autoFix as RepoScanAutoFix | undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scan failed";
      setError(msg);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsScanning(false);
  }, []);

  return { scan, isScanning, result, error, reset };
}
