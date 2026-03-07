"use client";

interface SecretIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function SecretIdInput({ value, onChange, onSubmit, isValid }: SecretIdInputProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
        Secret ID (bytes32)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isValid && onSubmit()}
          placeholder="0x..."
          spellCheck={false}
          className={`flex-1 rounded-md border bg-[var(--background)] px-3 py-2 font-mono text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors ${
            value && !isValid
              ? "border-[var(--critical)]"
              : "border-[var(--border)] focus:border-[var(--accent)]"
          }`}
        />
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Query
        </button>
      </div>
      {value && !isValid && (
        <p className="mt-1.5 text-xs text-[var(--critical)]">
          Must be a valid bytes32 hex string (0x + 64 hex characters)
        </p>
      )}
    </div>
  );
}
