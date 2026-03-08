"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useScanRepo } from "@/hooks/useScanRepo";
import { Badge } from "@/components/ui/Badge";
import { useDataMode } from "@/components/providers/DataModeProvider";

function isValidGitHubUrl(value: string): boolean {
  if (!value.trim()) return true;
  return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9._-]+(\/[a-zA-Z0-9._-]+)?\/?$/.test(
    value.trim()
  );
}

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [autoFix, setAutoFix] = useState(false);
  const [maxFiles, setMaxFiles] = useState(50);
  const { mode } = useDataMode();
  const { scan, isScanning, result, error, reset } = useScanRepo();

  const validUrl = isValidGitHubUrl(url);
  const canSubmit = url.trim().length > 0 && validUrl && !isScanning;
  const effectiveError = error || (result?.status === "error" ? result.error : null);

  const summaryCards = useMemo(() => {
    if (!result || result.status !== "completed") return [];
    return [
      { label: "Total Findings", value: result.summary.total, color: "text-[var(--text)]" },
      { label: "Critical", value: result.summary.critical, color: "text-[var(--red)]" },
      { label: "High", value: result.summary.high, color: "text-[var(--orange)]" },
      { label: "Medium", value: result.summary.medium, color: "text-[var(--amber)]" },
    ];
  }, [result]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    scan({
      repoUrl: url,
      branch: branch.trim() || undefined,
      mode,
      autoFix,
      maxFiles: Number.isFinite(maxFiles) ? Math.min(Math.max(maxFiles, 1), 500) : 50,
    });
  }, [autoFix, branch, canSubmit, maxFiles, mode, scan, url]);

  const handleClear = useCallback(() => {
    setUrl("");
    setBranch("");
    setAutoFix(false);
    setMaxFiles(50);
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-[18px]">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">
            Repository Scan Request
          </span>
          <Badge label={mode === "simulate" ? "simulate" : "on-chain"} variant="default" />
        </div>

        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (result) reset();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="https://github.com/owner/repo"
            spellCheck={false}
            className={`flex-1 rounded-[6px] border bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] placeholder-[var(--text4)] outline-none transition-[border-color] duration-150 ${
              url && !validUrl
                ? "border-[var(--red)]"
                : "border-[var(--border)] focus:border-[var(--orange)]"
            }`}
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-4 py-[7px] font-mono text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isScanning ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Scanning...
              </>
            ) : (
              "Scan Repository"
            )}
          </button>
          {(url || result) && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch (optional)"
            spellCheck={false}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] placeholder-[var(--text4)] outline-none focus:border-[var(--orange)]"
          />
          <input
            type="number"
            min={1}
            max={500}
            value={maxFiles}
            onChange={(e) => setMaxFiles(Number(e.target.value || 50))}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] outline-none focus:border-[var(--orange)]"
          />
          <label className="flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text2)]">
            <input
              type="checkbox"
              checked={autoFix}
              onChange={(e) => setAutoFix(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--orange)]"
            />
            Auto-fix PR
          </label>
        </div>

        {url && !validUrl && (
          <p className="mt-2 text-xs text-[var(--red)]">
            Enter a valid GitHub URL (example: https://github.com/owner/repo)
          </p>
        )}
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[10px] border border-[var(--orange-mid)] bg-[var(--orange-dim)] p-5"
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
              <span className="text-[13px] font-semibold text-[var(--orange)]">Scanning...</span>
            </div>
            <p className="font-mono text-[11px] text-[var(--text3)]">
              Running repo scanner, entropy checks, and LLM verification.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {effectiveError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[10px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] p-4"
          >
            <div className="mb-1 text-[13px] font-semibold text-[var(--red)]">Scan Error</div>
            <p className="font-mono text-[11px] text-[var(--text3)]">{effectiveError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && result.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(34,197,94,0.1)] text-[var(--green)]">
                  &#10003;
                </div>
                <span className="text-[13px] font-semibold text-[var(--text)]">Scan Completed</span>
              </div>
              <Badge label={result.mode} variant="default" />
            </div>

            <div className="mb-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-3">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                  Repository
                </div>
                <div className="font-mono text-[12px] text-[var(--text)]">{result.repo}</div>
              </div>
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-3">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                  Branch
                </div>
                <div className="font-mono text-[12px] text-[var(--text)]">{result.branch}</div>
              </div>
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-3">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                  Duration
                </div>
                <div className="font-mono text-[12px] text-[var(--text)]">
                  {(result.scanDuration / 1000).toFixed(2)}s
                </div>
              </div>
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-4">
              {summaryCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
                >
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                    {item.label}
                  </div>
                  <div className={`font-mono text-base font-semibold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-2">
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                  Files Scanned
                </div>
                <div className="font-mono text-[12px] text-[var(--text)]">
                  {result.totalFilesScanned} / {result.totalFilesInRepo}
                </div>
              </div>
              <div className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                  Sensitive Files
                </div>
                <div className="font-mono text-[12px] text-[var(--text)]">
                  {result.summary.sensitiveFilesCount}
                </div>
              </div>
            </div>

            {result.sensitiveFiles.length > 0 && (
              <div className="mb-4 rounded-[8px] border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.08)] p-3">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--amber)]">
                  Sensitive files detected in repository
                </p>
                <p className="font-mono text-[11px] text-[var(--text3)]">
                  {result.sensitiveFiles.join(", ")}
                </p>
              </div>
            )}

            {result.findings.length > 0 ? (
              <div className="overflow-x-auto rounded-[8px] border border-[var(--border)]">
                <table className="min-w-full">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface2)]">
                    <tr>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        File
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        Line
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        Type
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        Risk
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        Masked Value
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]">
                        LLM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.findings.map((finding, index) => (
                      <tr key={`${finding.file}-${finding.line}-${index}`} className="border-b border-[var(--border)] last:border-b-0">
                        <td className="px-3 py-2 font-mono text-[12px] text-[var(--text)]">{finding.file}</td>
                        <td className="px-3 py-2 font-mono text-[12px] text-[var(--text2)]">{finding.line}</td>
                        <td className="px-3 py-2 font-mono text-[12px] text-[var(--text2)]">{finding.secretType}</td>
                        <td className="px-3 py-2">
                          <Badge label={finding.riskLevel} variant="risk" />
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-[var(--text3)]">{finding.maskedValue}</td>
                        <td className="px-3 py-2">
                          <Badge label={finding.llmVerified ? "verified" : "not-verified"} variant="default" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-4">
                <p className="font-mono text-[12px] text-[var(--green)]">No secrets found. Repository is clean.</p>
              </div>
            )}

            {result.autoFix?.success && (
              <div className="mt-4 rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-3">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--green)]">
                  Auto-fix PR Created
                </p>
                <p className="font-mono text-[11px] text-[var(--text3)]">
                  Branch: {result.autoFix.branch || "-"} | Files fixed: {result.autoFix.filesFixed ?? 0}
                </p>
                {result.autoFix.prUrl && (
                  <a
                    href={result.autoFix.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-mono text-[11px] text-[var(--orange)] underline"
                  >
                    Open Pull Request
                  </a>
                )}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] font-mono text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710]"
              >
                View Dashboard
              </Link>
              <Link
                href="/logs"
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] px-3.5 py-[7px] font-mono text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:text-[var(--text)]"
              >
                Incident Log
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
