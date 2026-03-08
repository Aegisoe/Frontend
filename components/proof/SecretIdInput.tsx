"use client";

import { useState, useCallback } from "react";
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

type InputMode = "smart" | "direct";
type SecretType = "github" | "openai" | "aws" | "jwt" | "generic";

const SECRET_TYPES: { value: SecretType; label: string; placeholder: string; hint: string }[] = [
  {
    value: "github",
    label: "GitHub",
    placeholder: "https://github.com/owner/repo  or  owner/repo",
    hint: "Paste a GitHub repo URL or type owner/repo",
  },
  {
    value: "openai",
    label: "OpenAI",
    placeholder: "sk-proj-abc123... or project name",
    hint: "Paste the leaked key prefix or project identifier",
  },
  {
    value: "aws",
    label: "AWS",
    placeholder: "AKIA... or resource identifier",
    hint: "Paste the AWS access key prefix or resource name",
  },
  {
    value: "jwt",
    label: "JWT",
    placeholder: "service-name or token identifier",
    hint: "Enter the service name or JWT identifier",
  },
  {
    value: "generic",
    label: "Other",
    placeholder: "any secret identifier",
    hint: "Enter any identifier to generate a secretId",
  },
];

function extractGitHubRepo(input: string): string {
  const trimmed = input.trim();

  // Match GitHub URL patterns
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?)\/?/
  );
  if (urlMatch) return urlMatch[1];

  // Already in owner/repo or owner format
  return trimmed;
}

function generateSecretId(type: SecretType, rawInput: string): string {
  let identifier = rawInput.trim();

  if (type === "github") {
    identifier = extractGitHubRepo(identifier);
  }

  if (!identifier) return "";

  return keccak256(toUtf8Bytes(`${type}_${identifier}`));
}

export function SecretIdInput({ value, onChange, onSubmit, onClear, isValid }: SecretIdInputProps) {
  const [mode, setMode] = useState<InputMode>("smart");
  const [secretType, setSecretType] = useState<SecretType>("github");
  const [rawInput, setRawInput] = useState("");

  const currentType = SECRET_TYPES.find((t) => t.value === secretType)!;

  const handleGenerate = useCallback(() => {
    const id = generateSecretId(secretType, rawInput);
    if (id) {
      onChange(id);
    }
  }, [secretType, rawInput, onChange]);

  const handleRawInputChange = useCallback(
    (val: string) => {
      setRawInput(val);
      // Auto-generate on the fly
      const id = generateSecretId(secretType, val);
      if (id) onChange(id);
    },
    [secretType, onChange]
  );

  const handleTypeChange = useCallback(
    (type: SecretType) => {
      setSecretType(type);
      // Re-generate with new type if there's input
      if (rawInput) {
        const id = generateSecretId(type, rawInput);
        if (id) onChange(id);
      }
    },
    [rawInput, onChange]
  );

  const handleClear = useCallback(() => {
    setRawInput("");
    onClear();
  }, [onClear]);

  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-[18px]">
      {/* Header with mode toggle */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">
          Secret ID &mdash; bytes32
        </span>
        <button
          onClick={() => setMode(mode === "smart" ? "direct" : "smart")}
          className="font-mono text-[10px] text-[var(--orange)] hover:underline"
        >
          {mode === "smart" ? "Direct input" : "Smart input"}
        </button>
      </div>

      {mode === "smart" ? (
        <>
          {/* Type selector tabs */}
          <div className="mb-3 flex gap-1.5">
            {SECRET_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTypeChange(t.value)}
                className={`rounded-[5px] border px-2.5 py-[5px] font-mono text-[11px] font-medium transition-all duration-100 ${
                  secretType === t.value
                    ? "border-[var(--orange-mid)] bg-[var(--orange-dim)] text-[var(--orange)]"
                    : "border-[var(--border)] text-[var(--text3)] hover:border-[var(--border2)] hover:text-[var(--text2)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Smart input field */}
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={rawInput}
              onChange={(e) => handleRawInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value && onSubmit()}
              placeholder={currentType.placeholder}
              spellCheck={false}
              className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-[13px] py-[9px] font-mono text-xs text-[var(--text)] placeholder-[var(--text4)] outline-none transition-[border-color] duration-150 focus:border-[var(--orange)]"
            />
            <button
              onClick={handleGenerate}
              disabled={!rawInput.trim()}
              className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Generate
            </button>
          </div>

          {/* Hint */}
          <p className="mb-3 font-mono text-[10px] text-[var(--text4)]">
            {currentType.hint}
          </p>

          {/* Generated secretId (read-only) */}
          {value && (
            <div className="mb-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] p-2.5">
              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text4)]">
                Generated Secret ID
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all font-mono text-[11px] text-[var(--text2)]">
                  {value}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(value)}
                  className="flex-shrink-0 rounded-[4px] border border-[var(--border)] px-2 py-1 font-mono text-[9px] text-[var(--text3)] transition-colors hover:border-[var(--border2)] hover:text-[var(--text2)]"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              disabled={!value || !isValid}
              className="inline-flex items-center gap-1.5 rounded-[7px] bg-[var(--orange)] px-3.5 py-[7px] text-[13px] font-medium text-white transition-colors hover:bg-[#ea6710] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Query On-Chain &rarr;
            </button>
            {(value || rawInput) && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-transparent px-3.5 py-[7px] text-[13px] font-medium text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
              >
                Clear
              </button>
            )}
          </div>
        </>
      ) : (
        /* Direct bytes32 input mode */
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
      )}

      {/* Contract info */}
      <div className="mt-2.5 font-mono text-[10px] leading-[1.7] text-[var(--text3)]">
        Contract: <span className="text-[var(--text2)]">{truncateAddress(CONTRACT_ADDRESS)}</span>
        &nbsp;&middot;&nbsp;
        Operator: <span className="text-[var(--text2)]">{truncateAddress(CRE_OPERATOR_ADDRESS)}</span>
      </div>

      {/* Validation error for direct mode */}
      {mode === "direct" && value && !isValid && (
        <p className="mt-1.5 text-xs text-[var(--red)]">
          Must be a valid bytes32 hex string (0x + 64 hex characters)
        </p>
      )}
    </div>
  );
}
