"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useScanRepo } from "@/hooks/useScanRepo";
import { Badge } from "@/components/ui/Badge";

function isValidGitHubUrl(value: string): boolean {
  if (!value.trim()) return true; // empty is ok
  return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9._-]+(\/[a-zA-Z0-9._-]+)?\/?$/.test(
    value.trim()
  );
}

export function ScanForm() {
  const [url, setUrl] = useState("");
  const { scan, isScanning, result, error, scanMode, reset } = useScanRepo();

  const valid = isValidGitHubUrl(url);
  const canSubmit = url.trim().length > 0 && valid && !isScanning;

  const handleSubmit = useCallback(() => {
    if (canSubmit) scan(url);
  }, [canSubmit, scan, url]);

  const handleClear = useCallback(() => {
    setUrl("");
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Input card */}
      <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-[18px]">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">
            GitHub Repository URL
          </span>
          {scanMode && (
            <Badge
              label={scanMode === "scan" ? "Live Scan" : "Demo Mode"}
              variant={scanMode === "scan" ? "status" : "default"}
            />
          )}
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
              url && !valid
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

        {url && !valid && (
          <p className="text-xs text-[var(--red)]">
            Enter a valid GitHub URL (e.g. https://github.com/owner/repo)
          </p>
        )}

        <p className="font-mono text-[10px] text-[var(--text4)]">
          Paste a GitHub repository URL to scan for leaked secrets. The backend will run regex + entropy + LLM detection.
        </p>
      </div>

      {/* Scanning animation */}
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
              <span className="text-[13px] font-semibold text-[var(--orange)]">
                Scanning repository...
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-[var(--text3)]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Layer 1: Regex pattern matching...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Layer 2: Shannon entropy analysis...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                Layer 3: LLM risk classification...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[10px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] p-4"
          >
            <div className="mb-1 text-[13px] font-semibold text-[var(--red)]">Scan Failed</div>
            <p className="font-mono text-[11px] text-[var(--text3)]">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(34,197,94,0.1)] text-[var(--green)]">
                  &#10003;
                </div>
                <span className="text-[13px] font-semibold text-[var(--text)]">
                  Scan Complete
                </span>
              </div>
              <Badge
                label={result.mode === "scan" ? "Live Scan" : "Demo Trigger"}
                variant="default"
              />
            </div>

            <div className="mb-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-3">
              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                Repository
              </div>
              <div className="font-mono text-[12px] text-[var(--text)]">{result.repo}</div>
            </div>

            <p className="mb-4 font-mono text-[11px] text-[var(--text3)]">{result.message}</p>

            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] font-mono text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710]"
              >
                View Dashboard &rarr;
              </Link>
              <Link
                href="/logs"
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] px-3.5 py-[7px] font-mono text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:text-[var(--text)]"
              >
                Incident Log
              </Link>
            </div>

            {result.mode === "demo" && (
              <div className="mt-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface2)] p-2.5">
                <p className="font-mono text-[10px] text-[var(--text4)]">
                  Running in demo mode — backend &apos;/scan&apos; endpoint not available. Incident was created via /demo/trigger. Ask your backend dev to implement the /scan endpoint for real GitHub repo scanning.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
