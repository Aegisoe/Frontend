"use client";

import { useState } from "react";
import { truncateHash } from "@/lib/format";
import { copyToClipboard } from "@/lib/format";

interface HashDisplayProps {
  hash: string;
  href?: string;
  prefixLen?: number;
  suffixLen?: number;
}

export function HashDisplay({ hash, href, prefixLen = 10, suffixLen = 6 }: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(hash);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const display = truncateHash(hash, prefixLen, suffixLen);

  return (
    <span className="inline-flex items-center gap-1.5">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--accent)] hover:underline"
        >
          {display}
        </a>
      ) : (
        <span className="font-mono text-xs text-[var(--muted-foreground)]">{display}</span>
      )}
      <button
        onClick={handleCopy}
        className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        title="Copy"
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </span>
  );
}
