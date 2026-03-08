"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { CONTRACT_ADDRESS, CRE_OPERATOR_ADDRESS } from "@/config/constants";
import { truncateAddress } from "@/lib/format";

interface SecretIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isValid: boolean;
}

const SECRET_TYPES = ["openai", "aws", "github", "jwt", "generic"] as const;

export function SecretIdInput({ value, onChange, onSubmit, onClear, isValid }: SecretIdInputProps) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [genType, setGenType] = useState("openai");
  const [genRepo, setGenRepo] = useState("");

  const handleGenerate = () => {
    if (!genRepo) return;
    const id = keccak256(toUtf8Bytes(`${genType}_${genRepo}`));
    onChange(id);
  };

  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-[18px]">
      <div className="mb-[7px] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">
          Secret ID &mdash; bytes32
        </span>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="font-mono text-[10px] text-[var(--orange)] hover:underline"
        >
          {showGenerator ? "Direct input" : "Generate from type + repo"}
        </button>
      </div>

      {showGenerator && (
        <div className="mb-3 flex gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-3">
          <select
            value={genType}
            onChange={(e) => setGenType(e.target.value)}
            className="cursor-pointer rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[7px] font-mono text-[11px] text-[var(--text2)] outline-none transition-[border-color] duration-150 focus:border-[var(--orange)]"
          >
            {SECRET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="text"
            value={genRepo}
            onChange={(e) => setGenRepo(e.target.value)}
            placeholder="owner/repo-name"
            spellCheck={false}
            className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] placeholder-[var(--text4)] outline-none transition-[border-color] duration-150 focus:border-[var(--orange)]"
          />
          <button
            onClick={handleGenerate}
            disabled={!genRepo}
            className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Generate
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isValid && onSubmit()}
          placeholder="0xa3f1bc09d2c84411f8a2cc73b91ebc0944f1d2e3..."
          spellCheck={false}
          className={`flex-1 rounded-[6px] border bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] placeholder-[var(--text4)] outline-none transition-[border-color] duration-150 ${
            value && !isValid
              ? "border-[var(--red)]"
              : "border-[var(--border)] focus:border-[var(--orange)]"
          }`}
        />
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Query On-Chain &rarr;
        </button>
        {value && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-2 font-mono text-[10px] leading-[1.7] text-[var(--text3)]">
        Contract: <span className="text-[var(--text2)]">{truncateAddress(CONTRACT_ADDRESS)}</span>
        &nbsp;&middot;&nbsp;
        Operator: <span className="text-[var(--text2)]">{truncateAddress(CRE_OPERATOR_ADDRESS)}</span>
      </div>

      {value && !isValid && (
        <p className="mt-1.5 text-xs text-[var(--red)]">
          Must be a valid bytes32 hex string (0x + 64 hex characters)
        </p>
      )}
    </div>
  );
}
