"use client";

import { useState } from "react";
import { truncateHash, copyToClipboard } from "@/lib/format";

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
          className="inline-flex items-center gap-[2px] font-mono text-[11px] text-[var(--orange)] no-underline hover:underline"
        >
          {display} &#8599;
        </a>
      ) : (
        <span className="font-mono text-xs text-[var(--text2)]">{display}</span>
      )}
      <button
        onClick={handleCopy}
        className={`rounded-[4px] border px-1.5 py-px font-mono text-[10px] transition-all duration-100 ${
          copied
            ? "border-[var(--green)] text-[var(--green)]"
            : "border-[var(--border)] bg-[var(--surface3)] text-[var(--text3)] hover:border-[var(--orange)] hover:text-[var(--orange)]"
        }`}
      >
        {copied ? "copied!" : "copy"}
      </button>
    </span>
  );
}
