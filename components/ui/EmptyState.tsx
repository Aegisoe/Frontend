interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)] py-12">
      <p className="text-sm font-medium text-[var(--text2)]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--text3)]">{description}</p>
      )}
    </div>
  );
}
