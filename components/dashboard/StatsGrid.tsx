"use client";

import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
          <p className={`mt-1 font-mono text-2xl font-semibold ${stat.color ?? "text-[var(--foreground)]"}`}>
            {stat.value}
          </p>
          {stat.subtitle && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{stat.subtitle}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
