"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md border border-[var(--border)] px-2.5 py-1.5 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-1.5 text-xs text-[var(--muted)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors ${
              currentPage === page
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md border border-[var(--border)] px-2.5 py-1.5 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
