interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] py-12">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
      )}
    </div>
  );
}
