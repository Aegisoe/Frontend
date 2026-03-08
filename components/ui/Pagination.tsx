"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize = 10, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems ?? currentPage * pageSize);

  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface2)] px-4 py-[11px]">
      <span className="font-mono text-[11px] text-[var(--text3)]">
        {totalItems !== undefined
          ? `Showing ${from}\u2013${to} of ${totalItems}`
          : `Page ${currentPage} of ${totalPages}`
        }
      </span>
      <div className="flex gap-[3px]">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-[var(--border)] bg-transparent font-mono text-xs text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8249;
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-1 font-mono text-xs text-[var(--text4)]">
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-7 w-7 items-center justify-center rounded-[5px] font-mono text-xs transition-all duration-100 ${
                currentPage === page
                  ? "border border-[var(--orange)] bg-[var(--orange)] text-white"
                  : "border border-[var(--border)] bg-transparent text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-[var(--border)] bg-transparent font-mono text-xs text-[var(--text2)] transition-all duration-100 hover:border-[var(--border2)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
