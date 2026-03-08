"use client";

import { motion } from "framer-motion";

interface PageContainerProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({ title, description, actions, children }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {/* Page header — matches HTML .ph */}
      <div className="flex items-end justify-between border-b border-[var(--border)] bg-[var(--surface)] px-7 pb-[18px] pt-[22px]">
        <div>
          <h1 className="text-[19px] font-bold leading-tight tracking-[-0.025em] text-[var(--text)]">
            {title}
          </h1>
          {description && (
            <p className="mt-[3px] font-mono text-[11px] text-[var(--text3)]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 p-[22px_28px]">
        <div className="flex flex-col gap-[22px]">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
